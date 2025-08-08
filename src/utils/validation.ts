export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

export function validateResetPasswordData(data: ResetPasswordData): {
  isValid: boolean;
  error?: string;
} {
  const { password, confirmPassword } = data;

  if (!password || !confirmPassword) {
    return {
      isValid: false,
      error: "Both password fields are required",
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: "Passwords do not match",
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: "Password must be at least 6 characters long",
    };
  }

  return { isValid: true };
}

export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  if (!email) {
    return {
      isValid: false,
      error: "Email is required",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address",
    };
  }

  return { isValid: true };
}
