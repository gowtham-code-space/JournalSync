// Application Navigation Configuration
export const navigation = {
  sidebarItems: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "LayoutGrid",
    },
    {
      label: "Stats",
      path: "/stats",
      icon: "BarChart3",
    },
    {
      label: "Templates",
      path: "/templates",
      icon: "Layout",
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
