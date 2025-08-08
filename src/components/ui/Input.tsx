"use client";

import React from "react";

interface InputProps {
  type?: "text" | "email" | "password" | "number";
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function Input({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = "",
}: InputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
          text-gray-900 dark:text-white bg-white dark:bg-gray-800
          placeholder-gray-400 dark:placeholder-gray-500 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed
          ${error ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500" : ""}
        `}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
