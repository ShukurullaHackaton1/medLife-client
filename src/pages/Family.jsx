import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetInviteLinkQuery,
  useGetFamilyMembersQuery,
} from "../services/api";
import Navbar from "../components/Navbar";
import {
  FaQrcode,
  FaLink,
  FaUsers,
  FaChevronRight,
  FaExclamationCircle,
} from "react-icons/fa";

export default function Family() {
  const { t } = useTranslation();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { data: inviteData } = useGetInviteLinkQuery(undefined, {
    skip: !showInviteModal,
  });
  const {
    data: familyData,
    isLoading,
    error,
    refetch,
  } = useGetFamilyMembersQuery();

  const copyToClipboard = () => {
    if (inviteData?.inviteUrl) {
      navigator.clipboard.writeText(inviteData.inviteUrl);
      alert("Link nusxalandi!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-pink-600 text-white p-6 rounded-b-3xl">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-4">
          <FaUsers className="text-4xl" />
          {t("family")}
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
              <div
                key={member._id}
                className="bg-white rounded-2xl p-4 shadow-md flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-2xl font-bold">
                    {member.firstName?.charAt(0) || "?"}
                  </div>
                  <div>
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
              </div>
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

      <Navbar />
    </div>
  );
}
