// Application-wide static constants
export const constants = {
  THEME_STORAGE_KEY: "theme-store",
  USER_STORAGE_KEY: "auth-user",
  MONTHS: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ],
  MONTH_ABBR: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ],
  DEFAULT_COLUMNS: [
    { id: "rating", label: "Rating", type: "number", trackForAnalytics: true },
    { id: "sleep", label: "Sleep", type: "number", trackForAnalytics: true },
    { id: "deepWork", label: "Deep Work", type: "number", trackForAnalytics: true },
    { id: "comment", label: "Comment", type: "comment", trackForAnalytics: false },
  ]
};

export default constants;
