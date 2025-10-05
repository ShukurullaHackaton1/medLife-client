import { useState } from "react";
import {
  FaUsers,
  FaChartLine,
  FaHospital,
  FaUserMd,
  FaTint,
  FaHeartbeat,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClipboardList,
  FaPills,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock данные
  const stats = {
    totalPatients: 248,
    activePatients: 189,
    criticalPatients: 12,
    improvedPatients: 156,
    todayAppointments: 18,
    pendingTests: 34,
  };

  const trends = {
    patients: { value: "+12%", isPositive: true },
    improved: { value: "+8%", isPositive: true },
    critical: { value: "-3%", isPositive: true },
    appointments: { value: "+15%", isPositive: true },
  };

  // График данные - глюкоза по месяцам
  const glucoseData = [
    { month: "Янв", average: 7.2, normal: 5.5, high: 8 },
    { month: "Фев", average: 7.0, normal: 5.5, high: 8 },
    { month: "Мар", average: 6.8, normal: 5.5, high: 8 },
    { month: "Апр", average: 6.5, normal: 5.5, high: 8 },
    { month: "Май", average: 6.3, normal: 5.5, high: 8 },
    { month: "Июн", average: 6.1, normal: 5.5, high: 8 },
  ];

  // График приема лекарств
  const medicationData = [
    { day: "Пн", taken: 85, missed: 15 },
    { day: "Вт", taken: 90, missed: 10 },
    { day: "Ср", taken: 88, missed: 12 },
    { day: "Чт", taken: 92, missed: 8 },
    { day: "Пт", taken: 87, missed: 13 },
    { day: "Сб", taken: 95, missed: 5 },
    { day: "Вс", taken: 93, missed: 7 },
  ];

  // Распределение пациентов по состоянию
  const patientStatusData = [
    { name: "Стабильное", value: 156, color: "#22c55e" },
    { name: "Улучшение", value: 67, color: "#3b82f6" },
    { name: "Требует внимания", value: 13, color: "#f59e0b" },
    { name: "Критическое", value: 12, color: "#ef4444" },
  ];

  // Активность пациентов
  const activityData = [
    { week: "1 нед", steps: 45000, calories: 2100, active: 180 },
    { week: "2 нед", steps: 52000, calories: 2350, active: 195 },
    { week: "3 нед", steps: 48000, calories: 2200, active: 185 },
    { week: "4 нед", steps: 55000, calories: 2450, active: 210 },
  ];

  // Недавние пациенты
  const recentPatients = [
    {
      id: 1,
      name: "Иванов Иван Петрович",
      age: 58,
      status: "stable",
      glucose: 6.2,
      lastVisit: "2 дня назад",
      trend: "improving",
    },
    {
      id: 2,
      name: "Петрова Мария Сергеевна",
      age: 45,
      status: "attention",
      glucose: 8.5,
      lastVisit: "1 день назад",
      trend: "stable",
    },
    {
      id: 3,
      name: "Сидоров Петр Николаевич",
      age: 62,
      status: "critical",
      glucose: 10.2,
      lastVisit: "Сегодня",
      trend: "worsening",
    },
    {
      id: 4,
      name: "Козлова Анна Владимировна",
      age: 51,
      status: "stable",
      glucose: 5.8,
      lastVisit: "3 дня назад",
      trend: "improving",
    },
    {
      id: 5,
      name: "Морозов Дмитрий Александрович",
      age: 48,
      status: "improving",
      glucose: 6.8,
      lastVisit: "1 день назад",
      trend: "improving",
    },
  ];

  // Предстоящие приемы
  const upcomingAppointments = [
    {
      time: "09:00",
      patient: "Волков А.И.",
      type: "Консультация",
      status: "confirmed",
    },
    {
      time: "09:30",
      patient: "Егорова М.П.",
      type: "Контроль",
      status: "confirmed",
    },
    {
      time: "10:00",
      patient: "Лебедев С.Н.",
      type: "Первичный",
      status: "pending",
    },
    {
      time: "10:30",
      patient: "Соколова Е.В.",
      type: "Повторный",
      status: "confirmed",
    },
    {
      time: "11:00",
      patient: "Павлов И.К.",
      type: "Консультация",
      status: "confirmed",
    },
  ];

  const getStatusBadge = (status) => {
    const configs = {
      stable: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Стабильно",
      },
      improving: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Улучшение",
      },
      attention: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Внимание",
      },
      critical: { bg: "bg-red-100", text: "text-red-700", label: "Критично" },
    };
    const config = configs[status];
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getTrendIcon = (trend) => {
    if (trend === "improving") return <FaArrowUp className="text-green-500" />;
    if (trend === "worsening") return <FaArrowDown className="text-red-500" />;
    return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 fixed h-full">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaHospital className="text-3xl" />
            <h1 className="text-2xl font-bold">MedLife</h1>
          </div>
          <p className="text-blue-200 text-sm">Панель врача</p>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "overview"
                ? "bg-white text-blue-600 font-semibold"
                : "hover:bg-blue-700"
            }`}
          >
            <FaChartLine />
            <span>Обзор</span>
          </button>

          <button
            onClick={() => setActiveTab("patients")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "patients"
                ? "bg-white text-blue-600 font-semibold"
                : "hover:bg-blue-700"
            }`}
          >
            <FaUsers />
            <span>Пациенты</span>
          </button>

          <button
            onClick={() => setActiveTab("appointments")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "appointments"
                ? "bg-white text-blue-600 font-semibold"
                : "hover:bg-blue-700"
            }`}
          >
            <FaCalendarAlt />
            <span>Расписание</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "analytics"
                ? "bg-white text-blue-600 font-semibold"
                : "hover:bg-blue-700"
            }`}
          >
            <FaClipboardList />
            <span>Аналитика</span>
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-blue-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <FaUserMd className="text-xl" />
              </div>
              <div>
                <p className="font-semibold">Др. Петров А.С.</p>
                <p className="text-xs text-blue-200">Эндокринолог</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {activeTab === "overview" && "Общий обзор"}
            {activeTab === "patients" && "Список пациентов"}
            {activeTab === "appointments" && "Расписание приемов"}
            {activeTab === "analytics" && "Детальная аналитика"}
          </h2>
          <p className="text-gray-600">
            {new Date().toLocaleDateString("ru-RU", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <FaUsers className="text-blue-600 text-xl" />
                  </div>
                  <span
                    className={`text-sm font-medium flex items-center gap-1 ${
                      trends.patients.isPositive
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {trends.patients.isPositive ? (
                      <FaArrowUp />
                    ) : (
                      <FaArrowDown />
                    )}
                    {trends.patients.value}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                  {stats.totalPatients}
                </h3>
                <p className="text-gray-600">Всего пациентов</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <FaCheckCircle className="text-green-600 text-xl" />
                  </div>
                  <span
                    className={`text-sm font-medium flex items-center gap-1 ${
                      trends.improved.isPositive
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {trends.improved.isPositive ? (
                      <FaArrowUp />
                    ) : (
                      <FaArrowDown />
                    )}
                    {trends.improved.value}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                  {stats.improvedPatients}
                </h3>
                <p className="text-gray-600">С улучшением</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <FaExclamationTriangle className="text-red-600 text-xl" />
                  </div>
                  <span
                    className={`text-sm font-medium flex items-center gap-1 ${
                      trends.critical.isPositive
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {trends.critical.isPositive ? (
                      <FaArrowUp />
                    ) : (
                      <FaArrowDown />
                    )}
                    {trends.critical.value}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                  {stats.criticalPatients}
                </h3>
                <p className="text-gray-600">Критических</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <FaCalendarAlt className="text-purple-600 text-xl" />
                  </div>
                  <span
                    className={`text-sm font-medium flex items-center gap-1 ${
                      trends.appointments.isPositive
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {trends.appointments.isPositive ? (
                      <FaArrowUp />
                    ) : (
                      <FaArrowDown />
                    )}
                    {trends.appointments.value}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                  {stats.todayAppointments}
                </h3>
                <p className="text-gray-600">Приемов сегодня</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaTint className="text-red-500" />
                  Динамика средней глюкозы
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={glucoseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="average"
                      stroke="#ef4444"
                      fill="#fecaca"
                      name="Средняя"
                    />
                    <Area
                      type="monotone"
                      dataKey="normal"
                      stroke="#22c55e"
                      fill="#bbf7d0"
                      name="Норма"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaPills className="text-blue-500" />
                  Прием лекарств (неделя)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={medicationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="taken"
                      fill="#22c55e"
                      name="Принято"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="missed"
                      fill="#ef4444"
                      name="Пропущено"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Patients and Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Недавние пациенты
                </h3>
                <div className="space-y-3">
                  {recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {patient.name.split(" ")[0][0]}
                          {patient.name.split(" ")[1][0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {patient.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {patient.age} лет • {patient.lastVisit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Глюкоза</p>
                          <p
                            className={`font-bold ${
                              patient.glucose > 7
                                ? "text-red-600"
                                : patient.glucose > 6
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {patient.glucose} ммоль/л
                          </p>
                        </div>
                        {getTrendIcon(patient.trend)}
                        {getStatusBadge(patient.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Распределение пациентов
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={patientStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {patientStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {patientStatusData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-600">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Patients Tab */}
        {activeTab === "patients" && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Поиск пациента..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {patient.name.split(" ")[0][0]}
                      {patient.name.split(" ")[1][0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">
                        {patient.name}
                      </p>
                      <p className="text-gray-600">{patient.age} лет</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Глюкоза</p>
                      <p
                        className={`text-xl font-bold ${
                          patient.glucose > 7
                            ? "text-red-600"
                            : patient.glucose > 6
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {patient.glucose}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Последний визит</p>
                      <p className="font-semibold text-gray-800">
                        {patient.lastVisit}
                      </p>
                    </div>
                    {getStatusBadge(patient.status)}
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Подробнее
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                Расписание на сегодня
              </h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Добавить прием
              </button>
            </div>
            <div className="space-y-3">
              {upcomingAppointments.map((apt, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 px-4 py-2 rounded-lg">
                      <p className="text-xl font-bold text-blue-600">
                        {apt.time}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{apt.patient}</p>
                      <p className="text-gray-600">{apt.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        apt.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {apt.status === "confirmed" ? "Подтверждено" : "Ожидание"}
                    </span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Начать прием
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaHeartbeat className="text-red-500" />
                Физическая активность пациентов
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="steps"
                    stroke="#3b82f6"
                    name="Шаги"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="#22c55e"
                    name="Активные минуты"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <FaChartLine className="text-blue-600 text-xl" />
                  </div>
                  <h4 className="font-bold text-gray-800">
                    Средние показатели
                  </h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Глюкоза</p>
                    <p className="text-2xl font-bold text-blue-600">
                      6.5 ммоль/л
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Вес</p>
                    <p className="text-2xl font-bold text-green-600">78.2 кг</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">BMI</p>
                    <p className="text-2xl font-bold text-purple-600">26.4</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <FaPills className="text-green-600 text-xl" />
                  </div>
                  <h4 className="font-bold text-gray-800">Соблюдение режима</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Прием лекарств</p>
                    <p className="text-2xl font-bold text-green-600">89%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Диета</p>
                    <p className="text-2xl font-bold text-yellow-600">76%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Активность</p>
                    <p className="text-2xl font-bold text-blue-600">82%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <FaExclamationTriangle className="text-purple-600 text-xl" />
                  </div>
                  <h4 className="font-bold text-gray-800">Требуют внимания</h4>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="font-semibold text-red-700">12 пациентов</p>
                    <p className="text-sm text-red-600">
                      Критическое состояние
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="font-semibold text-yellow-700">34 анализа</p>
                    <p className="text-sm text-yellow-600">
                      Ожидают результатов
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
