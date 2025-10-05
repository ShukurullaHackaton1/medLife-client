import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetInviteLinkQuery,
  useGetFamilyMembersQuery,
  useGetFamilyMemberQuery,
} from "../services/api";
import Navbar from "../components/Navbar";
import {
  FaQrcode,
  FaLink,
  FaUsers,
  FaChevronRight,
  FaExclamationCircle,
  FaTimes,
  FaTint,
  FaRunning,
  FaPills,
  FaUtensils,
  FaChartLine,
} from "react-icons/fa";
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

export default function Family() {
  const { t } = useTranslation();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const { data: inviteData } = useGetInviteLinkQuery(undefined, {
    skip: !showInviteModal,
  });
  const {
    data: familyData,
    isLoading,
    error,
    refetch,
  } = useGetFamilyMembersQuery();

  // Tanlangan a'zoning to'liq ma'lumotlari
  const { data: memberDetails, isLoading: isLoadingDetails } =
    useGetFamilyMemberQuery(selectedMemberId, { skip: !selectedMemberId });

  const copyToClipboard = () => {
    if (inviteData?.inviteUrl) {
      navigator.clipboard.writeText(inviteData.inviteUrl);
      alert("Link nusxalandi!");
    }
  };

  const handleMemberClick = (memberId) => {
    setSelectedMemberId(memberId);
  };

  const closeMemberModal = () => {
    setSelectedMemberId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-pink-600 text-white p-6 rounded-b-3xl">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-4">
          <FaUsers className="text-4xl" />
          Oila
        </h1>

        <button
          onClick={() => setShowInviteModal(true)}
          className="w-full bg-white text-pink-600 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-pink-50 transition-colors"
        >
          <FaQrcode className="text-xl" />
          Oila a'zosini qo'shish
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Oila a'zolari</h2>
          <button
            onClick={() => refetch()}
            className="text-primary-600 font-medium text-sm"
          >
            🔄 Yangilash
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yuklanmoqda...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <FaExclamationCircle className="text-5xl text-danger-600 mx-auto mb-4" />
            <p className="text-xl text-danger-600 mb-2">Xatolik yuz berdi</p>
            <p className="text-gray-600 mb-4">
              {error?.data?.message || "Ma'lumotlarni yuklab bo'lmadi"}
            </p>
            <button
              onClick={() => refetch()}
              className="bg-pink-600 text-white px-6 py-2 rounded-xl"
            >
              Qayta urinish
            </button>
          </div>
        ) : familyData &&
          familyData.members &&
          familyData.members.length > 0 ? (
          <div className="space-y-3">
            {familyData.members.map((member) => (
              <button
                key={member._id}
                onClick={() => handleMemberClick(member._id)}
                className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-2xl font-bold">
                    {member.firstName?.charAt(0) || "?"}
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-800">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-gray-600">
                      {member.age} yosh •{" "}
                      {member.gender === "male" ? "Erkak" : "Ayol"}
                    </p>
                    {member.hasDiabetes && (
                      <span className="inline-block mt-1 px-2 py-1 bg-danger-100 text-danger-700 text-xs rounded-full font-medium">
                        Diabet
                      </span>
                    )}
                  </div>
                </div>

                <FaChevronRight className="text-gray-400 text-xl" />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaUsers className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-4">
              Hozircha oila a'zolari yo'q
            </p>
            <p className="text-gray-600 mb-6">
              Oila a'zolaringizni qo'shish uchun ularga havola yuboring
            </p>
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2"
            >
              <FaQrcode /> Oila qo'shish
            </button>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && inviteData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Oila a'zosini qo'shish
            </h2>

            <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 mb-4">
              <img
                src={inviteData.qrCode}
                alt="QR Code"
                className="w-full max-w-xs mx-auto"
              />
            </div>

            <p className="text-center text-gray-600 mb-4">
              Bu QR kodni skanerlang yoki linkni ulashing
            </p>

            <div className="bg-gray-50 p-4 rounded-xl mb-4 flex items-center gap-3">
              <input
                type="text"
                value={inviteData.inviteUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap"
              >
                <FaLink /> Nusxa
              </button>
            </div>

            <button
              onClick={() => setShowInviteModal(false)}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-semibold py-3 rounded-xl transition-colors"
            >
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMemberId && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {isLoadingDetails ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Ma'lumotlar yuklanmoqda...</p>
              </div>
            ) : memberDetails ? (
              <MemberDetailsContent
                member={memberDetails}
                onClose={closeMemberModal}
              />
            ) : (
              <div className="p-8 text-center">
                <p className="text-danger-600">Ma'lumotlarni yuklab bo'lmadi</p>
                <button
                  onClick={closeMemberModal}
                  className="mt-4 bg-gray-300 px-6 py-2 rounded-xl"
                >
                  Yopish
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}

// Oila a'zosining batafsil ma'lumotlari komponenti
function MemberDetailsContent({ member, onClose }) {
  const patient = member.patient;
  const glucometerData = member.glucometerData || [];
  const physicalData = member.physicalData || [];
  const medications = member.medications || [];
  const nutritionData = member.nutritionData || [];
  const summary = member.summary || {};

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
    <>
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-br from-primary-600 to-primary-800 text-white p-6 rounded-t-3xl md:rounded-t-3xl flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {patient.firstName} {patient.lastName}
          </h2>
          <p className="text-primary-100">Oila a'zosi ma'lumotlari</p>
        </div>
        <button
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        >
          <FaTimes className="text-2xl" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Patient Info */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Shaxsiy ma'lumotlar
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Yosh</p>
              <p className="text-xl font-bold text-gray-800">{patient.age}</p>
            </div>
            <div>
              <p className="text-gray-600">Jinsi</p>
              <p className="text-xl font-bold text-gray-800">
                {patient.gender === "male" ? "Erkak" : "Ayol"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Vazn / Bo'y</p>
              <p className="text-xl font-bold text-gray-800">
                {patient.weight}kg / {patient.heightCm}sm
              </p>
            </div>
            <div>
              <p className="text-gray-600">BMI</p>
              <p className="text-xl font-bold text-gray-800">
                {(patient.weight / patient.heightM ** 2).toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Mintaqa</p>
              <p className="text-xl font-bold text-gray-800">
                {patient.region}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Telefon</p>
              <p className="text-xl font-bold text-gray-800">{patient.phone}</p>
            </div>
          </div>

          {patient.hasDiabetes && (
            <div className="mt-4 p-4 bg-danger-50 rounded-xl border-2 border-danger-200">
              <p className="text-lg font-bold text-danger-700">
                ⚠️ Qandli diabet kasalligi bor
              </p>
            </div>
          )}

          {patient.screeningResults && patient.screeningResults.length > 0 && (
            <div className="mt-4">
              <h4 className="text-lg font-bold text-gray-800 mb-3">
                Skrining natijalari
              </h4>
              <div className="space-y-2">
                {patient.screeningResults.map((result, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                    <p className="font-semibold text-gray-800">
                      {result.disease}
                    </p>
                    <p className="text-sm text-gray-600">{result.doctorType}</p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                        result.risk === "Yuqori"
                          ? "bg-danger-100 text-danger-700"
                          : "bg-warning-100 text-warning-700"
                      }`}
                    >
                      {result.risk} xavf
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {patient.hasDiabetes && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-danger-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <FaTint className="text-danger-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">O'rtacha glukoza</p>
                  <p className="text-2xl font-bold text-danger-600">
                    {summary.averageGlucose || 0}
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
                  <p className="text-gray-600 text-sm">Jami masofa</p>
                  <p className="text-2xl font-bold text-success-600">
                    {summary.totalDistanceKm || 0} km
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
                  <p className="text-gray-600 text-sm">Dorilar soni</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {summary.medicationCount || 0}
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
                  <p className="text-gray-600 text-sm">O'rtacha kaloriya</p>
                  <p className="text-2xl font-bold text-warning-600">
                    {summary.averageCalories || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Glucometer Chart */}
        {glucoseChartData.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaChartLine className="text-danger-600" />
              Glukoza dinamikasi
            </h3>
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
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaRunning className="text-success-600" />
              Jismoniy faollik
            </h3>
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
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaPills className="text-primary-600" />
              Qabul qilayotgan dorilar
            </h3>
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
          <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaUtensils className="text-warning-600" />
              So'nggi ovqatlanish
            </h3>
            <div className="space-y-3">
              {nutritionData.slice(0, 5).map((meal) => (
                <div key={meal._id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-800">
                        {meal.mealType === "breakfast"
                          ? "Nonushta"
                          : meal.mealType === "lunch"
                          ? "Tushlik"
                          : meal.mealType === "dinner"
                          ? "Kechki ovqat"
                          : "Gazak"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(meal.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Shakar:{" "}
                        <span className="font-bold text-danger-600">
                          {meal.totalSugar}g
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Kaloriya:{" "}
                        <span className="font-bold text-warning-600">
                          {meal.totalCalories}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {meal.foods.length} ta ovqat
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-semibold py-3 rounded-xl transition-colors"
        >
          Yopish
        </button>
      </div>
    </>
  );
}
