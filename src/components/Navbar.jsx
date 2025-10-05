import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useGetProfileQuery } from "../services/api";
import {
  FaHome,
  FaTint,
  FaRunning,
  FaPills,
  FaUtensils,
  FaUser,
  FaComments,
} from "react-icons/fa";

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: profile } = useGetProfileQuery();
  const hasDiabetes = profile?.hasDiabetes || false;

  const baseNavItems = [
    {
      path: "/",
      icon: FaHome,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      path: "/chat",
      icon: FaComments,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      path: "/profile",
      icon: FaUser,
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      textColor: "text-gray-600",
    },
  ];

  const diabetesNavItems = [
    {
      path: "/glucometer",
      icon: FaTint,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      path: "/physical",
      icon: FaRunning,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      path: "/medication",
      icon: FaPills,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      path: "/nutrition",
      icon: FaUtensils,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  const navItems = hasDiabetes
    ? [baseNavItems[0], ...diabetesNavItems, baseNavItems[1], baseNavItems[2]]
    : baseNavItems;

  useEffect(() => {
    const currentIndex = navItems.findIndex(
      (item) => item.path === location.pathname
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname, navItems.length]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-2xl"></div>

      <div
        className={`absolute top-0 h-0.5 bg-gradient-to-r ${
          navItems[activeIndex]?.color || "from-blue-500 to-blue-600"
        } transition-all duration-300 ease-out`}
        style={{
          width: `${100 / navItems.length}%`,
          left: `${(activeIndex * 100) / navItems.length}%`,
        }}
      ></div>

      <div className="relative max-w-screen-xl mx-auto px-1">
        <div className="flex justify-around items-center h-16 sm:h-20">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 h-full group relative"
              >
                {isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 ${item.bgColor} rounded-2xl transform scale-100 transition-transform duration-200`}
                    ></div>
                  </div>
                )}

                <div
                  className={`relative z-10 transition-all duration-200 ${
                    isActive
                      ? "transform -translate-y-1"
                      : "group-hover:transform group-hover:-translate-y-0.5"
                  }`}
                >
                  <Icon
                    className={`text-2xl sm:text-3xl mb-1 transition-all duration-200 ${
                      isActive
                        ? `${item.textColor} drop-shadow-sm`
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                </div>

                {isActive && (
                  <div className="absolute bottom-1 w-1 h-1 bg-current rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
