import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useChatWithAIMutation } from "../services/api";
import Navbar from "../components/Navbar";
import { FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";

export default function Chat() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Assalomu alaykum! Men sizning tibbiy yordamchi AI-man. Qaysi semptomlar sizni bezovta qilyapti? Men sizga yordam beraman, lekin esda tuting - bu faqat dastlabki maslahat. Aniq tashxis uchun shifokorga murojaat qiling.",
    },
  ]);
  const [input, setInput] = useState("");

  const [chatWithAI, { isLoading }] = useChatWithAIMutation();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const result = await chatWithAI({ symptoms: input }).unwrap();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.response,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Kechirasiz, xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
        },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex flex-col">
      <div className="bg-purple-600 text-white p-6 rounded-b-3xl">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FaRobot className="text-4xl" />
          AI {t("chat")}
        </h1>
        <p className="text-purple-100 mt-2">Tibbiy maslahat uchun</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                <FaRobot className="text-white text-xl" />
              </div>
            )}

            <div
              className={`max-w-[75%] p-4 rounded-2xl ${
                message.role === "user"
                  ? "bg-primary-600 text-white rounded-tr-none"
                  : "bg-white shadow-md text-gray-800 rounded-tl-none"
              }`}
            >
              <p className="text-lg whitespace-pre-wrap">{message.content}</p>
            </div>

            {message.role === "user" && (
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                <FaUser className="text-white text-xl" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
              <FaRobot className="text-white text-xl" />
            </div>
            <div className="bg-white shadow-md p-4 rounded-2xl rounded-tl-none">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Semptomlaringizni yozing..."
            rows="1"
            className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            style={{ minHeight: "50px", maxHeight: "120px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white w-14 h-14 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 flex-shrink-0"
          >
            <FaPaperPlane className="text-xl" />
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  );
}
