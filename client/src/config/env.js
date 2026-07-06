// Application Environment Configuration
export const env = {
  NODE_ENV: import.meta.env.MODE || "development",
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  APP_NAME: "GrowthOS",
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};

export default env;
