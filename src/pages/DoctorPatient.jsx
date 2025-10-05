import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetPatientDataQuery } from "../services/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaTint, FaRunning, FaPills, FaUtensils } from "react-icons/fa";

export default function DoctorPatient() {
  const { t } = useTranslation();
  const { userId } = useParams();
  const { data, isLoading, error } = useGetPatientDataQuery(userId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">{t("loadingData")}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center">
          <p className="text-2xl font-bold text-danger-600 mb-2">
            {t("error")}
          </p>
          <p className="text-gray-600">{t("cannotLoadPatientData")}</p>
        </div>
      </div>
    );
  }

  const {
    patient,
    glucometerData,
    physicalData,
    medications,
    nutritionData,
    summary,
  } = data;

  const glucoseChartData = glucometerData
    .slice(0, 10)
    .reverse()
    .map((g) => ({
      name: new Date(g.date).toLocaleDateString(),
      value: g.value,
    }));

  const physicalChartData = physicalData
    .slice(0, 10)
    .reverse()
    .map((p) => ({
      name: new Date(p.date).toLocaleDateString(),
      km: p.distanceKm,
    }));

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-6">
        <h1 className="text-3xl font-bold mb-2">{t("patientData")}</h1>
        <p className="text-primary-100">{t("doctorDiagnosisSystem")}</p>
      </div>

      {/* Patient Info */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("patientInfo")}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">{t("fullName")}</p>
              <p className="text-xl font-bold text-gray-800">
                {patient.firstName} {patient.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-600">{t("age")}</p>
              <p className="text-xl font-bold text-gray-800">{patient.age}</p>
            </div>
            <div>
              <p className="text-gray-600">{t("gender")}</p>
              <p className="text-xl font-bold text-gray-800">
                {t(patient.gender)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                {t("weight")} / {t("heightLabel")}
              </p>
              <p className="text-xl font-bold text-gray-800">
                {patient.weight}kg / {patient.heightCm}cm
              </p>
            </div>
            <div>
              <p className="text-gray-600">BMI</p>
              <p className="text-xl font-bold text-gray-800">
                {(patient.weight / patient.heightM ** 2).toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">{t("region")}</p>
              <p className="text-xl font-bold text-gray-800">
                {patient.region}
              </p>
            </div>
          </div>

          {patient.hasDiabetes && (
            <div className="mt-4 p-4 bg-danger-50 rounded-xl border-2 border-danger-200">
              <p className="text-lg font-bold text-danger-700">
                ⚠️ {t("hasDiabetes")}
              </p>
            </div>
          )}

          {patient.screeningResults && patient.screeningResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                {t("screeningResults")}
              </h3>
              <div className="space-y-2">
                {patient.screeningResults.map((result, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                    <p className="font-semibold text-gray-800">
                      {result.disease}
                    </p>
                    <p className="text-sm text-gray-600">{result.doctorType}</p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                        result.risk === "Yuqori" ||
                        result.risk === "Жоқары" ||
                        result.risk === "Высокий"
                          ? "bg-danger-100 text-danger-700"
                          : "bg-warning-100 text-warning-700"
                      }`}
                    >
                      {result.risk} {t("risk")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-danger-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <FaTint className="text-danger-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">{t("averageGlucose")}</p>
                <p className="text-2xl font-bold text-danger-600">
                  {summary.averageGlucose}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-success-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <FaRunning className="text-success-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">{t("totalDistance")}</p>
                <p className="text-2xl font-bold text-success-600">
                  {summary.totalDistanceKm} km
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <FaPills className="text-primary-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">{t("medicationCount")}</p>
                <p className="text-2xl font-bold text-primary-600">
                  {summary.medicationCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-warning-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <FaUtensils className="text-warning-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">{t("averageCalories")}</p>
                <p className="text-2xl font-bold text-warning-600">
                  {summary.averageCalories}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Glucometer Chart */}
        {glucoseChartData.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t("glucoseDynamics")}
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={glucoseChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Physical Activity Chart */}
        {physicalChartData.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t("physicalActivity")}
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={physicalChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="km" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Medications */}
        {medications.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t("currentMedications")}
            </h2>
            <div className="space-y-3">
              {medications.map((med) => (
                <div key={med._id} className="p-3 bg-gray-50 rounded-xl">
                  <p className="font-bold text-gray-800">{med.name}</p>
                  {med.dosage && (
                    <p className="text-sm text-gray-600">{med.dosage}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {med.times.map((time, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Nutrition */}
        {nutritionData.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t("recentMeals")}
            </h2>
            <div className="space-y-3">
              {nutritionData.slice(0, 5).map((meal) => (
                <div key={meal._id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-800">
                        {t(meal.mealType)}
                      </p>
                      <p className="text-sm text-gray-600">
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
                  <p className="text-xs text-gray-500">
                    {meal.foods.length} {t("foodItems")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
