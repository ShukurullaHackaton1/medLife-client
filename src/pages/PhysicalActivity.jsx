import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  useAddPhysicalActivityMutation,
  useGetPhysicalStatsQuery,
} from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../components/Navbar";
import { FaPlay, FaStop } from "react-icons/fa";

export default function PhysicalActivity() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState("daily");
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const watchIdRef = useRef(null);
  const lastPositionRef = useRef(null);

  const { data: stats, isLoading } = useGetPhysicalStatsQuery({
    period,
    date: new Date().toISOString().split("T")[0],
  });

  const [addActivity, { isLoading: isAdding }] =
    useAddPhysicalActivityMutation();

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const startTracking = async () => {
    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      if (permission.state === "denied") {
        alert("Joylashuvga ruxsat berish kerak");
        return;
      }

      setIsTracking(true);
      setDistance(0);
      setStartTime(new Date().toTimeString().slice(0, 5));
      lastPositionRef.current = null;

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          if (lastPositionRef.current) {
            const newDistance = calculateDistance(
              lastPositionRef.current.latitude,
              lastPositionRef.current.longitude,
              position.coords.latitude,
              position.coords.longitude
            );
            setDistance((prev) => prev + newDistance);
          }

          lastPositionRef.current = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Joylashuvni aniqlab bo'lmadi");
          stopTracking();
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    } catch (error) {
      alert("Geolocation qo'llab-quvvatlanmaydi");
    }
  };

  const stopTracking = async () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setIsTracking(false);

    if (distance > 0) {
      try {
        const endTime = new Date().toTimeString().slice(0, 5);
        const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);
        const duration = endH * 60 + endM - (startH * 60 + startM);

        await addActivity({
          distanceMeters: Math.round(distance),
          duration: duration,
          date: new Date().toISOString().split("T")[0],
          startTime,
          endTime,
        }).unwrap();

        setDistance(0);
        setStartTime(null);
        lastPositionRef.current = null;
      } catch (error) {
        alert(error.data?.message || t("error"));
      }
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const chartData =
    stats?.records.map((r) => ({
      name: new Date(r.date).toLocaleDateString(),
      distance: r.distanceKm,
    })) || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-success-600 text-white p-6 rounded-b-3xl">
        <h1 className="text-3xl font-bold mb-4">{t("physical")}</h1>

        <div className="flex gap-2 overflow-x-auto">
          {["daily", "weekly", "monthly", "yearly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap ${
                period === p
                  ? "bg-white text-success-600"
                  : "bg-success-500 text-white"
              }`}
            >
              {t(p)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {isTracking ? (
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-6 text-center">
            <div className="mb-6">
              <p className="text-6xl font-bold text-success-600 mb-2">
                {(distance / 1000).toFixed(2)}
              </p>
              <p className="text-2xl text-gray-600">km</p>
            </div>

            <div className="mb-6">
              <p className="text-2xl font-bold text-gray-800 mb-1">
                {Math.round(distance)}
              </p>
              <p className="text-lg text-gray-600">metr</p>
            </div>

            <button
              onClick={stopTracking}
              className="bg-danger-500 hover:bg-danger-600 text-white w-20 h-20 rounded-full shadow-lg flex items-center justify-center mx-auto transition-colors"
            >
              <FaStop className="text-3xl" />
            </button>
            <p className="mt-4 text-lg font-medium text-gray-700">
              {t("stop")}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-6 text-center">
            <p className="text-2xl font-bold text-gray-800 mb-6">
              Yurishni boshlash
            </p>
            <button
              onClick={startTracking}
              className="bg-success-500 hover:bg-success-600 text-white w-20 h-20 rounded-full shadow-lg flex items-center justify-center mx-auto transition-colors"
            >
              <FaPlay className="text-3xl ml-1" />
            </button>
            <p className="mt-4 text-lg font-medium text-gray-700">
              {t("start")}
            </p>
          </div>
        )}

        {isLoading ? (
          <p className="text-center py-8">{t("loading")}</p>
        ) : (
          <>
            {stats?.summary && (
              <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Umumiy</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-success-50 rounded-xl">
                    <p className="text-3xl font-bold text-success-600">
                      {stats.summary.totalDistanceKm.toFixed(1)}
                    </p>
                    <p className="text-gray-600 mt-1">km</p>
                  </div>
                  <div className="text-center p-3 bg-primary-50 rounded-xl">
                    <p className="text-3xl font-bold text-primary-600">
                      {Math.round(stats.summary.totalDistanceMeters)}
                    </p>
                    <p className="text-gray-600 mt-1">metr</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {t("statistics")}
              </h2>

              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="distance"
                      fill="#22c55e"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-8">Ma'lumot yo'q</p>
              )}
            </div>

            <div className="space-y-3">
              {stats?.records.map((record) => (
                <div
                  key={record._id}
                  className="bg-white rounded-2xl p-4 shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {record.distanceKm.toFixed(2)} km
                      </p>
                      <p className="text-lg text-gray-600">
                        {Math.round(record.distanceMeters)} metr
                      </p>
                      <p className="text-gray-500 mt-2">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                      {record.duration && (
                        <p className="text-gray-500">
                          {record.duration} daqiqa
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      {record.startTime && record.endTime && (
                        <p className="text-gray-600">
                          {record.startTime} - {record.endTime}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Navbar />
    </div>
  );
}
