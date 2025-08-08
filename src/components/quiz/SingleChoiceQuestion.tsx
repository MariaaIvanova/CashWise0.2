"use client";

import React, { useState } from "react";
import { QuizQuestion, QuizOption } from "@/utils/quiz";

interface SingleChoiceQuestionProps {
  question: QuizQuestion;
  selectedAnswer?: string;
  onAnswerChange: (answer: string) => void;
  showResult?: boolean;
}

export default function SingleChoiceQuestion({
  question,
  selectedAnswer,
  onAnswerChange,
  showResult = false,
}: SingleChoiceQuestionProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const getOptionStyle = (option: QuizOption) => {
    const isSelected = selectedAnswer === option.id;
    const isCorrect = option.isCorrect;
    const isHovered = hoveredOption === option.id;

    let baseClasses =
      "relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group";

    if (showResult) {
      if (isCorrect) {
        baseClasses +=
          " bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-300 dark:border-emerald-600 shadow-lg";
      } else if (isSelected && !isCorrect) {
        baseClasses +=
          " bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-300 dark:border-red-600 shadow-lg";
      } else {
        baseClasses +=
          " bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600";
      }
    } else {
      if (isSelected) {
        baseClasses +=
          " bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-300 dark:border-blue-600 shadow-lg";
      } else if (isHovered) {
        baseClasses +=
          " bg-white/70 dark:bg-gray-800/70 border-blue-200 dark:border-blue-500 shadow-md";
      } else {
        baseClasses +=
          " bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-500";
      }
    }

    return baseClasses;
  };

  const getTextStyle = (option: QuizOption) => {
    const isSelected = selectedAnswer === option.id;
    const isCorrect = option.isCorrect;

    if (showResult) {
      if (isCorrect) {
        return "text-emerald-800 dark:text-emerald-200 font-medium";
      } else if (isSelected && !isCorrect) {
        return "text-red-800 dark:text-red-200 font-medium";
      } else {
        return "text-gray-600 dark:text-gray-400";
      }
    } else {
      return isSelected
        ? "text-blue-800 dark:text-blue-200 font-medium"
        : "text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Question Header */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-4 sm:p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
              {question.question}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Single Choice
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2 sm:space-y-3">
        {question.options?.map((option) => (
          <div
            key={option.id}
            className={getOptionStyle(option)}
            onClick={() => !showResult && onAnswerChange(option.id)}
            onMouseEnter={() => setHoveredOption(option.id)}
            onMouseLeave={() => setHoveredOption(null)}
          >
            {/* Radio Button */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    showResult
                      ? option.isCorrect
                        ? "border-emerald-500 bg-emerald-500"
                        : selectedAnswer === option.id
                          ? "border-red-500 bg-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      : selectedAnswer === option.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {selectedAnswer === option.id && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" />
                  )}
                </div>
              </div>

              {/* Option Text */}
              <span
                className={`flex-1 text-base sm:text-lg leading-relaxed ${getTextStyle(option)}`}
              >
                {option.text}
              </span>
            </div>

            {/* Hover Effect */}
            {!showResult && hoveredOption === option.id && (
              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10 rounded-xl opacity-0 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
