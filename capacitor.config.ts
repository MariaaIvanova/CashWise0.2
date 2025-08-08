import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.anonymous.FinanceApp",
  appName: "CashWise",
  webDir: "public",
  server: {
    url: "https://www.cash-wise.app",
    allowNavigation: ["cash-wise.app", "*.cash-wise.app"],
  },
  plugins: {
    StatusBar: {
      style: "dark",
      backgroundColor: "#14b8a6", // teal-600
      overlaysWebView: true,
    },
    SafeArea: {
      enabled: true,
      customColorsForSystemBars: true,
      statusBarColor: "#14b8a6", // teal-600 to match your design
      statusBarContent: "light",
      navigationBarColor: "#000000",
      navigationBarContent: "light",
      offset: 0,
    },
  },
  ios: {
    backgroundColor: "#000000",
    webContentsDebuggingEnabled: true,
  },
  android: {
    backgroundColor: "#000000",
    webContentsDebuggingEnabled: true,
    allowMixedContent: true,
    adjustMarginsForEdgeToEdge: "disable",
  },
};

export default config;
