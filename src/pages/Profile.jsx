import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { logout } from "../services/authSlice";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from "../services/api";
import Navbar from "../components/Navbar";
import {
  FaEdit,
  FaBell,
  FaSignOutAlt,
  FaGlobe,
  FaQrcode,
  FaChartLine,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCode, setQRCode] = useState(null);

  const { data: profile, isLoading } = useGetProfileQuery();
  const { data: notifications } = useGetNotificationsQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [markRead] = useMarkNotificationReadMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    weight: "",
    height: "",
    region: "",
  });

  const handleEditClick = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        weight: profile.weight.toString(),
        height: profile.heightCm.toString(),
        region: profile.region,
      });
      setShowEditModal(true);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        ...formData,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
      }).unwrap();

      setShowEditModal(false);
      alert(t("success"));
    } catch (error) {
      alert(error.data?.message || t("error"));
    }
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    updateProfile({ language: lang });
    setShowLanguageModal(false);
  };

  const handleLogout = () => {
    if (confirm("Chiqishni xohlaysizmi?")) {
      dispatch(logout());
      navigate("/login");
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markRead(notification._id);
    }
  };

  const generateQR = async () => {
    if (profile) {
      try {
        const response = await fetch(`/api/doctor/patient-qr/${profile._id}`);
        const data = await response.json();
        setQRCode(data.qrCode);
        setShowQRModal(true);
      } catch (error) {
        alert("QR kod yaratishda xatolik");
      }
    }
  };

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              {profile?.firstName} {profile?.lastName}
            </h1>
            <p className="text-primary-100">
              {profile?.age} yosh •{" "}
              {profile?.gender === "male" ? "Erkak" : "Ayol"}
            </p>
          </div>

          <button
            onClick={() => setShowNotifications(true)}
            className="relative bg-white/20 w-12 h-12 rounded-full flex items-center justify-center"
          >
            <FaBell className="text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{profile?.weight}</p>
            <p className="text-sm text-primary-100">kg</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{profile?.heightCm}</p>
            <p className="text-sm text-primary-100">sm</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">
              {profile
                ? (profile.weight / profile.heightM ** 2).toFixed(1)
                : "-"}
            </p>
            <p className="text-sm text-primary-100">BMI</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <button
          onClick={handleEditClick}
          className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 w-12 h-12 rounded-xl flex items-center justify-center">
              <FaEdit className="text-primary-600 text-xl" />
            </div>
            <span className="text-lg font-semibold text-gray-800">
              Profilni tahrirlash
            </span>
          </div>
        </button>

        <button
          onClick={() => setShowLanguageModal(true)}
          className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="bg-success-100 w-12 h-12 rounded-xl flex items-center justify-center">
              <FaGlobe className="text-success-600 text-xl" />
            </div>
            <span className="text-lg font-semibold text-gray-800">
              Tilni o'zgartirish
            </span>
          </div>
          <span className="text-gray-600">
            {i18n.language === "uz"
              ? "O'zbekcha"
              : i18n.language === "ru"
              ? "Русский"
              : "Қарақалпақша"}
          </span>
        </button>

        <button
          onClick={generateQR}
          className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="bg-warning-100 w-12 h-12 rounded-xl flex items-center justify-center">
              <FaQrcode className="text-warning-600 text-xl" />
            </div>
            <span className="text-lg font-semibold text-gray-800">
              Doctor uchun QR kod
            </span>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="bg-danger-100 w-12 h-12 rounded-xl flex items-center justify-center">
              <FaSignOutAlt className="text-danger-600 text-xl" />
            </div>
            <span className="text-lg font-semibold text-gray-800">
              {t("logout")}
            </span>
          </div>
        </button>

        {profile?.hasDiabetes && (
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-4 border-2 border-primary-200">
            <div className="flex items-start gap-3">
              <FaChartLine className="text-primary-600 text-2xl mt-1" />
              <div>
                <p className="text-lg font-bold text-primary-900 mb-2">
                  Diabet kundaligi faol
                </p>
                <p className="text-gray-700">
                  Siz barcha funktsiyalardan foydalanishingiz mumkin
                </p>
              </div>
            </div>
          </div>
        )}

        {profile?.screeningResults && profile.screeningResults.length > 0 && (
          <div className="bg-gradient-to-br from-warning-50 to-warning-100 rounded-2xl p-4 border-2 border-warning-200">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-warning-600 text-2xl mt-1" />
              <div>
                <p className="text-lg font-bold text-warning-900 mb-2">
                  Skrining natijalari mavjud
                </p>
                <p className="text-gray-700">
                  Siz {profile.screeningResults.length} ta kasallik xavfi haqida
                  ogohlantirildingiz
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Profilni tahrirlash
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  {t("firstName")}
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  {t("lastName")}
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  {t("weight")}
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  required
                  step="0.1"
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  {t("height")}
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                  required
                  step="0.1"
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  {t("region")}
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-semibold py-3 rounded-xl transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-lg font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isUpdating ? t("loading") : t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Tilni tanlang
            </h2>

            <div className="space-y-3">
              {[
                { code: "uz", name: "O'zbekcha", flag: "🇺🇿" },
                { code: "ru", name: "Русский", flag: "🇷🇺" },
                { code: "kaa", name: "Қарақалпақша", flag: "🇺🇿" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${
                    i18n.language === lang.code
                      ? "bg-primary-100 border-2 border-primary-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <span className="text-lg font-semibold text-gray-800">
                      {lang.name}
                    </span>
                  </div>
                  {i18n.language === lang.code && (
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-semibold py-3 rounded-xl transition-colors"
            >
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t("notifications")}
            </h2>

            {notifications && notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 rounded-xl cursor-pointer transition-colors ${
                      notification.read
                        ? "bg-gray-50"
                        : "bg-primary-50 border-2 border-primary-200"
                    }`}
                  >
                    <p
                      className={`text-gray-800 ${
                        !notification.read ? "font-semibold" : ""
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Bildirishnomalar yo'q
              </p>
            )}

            <button
              onClick={() => setShowNotifications(false)}
              className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-semibold py-3 rounded-xl transition-colors"
            >
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && qrCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Doctor uchun QR kod
            </h2>

            <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 mb-4">
              <img
                src={qrCode}
                alt="Patient QR Code"
                className="w-full max-w-xs mx-auto"
              />
            </div>

            <p className="text-center text-gray-600 mb-4">
              Bu QR kodni shifokorga ko'rsating
            </p>

            <button
              onClick={() => setShowQRModal(false)}
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
