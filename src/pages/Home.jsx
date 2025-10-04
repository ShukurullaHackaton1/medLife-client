import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetProfileQuery, useGetNotificationsQuery } from "../services/api";
import Navbar from "../components/Navbar";
import {
  FaTint,
  FaRunning,
  FaPills,
  FaUtensils,
  FaComments,
  FaUsers,
  FaBell,
} from "react-icons/fa";

export default function Home() {
  const { t } = useTranslation();
  const { data: profile } = useGetProfileQuery();
  const { data: notifications } = useGetNotificationsQuery();

  const unreadNotifications = notifications?.filter((n) => !n.read).length || 0;

  const quickActions = [
    {
      path: "/glucometer",
      icon: FaTint,
      label: t("glucometer"),
      color: "bg-danger-500",
    },
    {
      path: "/physical",
      icon: FaRunning,
      label: t("physical"),
      color: "bg-success-500",
    },
    {
      path: "/medication",
      icon: FaPills,
      label: t("medication"),
      color: "bg-primary-500",
    },
    {
      path: "/nutrition",
      icon: FaUtensils,
      label: t("nutrition"),
      color: "bg-warning-500",
    },
    {
      path: "/chat",
      icon: FaComments,
      label: t("chat"),
      color: "bg-purple-500",
    },
    {
      path: "/family",
      icon: FaUsers,
      label: t("family"),
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{t("welcome")}</h1>
            <p className="text-xl opacity-90">
              {profile?.firstName} {profile?.lastName}
            </p>
          </div>

          <Link to="/profile" className="relative">
            <FaBell className="text-3xl" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </Link>
        </div>

        {profile?.hasDiabetes && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mt-4">
            <p className="text-lg font-semibold">📊 Diabet kundaligi</p>
            <p className="text-sm opacity-90 mt-1">
              Kunlik ma'lumotlaringizni kuzatib boring
            </p>
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tezkor kirish</h2>

        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.path}
                to={action.path}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div
                  className={`${action.color} w-14 h-14 rounded-xl flex items-center justify-center mb-3`}
                >
                  <Icon className="text-white text-2xl" />
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {action.label}
                </p>
              </Link>
            );
          })}
        </div>

        {profile?.screeningResults && profile.screeningResults.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Skrining natijalari
            </h2>

            <div className="space-y-3">
              {profile.screeningResults.slice(0, 3).map((result, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 shadow-md">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {result.disease}
                  </h3>
                  <p className="text-gray-600">{result.doctorType}</p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
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

      <Navbar />
    </div>
  );
}
