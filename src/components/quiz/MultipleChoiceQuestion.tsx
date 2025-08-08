"use client";

import React, { useState } from "react";
import { QuizQuestion, QuizOption } from "@/utils/quiz";

interface MultipleChoiceQuestionProps {
  question: QuizQuestion;
  selectedAnswers?: string[];
  onAnswerChange: (answers: string[]) => void;
  showResult?: boolean;
}

export default function MultipleChoiceQuestion({
  question,
  selectedAnswers = [],
  onAnswerChange,
  showResult = false,
}: MultipleChoiceQuestionProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const handleOptionToggle = (optionId: string) => {
    if (showResult) return;

    const newAnswers = selectedAnswers.includes(optionId)
      ? selectedAnswers.filter((id) => id !== optionId)
      : [...selectedAnswers, optionId];

    onAnswerChange(newAnswers);
  };

  const getOptionStyle = (option: QuizOption) => {
    const isSelected = selectedAnswers.includes(option.id);
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
          " bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-300 dark:border-teal-600 shadow-lg";
      } else if (isHovered) {
        baseClasses +=
          " bg-white/70 dark:bg-gray-800/70 border-teal-200 dark:border-teal-500 shadow-md";
      } else {
        baseClasses +=
          " bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 hover:border-teal-200 dark:hover:border-teal-500";
      }
    }

    return baseClasses;
  };

  const getTextStyle = (option: QuizOption) => {
    const isSelected = selectedAnswers.includes(option.id);
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
                  ? "text-teal-800 dark:text-teal-200 font-medium"
        : "text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Question Header */}
      <div className="bg-gradient-to-r from-gray-50 to-teal-50 dark:from-gray-800 dark:to-teal-900/20 p-4 sm:p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Multiple Choice
              </span>

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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Select all that apply
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
            onClick={() => handleOptionToggle(option.id)}
            onMouseEnter={() => setHoveredOption(option.id)}
            onMouseLeave={() => setHoveredOption(null)}
          >
            {/* Checkbox */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                    showResult
                      ? option.isCorrect
                        ? "border-emerald-500 bg-emerald-500"
                        : selectedAnswers.includes(option.id)
                          ? "border-red-500 bg-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      : selectedAnswers.includes(option.id)
                        ? "border-teal-500 bg-teal-500"
                        : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {selectedAnswers.includes(option.id) && (
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
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
              <div className="absolute inset-0 bg-teal-50 dark:bg-teal-900/10 rounded-xl opacity-0 animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {/* Selection Counter */}
      {!showResult && (
        <div className="text-center">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs sm:text-sm font-medium">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            {selectedAnswers.length} option
            {selectedAnswers.length !== 1 ? "s" : ""} selected
          </div>
        </div>
      )}
    </div>
  );
}
