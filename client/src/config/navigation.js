// Application Navigation Configuration
export const navigation = {
  sidebarItems: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "LayoutGrid",
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: "BarChart3",
    },
    {
      label: "Notes",
      path: "/notes",
      icon: "FileText",
    },
  ],
  auth: {
    login: "/",
    logout: "/",
  }
};

export default navigation;
