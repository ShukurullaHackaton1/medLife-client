import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRegisterMutation } from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../services/authSlice";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "male",
    birthDate: "",
    weight: "",
    height: "",
    region: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const invitedBy = searchParams.get("invitedBy");
      const language = localStorage.getItem("language") || "uz";

      const result = await register({
        ...formData,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        language,
        invitedBy: invitedBy || undefined,
      }).unwrap();

      dispatch(setCredentials(result));
      navigate("/screening");
    } catch (error) {
      alert(error.data?.message || t("error"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-20">
          <h1 className="text-3xl font-bold text-center text-primary-900 mb-6">
            {t("register")}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                {t("firstName")}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
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
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                {t("gender")}
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="male">{t("male")}</option>
                <option value="female">{t("female")}</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                {t("birthDate")}
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
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
                name="weight"
                value={formData.weight}
                onChange={handleChange}
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
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
                step="0.01"
                placeholder="170 (sm) yoki 1.7 (m)"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                {t("region")}
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                {t("phone")}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+998901234567"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                {t("password")}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white text-xl font-semibold py-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoading ? t("loading") : t("register")}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full text-primary-600 text-lg font-medium"
            >
              {t("login")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
