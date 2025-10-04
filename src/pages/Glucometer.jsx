import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useAddGlucometerMutation,
  useGetGlucometerStatsQuery,
} from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../components/Navbar";
import { FaPlus } from "react-icons/fa";

export default function Glucometer() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState("daily");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    value: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    note: "",
  });

  const { data: stats, isLoading } = useGetGlucometerStatsQuery({
    period,
    date: new Date().toISOString().split("T")[0],
  });

  const [addGlucometer, { isLoading: isAdding }] = useAddGlucometerMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addGlucometer({
        ...formData,
        value: parseFloat(formData.value),
      }).unwrap();

      setFormData({
        value: "",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
        note: "",
      });
      setShowAddModal(false);
    } catch (error) {
      alert(error.data?.message || t("error"));
    }
  };

  const chartData =
    stats?.records.map((r) => ({
      name: `${new Date(r.date).toLocaleDateString()} ${r.time}`,
      value: r.value,
    })) || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-primary-600 text-white p-6 rounded-b-3xl">
        <h1 className="text-3xl font-bold mb-4">{t("glucometer")}</h1>

        <div className="flex gap-2 overflow-x-auto">
          {["daily", "weekly", "monthly", "yearly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap ${
                period === p
                  ? "bg-white text-primary-600"
                  : "bg-primary-500 text-white"
              }`}
            >
              {t(p)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <p className="text-center py-8">{t("loading")}</p>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {t("statistics")}
              </h2>

              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
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
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444", r: 4 }}
                    />
                  </LineChart>
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
                        {record.value} <span className="text-lg">mmol/L</span>
                      </p>
                      <p className="text-gray-600 mt-1">
                        {new Date(record.date).toLocaleDateString()} •{" "}
                        {record.time}
                      </p>
                      {record.note && (
                        <p className="text-gray-500 mt-2 text-sm">
                          {record.note}
                        </p>
                      )}
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        record.value < 5.5
                          ? "bg-success-100 text-success-700"
                          : record.value < 7
                          ? "bg-warning-100 text-warning-700"
                          : "bg-danger-100 text-danger-700"
                      }`}
                    >
                      {record.value < 5.5
                        ? "Normal"
                        : record.value < 7
                        ? "Yuqori"
                        : "Xavfli"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 bg-primary-600 hover:bg-primary-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors"
      >
        <FaPlus className="text-2xl" />
      </button>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t("add")} {t("glucometer")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  {t("value")} (mmol/L)
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  required
                  step="0.1"
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  {t("date")}
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  {t("time")}
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  {t("note")}
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-semibold py-3 rounded-xl transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-lg font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isAdding ? t("loading") : t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}
