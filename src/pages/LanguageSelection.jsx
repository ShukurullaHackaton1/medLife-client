import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function LanguageSelection() {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const languages = [
    { code: "uz", name: "O'zbekcha", flag: "🇺🇿" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "kaa", name: "Қарақалпақша", flag: "🇺🇿" },
  ];

  const handleLanguageSelect = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-900 mb-2">
            {t("appTitle")}
          </h1>
          <p className="text-lg text-primary-700">
            {t("selectLanguagePrompt")}
          </p>
        </div>

        <div className="space-y-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className="w-full bg-white hover:bg-primary-50 rounded-2xl p-6 shadow-lg transition-all transform hover:scale-105 flex items-center justify-between"
            >
              <span className="text-5xl">{lang.flag}</span>
              <span className="text-2xl font-semibold text-gray-800">
                {lang.name}
              </span>
              <div className="w-12"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
