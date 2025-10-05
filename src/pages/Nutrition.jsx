import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  useAnalyzeFoodMutation,
  useSaveNutritionMutation,
  useGetNutritionQuery,
} from "../services/api";
import Navbar from "../components/Navbar";
import { FaCamera, FaTrash, FaCheck, FaImage, FaTimes } from "react-icons/fa";

export default function Nutrition() {
  const { t } = useTranslation();
  const [mealType, setMealType] = useState("breakfast");
  const [foods, setFoods] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const { data: nutritionHistory } = useGetNutritionQuery({
    period: "daily",
    date: new Date().toISOString().split("T")[0],
  });

  const [analyzeFood] = useAnalyzeFoodMutation();
  const [saveNutrition, { isLoading: isSaving }] = useSaveNutritionMutation();

  // Kamerani ochish
  const openCamera = async () => {
    setShowCameraOptions(false);
    setShowCamera(true);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Orqa kamera
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Kamera ochilmadi:", error);
      alert("Kameraga ruxsat bermadingiz yoki kamera ishlamayapti");
      setShowCamera(false);
    }
  };

  // Rasm olish
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Canvas o'lchamini videoga moslash
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Rasmni chizish
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Base64 ga o'girish
    const imageData = canvas.toDataURL("image/jpeg", 0.8);

    // Kamerani yopish
    closeCamera();

    // Tahlil qilish
    analyzeImage(imageData);
  };

  // Kamerani yopish
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  // Galereyadan tanlash
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setShowCameraOptions(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      analyzeImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Rasmni tahlil qilish
  const analyzeImage = async (imageData) => {
    setIsAnalyzing(true);

    try {
      const result = await analyzeFood({ image: imageData }).unwrap();

      setFoods([
        ...foods,
        {
          image: imageData,
          ...result,
        },
      ]);
    } catch (error) {
      alert(error.data?.message || t("error"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveFood = (index) => {
    setFoods(foods.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (foods.length === 0) {
      alert(t("addAnotherFood"));
      return;
    }

    try {
      await saveNutrition({
        mealType,
        date: new Date().toISOString().split("T")[0],
        foods,
      }).unwrap();

      setFoods([]);
      alert(t("success"));
    } catch (error) {
      alert(error.data?.message || t("error"));
    }
  };

  const totalSugar = foods.reduce((sum, f) => sum + (f.sugarContent || 0), 0);
  const totalCalories = foods.reduce((sum, f) => sum + (f.calories || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-warning-600 text-white p-6 rounded-b-3xl">
        <h1 className="text-3xl font-bold mb-4">{t("nutrition")}</h1>

        <div className="flex gap-2 overflow-x-auto">
          {["breakfast", "lunch", "dinner", "snack"].map((type) => (
            <button
              key={type}
              onClick={() => setMealType(type)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap ${
                mealType === type
                  ? "bg-white text-warning-600"
                  : "bg-warning-500 text-white"
              }`}
            >
              {t(type)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {foods.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              {t("todayMeal")} {t(mealType)}
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-3 bg-danger-50 rounded-xl">
                <p className="text-2xl font-bold text-danger-600">
                  {totalSugar.toFixed(1)}g
                </p>
                <p className="text-gray-600 text-sm">{t("sugar")}</p>
              </div>
              <div className="text-center p-3 bg-warning-50 rounded-xl">
                <p className="text-2xl font-bold text-warning-600">
                  {totalCalories.toFixed(0)}
                </p>
                <p className="text-gray-600 text-sm">{t("calories")}</p>
              </div>
            </div>

            <div className="space-y-3">
              {foods.map((food, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl p-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={food.image}
                      alt="Food"
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">
                        {food.foodName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t("sugar")}: {food.sugarContent}g
                      </p>
                      <p className="text-sm text-gray-600">
                        {t("calories")}: {food.calories}
                      </p>
                      {food.feedback && (
                        <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded-lg">
                          💡 {food.feedback}
                        </p>
                      )}
                      <span
                        className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                          food.status === "normal"
                            ? "bg-success-100 text-success-700"
                            : food.status === "warning"
                            ? "bg-warning-100 text-warning-700"
                            : "bg-danger-100 text-danger-700"
                        }`}
                      >
                        {food.status === "normal"
                          ? "Normal"
                          : food.status === "warning"
                          ? t("mediumRisk")
                          : t("highRisk")}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveFood(index)}
                      className="text-danger-600 hover:text-danger-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full mt-4 bg-success-600 hover:bg-success-700 text-white text-lg font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaCheck /> {isSaving ? t("loading") : t("save")}
            </button>
          </div>
        )}

        {/* Camera View - Full Screen */}
        {showCamera && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="flex-1 relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Close button */}
              <button
                onClick={closeCamera}
                className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>

              {/* Guide overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-4 border-white/50 rounded-2xl w-64 h-64"></div>
              </div>
            </div>

            {/* Capture button */}
            <div className="p-8 bg-gradient-to-t from-black/80 to-transparent">
              <button
                onClick={capturePhoto}
                className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
              >
                <div className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full"></div>
              </button>
              <p className="text-white text-center mt-4 text-lg">
                Ovqatni ramka ichiga joylashtiring
              </p>
            </div>
          </div>
        )}

        {/* Options Modal */}
        {showCameraOptions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Tanlang
              </h2>

              <div className="space-y-3">
                <button
                  onClick={openCamera}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-3"
                >
                  <FaCamera className="text-2xl" />
                  Rasmga olish
                </button>

                <button
                  onClick={() => {
                    setShowCameraOptions(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-3"
                >
                  <FaImage className="text-2xl" />
                  Galereyadan tanlash
                </button>

                <button
                  onClick={() => setShowCameraOptions(false)}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-semibold py-4 rounded-xl transition-colors"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowCameraOptions(true)}
          disabled={isAnalyzing}
          className="w-full bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border-2 border-dashed border-warning-300 flex flex-col items-center justify-center gap-3 disabled:opacity-50"
        >
          <div className="bg-warning-100 w-16 h-16 rounded-full flex items-center justify-center">
            {isAnalyzing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warning-600"></div>
            ) : (
              <FaCamera className="text-warning-600 text-3xl" />
            )}
          </div>
          <p className="text-xl font-semibold text-gray-800">
            {isAnalyzing ? t("analyzing") : t("takeFoodPhoto")}
          </p>
          <p className="text-gray-600">
            {foods.length > 0 ? t("addAnotherFood") : t("clickToStart")}
          </p>
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Nutrition History */}
        {nutritionHistory && nutritionHistory.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t("todayMeals")}
            </h2>

            <div className="space-y-3">
              {nutritionHistory.map((meal) => (
                <div
                  key={meal._id}
                  className="bg-white rounded-2xl p-4 shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {t(meal.mealType)}
                      </h3>
                      <p className="text-gray-600">
                        {new Date(meal.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {t("sugar")}:{" "}
                        <span className="font-bold text-danger-600">
                          {meal.totalSugar}g
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {t("calories")}:{" "}
                        <span className="font-bold text-warning-600">
                          {meal.totalCalories}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {meal.foods.slice(0, 4).map((food, idx) => (
                      <img
                        key={idx}
                        src={food.image}
                        alt="Food"
                        className="w-full h-20 object-cover rounded-xl"
                      />
                    ))}
                  </div>
                  {meal.foods.length > 4 && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      +{meal.foods.length - 4} {t("foods")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
}
