// FILE: src/pages/AISummary.jsx

import { useEffect, useState } from "react";
import api from "../config";

import { Lightbulb, TrendingUp, AlertCircle } from "lucide-react";

export default function AISummary() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  // AI Score State
  const [aiScore, setAiScore] = useState(null);

  // Convert long text → max 5 lines
  const cleanTextFiveLines = (text = "") => {
    let lines = text
      .split("\n")
      .map((line) =>
        line.replace(/\*/g, "").replace(/^-/, "").trim()
      )
      .filter((l) => l.length > 2)
      .slice(0, 5);

    return lines.join("\n");
  };

  // Generate AI Score (0–100)
  const generateScore = (text) => {
    if (!text) return 50;

    let score = 70; // base score

    const lower = text.toLowerCase();

    if (lower.includes("blocked")) score -= 20;
    if (lower.includes("duplicate")) score -= 10;
    if (lower.includes("improve")) score -= 10;
    if (lower.includes("completed")) score += 10;
    if (lower.includes("progress")) score += 5;

    // clamp 0–100
    return Math.min(100, Math.max(0, score));
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await api.get("/ai/summary");
        const sum = res.data.summary || "";

        setSummary(sum);

        // generate score
        const score = generateScore(sum);
        setAiScore(score);

      } catch (err) {
        setError("Unable to fetch AI summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // Split 3 sections
  const part1 = summary.split("**2.")[0] || "";
  const part2 = summary.split("**2.")[1]?.split("**3.")[0] || "";
  const part3 = summary.split("**3.")[1] || "";

  const summaryText = cleanTextFiveLines(part1);
  const weakText = cleanTextFiveLines(part2);
  const improveText = cleanTextFiveLines(part3);

  // Score Color
  const getScoreColor = () => {
    if (aiScore >= 75) return "bg-green-500";
    if (aiScore >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C2E7D3] to-[#E4F7ED] dark:from-gray-800 dark:to-gray-900 p-8 transition">

      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">
        AI Productivity Insights
      </h1>

      {/* AI SCORE CARD */}
      {!loading && !error && (
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center w-64 border">

            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg ${getScoreColor()}`}
            >
              {aiScore}
            </div>

            <p className="mt-3 text-gray-700 dark:text-gray-300 text-lg font-semibold">
              Productivity Score
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
              AI-generated score based on your task performance
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center text-gray-700 dark:text-gray-300 text-lg">
            Analyzing your tasks...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 font-semibold p-4 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">

            {/* SUMMARY */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-green-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Productivity Summary
                </h2>
              </div>
              <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{summaryText}</p>
            </div>

            {/* WEAK POINTS */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="text-yellow-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Weak Areas
                </h2>
              </div>
              <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{weakText}</p>
            </div>

            {/* ACTIONS */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-2">
                <Lightbulb className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Actionable Suggestions
                </h2>
              </div>
              <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{improveText}</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
