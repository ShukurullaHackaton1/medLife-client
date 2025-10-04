import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useGetScreeningQuestionsQuery,
  useSubmitScreeningMutation,
} from "../services/api";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaChartLine,
  FaHeartbeat,
} from "react-icons/fa";

export default function Screening() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: questionsData, isLoading } = useGetScreeningQuestionsQuery();
  const [submitScreening, { isLoading: isSubmitting }] =
    useSubmitScreeningMutation();

  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);
      if (existing >= 0) {
        const newAnswers = [...prev];
        newAnswers[existing] = { questionId, answer };
        return newAnswers;
      }
      return [...prev, { questionId, answer }];
    });
  };

  const handleSubmit = async () => {
    try {
      const result = await submitScreening({ answers }).unwrap();
      setResults(result);
      setShowResults(true);
    } catch (error) {
      alert(error.data?.message || t("error"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">{t("loading")}</p>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
            <h1 className="text-3xl font-bold text-center text-primary-900 mb-6">
              {t("screening")} {t("results")}
            </h1>

            {results.results.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-success-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-success-600 text-6xl" />
                </div>
                <p className="text-xl text-success-600 mb-4 font-semibold">
                  Sizda kasallik xavfi aniqlanmadi
                </p>
                <p className="text-gray-600">
                  Sog'lom turmush tarzini davom ettiring
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl border-2 ${
                      result.risk === "Yuqori"
                        ? "bg-danger-50 border-danger-300"
                        : "bg-warning-50 border-warning-300"
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <FaExclamationTriangle
                        className={`text-2xl mt-1 ${
                          result.risk === "Yuqori"
                            ? "text-danger-600"
                            : "text-warning-600"
                        }`}
                      />
                      <h3 className="text-xl font-bold flex-1">
                        {result.disease}
                      </h3>
                    </div>
                    <p className="text-lg mb-2">
                      <strong>Xavf darajasi:</strong> {result.risk}
                    </p>
                    <p className="text-lg mb-2">
                      <strong>Shifokor:</strong> {result.doctorType}
                    </p>
                    <p className="text-gray-700">{result.recommendations}</p>
                  </div>
                ))}
              </div>
            )}

            {results.hasDiabetes && (
              <div className="mt-6 p-4 bg-primary-50 rounded-2xl border-2 border-primary-300">
                <div className="flex items-start gap-3">
                  <FaChartLine className="text-primary-600 text-2xl mt-1" />
                  <div>
                    <p className="text-lg font-semibold text-primary-900">
                      Diabet kundaligi ochildi
                    </p>
                    <p className="text-gray-700 mt-2">
                      Endi siz glukometr, ovqatlanish va boshqa ma'lumotlarni
                      kiritishingiz mumkin
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!results.hasDiabetes && (
              <div className="mt-6 p-4 bg-success-50 rounded-2xl border-2 border-success-300">
                <div className="flex items-start gap-3">
                  <FaHeartbeat className="text-success-600 text-2xl mt-1" />
                  <div>
                    <p className="text-lg font-semibold text-success-900">
                      Sog'ligingizni saqlang
                    </p>
                    <p className="text-gray-700 mt-2">
                      AI chat orqali tibbiy maslahat olishingiz va oila
                      a'zolaringizni kuzatishingiz mumkin
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate("/")}
              className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white text-xl font-semibold py-4 rounded-xl transition-colors"
            >
              {t("continue")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
          <h1 className="text-3xl font-bold text-center text-primary-900 mb-6">
            {t("screening")}
          </h1>

          <div className="space-y-6">
            {questionsData?.questions.map((question) => (
              <div key={question.id} className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-lg font-medium text-gray-800 mb-3">
                  {question.question}
                </p>

                <div className="flex gap-3">
                  {["yes", "no", "unknown"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(question.id, option)}
                      className={`flex-1 py-3 px-4 rounded-xl text-lg font-medium transition-all ${
                        answers.find((a) => a.questionId === question.id)
                          ?.answer === option
                          ? "bg-primary-600 text-white"
                          : "bg-white border-2 border-gray-300 text-gray-700 hover:border-primary-400"
                      }`}
                    >
                      {t(option)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting || answers.length !== questionsData?.questions.length
            }
            className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white text-xl font-semibold py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {isSubmitting ? t("loading") : t("submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
