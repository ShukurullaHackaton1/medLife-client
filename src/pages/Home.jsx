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
  FaRobot,
  FaUserFriends,
  FaHeartbeat,
  FaChartLine,
} from "react-icons/fa";

export default function Home() {
  const { t } = useTranslation();
  const { data: profile } = useGetProfileQuery();
  const { data: notifications } = useGetNotificationsQuery();

  const unreadNotifications = notifications?.filter((n) => !n.read).length || 0;

  const baseActions = [
    {
      path: "/chat",
      icon: FaComments,
      label: "AI Chat",
      color: "bg-purple-500",
    },
    {
      path: "/family",
      icon: FaUsers,
      label: "Oila",
      color: "bg-pink-500",
    },
  ];

  const diabetesActions = [
    {
      path: "/glucometer",
      icon: FaTint,
      label: "Glukometr",
      color: "bg-danger-500",
    },
    {
      path: "/physical",
      icon: FaRunning,
      label: "Jismoniy faollik",
      color: "bg-success-500",
    },
    {
      path: "/medication",
      icon: FaPills,
      label: "Dorilar",
      color: "bg-primary-500",
    },
    {
      path: "/nutrition",
      icon: FaUtensils,
      label: "Ovqatlanish",
      color: "bg-warning-500",
    },
  ];

  const quickActions = profile?.hasDiabetes
    ? [...diabetesActions, ...baseActions]
    : baseActions;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Xush kelibsiz</h1>
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

        {profile?.hasDiabetes ? (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mt-4">
            <div className="flex items-center gap-3">
              <FaChartLine className="text-2xl" />
              <div>
                <p className="text-lg font-semibold">Diabet kundaligi</p>
                <p className="text-sm opacity-90 mt-1">
                  Kunlik ma'lumotlaringizni kuzatib boring
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mt-4">
            <div className="flex items-center gap-3">
              <FaHeartbeat className="text-2xl" />
              <div>
                <p className="text-lg font-semibold">Sog'lom turmush tarzi</p>
                <p className="text-sm opacity-90 mt-1">
                  AI chat orqali tibbiy maslahat oling va oilangizni kuzating
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tezkor kirish</h2>

        <div
          className={`grid ${
            profile?.hasDiabetes
              ? "grid-cols-2"
              : "grid-cols-1 max-w-md mx-auto"
          } gap-4`}
        >
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.path}
                to={action.path}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div
                  className={
                    profile?.hasDiabetes ? "" : "flex items-center gap-4"
                  }
                >
                  <div
                    className={`${action.color} ${
                      profile?.hasDiabetes ? "w-14 h-14 mb-3" : "w-14 h-14"
                    } rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="text-white text-2xl" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    {action.label}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {!profile?.hasDiabetes && (
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
              <FaHeartbeat className="text-2xl" />
              Sog'ligingizni kuzatib boring
            </h3>
            <p className="text-gray-700 mb-4">
              AI chat orqali semptomlaringiz haqida savol bering va professional
              maslahat oling. Oila a'zolaringizni qo'shib, ularning sog'lig'ini
              ham kuzatishingiz mumkin.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 text-center">
                <FaRobot className="text-4xl text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">AI Chat</p>
                <p className="text-xs text-gray-600">Tibbiy maslahat</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <FaUserFriends className="text-4xl text-pink-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">Oila</p>
                <p className="text-xs text-gray-600">Kuzatuv tizimi</p>
              </div>
            </div>
          </div>
        )}

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
