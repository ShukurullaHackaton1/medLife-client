import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetMedicationsQuery,
  useAddMedicationMutation,
  useTakeMedicationMutation,
  useDeleteMedicationMutation,
  useGetMedicationStatsQuery,
} from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import Navbar from "../components/Navbar";
import {
  FaPlus,
  FaCheck,
  FaBell,
  FaBellSlash,
  FaTrash,
  FaTimes,
  FaEdit,
  FaPills,
} from "react-icons/fa";

export default function Medication() {
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [period, setPeriod] = useState("daily");
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    times: [""],
    reminderEnabled: false,
  });

  const { data: medications, isLoading } = useGetMedicationsQuery();
  const { data: stats } = useGetMedicationStatsQuery({
    period,
    date: new Date().toISOString().split("T")[0],
  });
  const [addMedication, { isLoading: isAdding }] = useAddMedicationMutation();
  const [takeMedication] = useTakeMedicationMutation();
  const [deleteMedication] = useDeleteMedicationMutation();

  const handleAddTime = () => {
    setFormData({ ...formData, times: [...formData.times, ""] });
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({ ...formData, times: newTimes });
  };

  const handleRemoveTime = (index) => {
    const newTimes = formData.times.filter((_, i) => i !== index);
    setFormData({ ...formData, times: newTimes.length > 0 ? newTimes : [""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMedication({
        ...formData,
        times: formData.times.filter((t) => t !== ""),
      }).unwrap();

      setFormData({
        name: "",
        dosage: "",
        times: [""],
        reminderEnabled: false,
      });
      setShowAddModal(false);
      alert(t("success"));
    } catch (error) {
      alert(error.data?.message || t("error"));
    }
  };

  const handleTake = async (medicationId, time) => {
    try {
      await takeMedication({
        id: medicationId,
        time,
        date: new Date().toISOString().split("T")[0],
      }).unwrap();
    } catch (error) {
      alert(error.data?.message || t("error"));
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Dorini o'chirmoqchimisiz?")) {
      try {
        await deleteMedication(id).unwrap();
      } catch (error) {
        alert(error.data?.message || t("error"));
      }
    }
  };

  const getTodayTaken = (medication) => {
    const today = new Date().toISOString().split("T")[0];
    return (
      medication.takenRecords?.filter(
        (r) =>
          r.date &&
          new Date(r.date).toISOString().split("T")[0] === today &&
          r.taken
      ) || []
    );
  };

  const COLORS = ["#22c55e", "#ef4444"];

  const chartData = stats?.stats.reduce(
    (acc, stat) => {
      acc.taken += stat.taken;
      acc.missed += stat.missed;
      return acc;
    },
    { taken: 0, missed: 0 }
  );

  const pieData = chartData
    ? [
        { name: "Qabul qilingan", value: chartData.taken },
        { name: "Qoldirilgan", value: chartData.missed },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <FaPills className="text-4xl" />
          {t("medication")}
        </h1>

        {/* Period selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["daily", "weekly", "monthly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                period === p
                  ? "bg-white text-primary-600 shadow-md"
                  : "bg-primary-500 text-white hover:bg-primary-400"
              }`}
            >
              {t(p)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Statistics Chart */}
        {pieData.length > 0 && pieData[0].value + pieData[1].value > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📊 {t("statistics")}
            </h2>

            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-success-50 rounded-xl p-3 text-center">
                <p className="text-3xl font-bold text-success-600">
                  {chartData.taken}
                </p>
                <p className="text-sm text-gray-600">Qabul qilindi</p>
              </div>
              <div className="bg-danger-50 rounded-xl p-3 text-center">
                <p className="text-3xl font-bold text-danger-600">
                  {chartData.missed}
                </p>
                <p className="text-sm text-gray-600">Qoldirildi</p>
              </div>
            </div>
          </div>
        )}

        {/* Medications List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">{t("loading")}</p>
          </div>
        ) : medications && medications.length > 0 ? (
          <div className="space-y-3">
            {medications.map((med) => {
              const todayTaken = getTodayTaken(med);
              const adherence =
                med.times.length > 0
                  ? (todayTaken.length / med.times.length) * 100
                  : 0;

              return (
                <div
                  key={med._id}
                  className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Medication header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {med.name}
                      </h3>
                      {med.dosage && (
                        <p className="text-gray-600">{med.dosage}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {med.reminderEnabled ? (
                        <div className="bg-primary-100 p-2 rounded-lg">
                          <FaBell className="text-primary-600 text-lg" />
                        </div>
                      ) : (
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <FaBellSlash className="text-gray-400 text-lg" />
                        </div>
                      )}
                      <button
                        onClick={() => handleDelete(med._id)}
                        className="bg-danger-100 hover:bg-danger-200 p-2 rounded-lg transition-colors"
                      >
                        <FaTrash className="text-danger-600 text-lg" />
                      </button>
                    </div>
                  </div>

                  {/* Adherence bar */}
                  {adherence > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Bugun:</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {adherence.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            adherence === 100
                              ? "bg-success-500"
                              : adherence > 50
                              ? "bg-warning-500"
                              : "bg-danger-500"
                          }`}
                          style={{ width: `${adherence}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Time slots */}
                  <div className="space-y-2">
                    {med.times.map((time, idx) => {
                      const isTaken = todayTaken.some((r) => r.time === time);
                      const [hours, minutes] = time.split(":");
                      const now = new Date();
                      const timeDate = new Date();
                      timeDate.setHours(parseInt(hours), parseInt(minutes), 0);
                      const isPast = now > timeDate;

                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                            isTaken
                              ? "bg-success-50 border-2 border-success-200"
                              : isPast && !isTaken
                              ? "bg-danger-50 border-2 border-danger-200"
                              : "bg-gray-50 border-2 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                isTaken
                                  ? "bg-success-500"
                                  : isPast
                                  ? "bg-danger-500"
                                  : "bg-primary-500"
                              }`}
                            >
                              <span className="text-white font-bold text-lg">
                                {time}
                              </span>
                            </div>
                            <div>
                              <p
                                className={`font-semibold ${
                                  isTaken
                                    ? "text-success-700"
                                    : isPast
                                    ? "text-danger-700"
                                    : "text-gray-700"
                                }`}
                              >
                                {isTaken
                                  ? "✓ Qabul qilindi"
                                  : isPast
                                  ? "✗ Qoldirildi"
                                  : "Kutilmoqda"}
                              </p>
                              {isTaken &&
                                todayTaken.find((r) => r.time === time)
                                  ?.takenAt && (
                                  <p className="text-xs text-gray-500">
                                    {new Date(
                                      todayTaken.find(
                                        (r) => r.time === time
                                      ).takenAt
                                    ).toLocaleTimeString("uz-UZ", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleTake(med._id, time)}
                            disabled={isTaken}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              isTaken
                                ? "bg-success-200 text-success-700 cursor-not-allowed"
                                : "bg-primary-600 hover:bg-primary-700 text-white active:scale-95"
                            }`}
                          >
                            {isTaken ? (
                              <span className="flex items-center gap-2">
                                <FaCheck /> Bajarildi
                              </span>
                            ) : (
                              t("taken")
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-primary-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPills className="text-primary-600 text-5xl" />
            </div>
            <p className="text-xl font-semibold text-gray-800 mb-2">
              Hozircha dorilar yo'q
            </p>
            <p className="text-gray-600 mb-6">
              Birinchi dorini qo'shish uchun pastdagi tugmani bosing
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2"
            >
              <FaPlus /> Dori qo'shish
            </button>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      {medications && medications.length > 0 && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-24 right-6 bg-primary-600 hover:bg-primary-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <FaPlus className="text-2xl" />
        </button>
      )}

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Dori qo'shish
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Medication Name */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  {t("medicationName")}{" "}
                  <span className="text-danger-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Masalan: Metformin"
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Dosage */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  {t("dosage")}
                </label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) =>
                    setFormData({ ...formData, dosage: e.target.value })
                  }
                  placeholder="Masalan: 500mg"
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Times */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  {t("times")} <span className="text-danger-600">*</span>
                </label>
                <div className="space-y-2">
                  {formData.times.map((time, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) =>
                          handleTimeChange(index, e.target.value)
                        }
                        required
                        className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {formData.times.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTime(index)}
                          className="px-4 py-3 bg-danger-100 text-danger-600 rounded-xl hover:bg-danger-200 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddTime}
                  className="mt-2 w-full py-3 border-2 border-dashed border-primary-300 text-primary-600 rounded-xl hover:bg-primary-50 transition-colors font-medium"
                >
                  + Yana vaqt qo'shish
                </button>
              </div>

              {/* Reminder Toggle */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="reminder"
                  checked={formData.reminderEnabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reminderEnabled: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                />
                <label
                  htmlFor="reminder"
                  className="flex-1 text-lg font-medium text-gray-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FaBell className="text-primary-600" />
                    Eslatma berish
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Dori ichish vaqtida bildirishnoma yuboriladi
                  </p>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
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
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-lg font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAdding ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {t("loading")}
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      {t("save")}
                    </>
                  )}
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
