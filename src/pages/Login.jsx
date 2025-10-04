import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLoginMutation } from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../services/authSlice";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(formData).unwrap();
      dispatch(setCredentials(result));
      navigate("/");
    } catch (error) {
      alert(error.data?.message || t("error"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-primary-900 mb-8">
            {t("login")}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white text-xl font-semibold py-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoading ? t("loading") : t("login")}
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full text-primary-600 text-lg font-medium"
            >
              {t("register")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
