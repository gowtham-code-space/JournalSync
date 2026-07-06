import { env } from "./env";
import { navigation } from "./navigation";
import { constants } from "./constants";

export const appConfig = {
  env,
  navigation,
  constants,
  features: {
    enableAnalytics: true,
    enableNotes: true,
    enableRichTextNotes: true,
    enableMultiColumnEditing: true,
  },
  theme: {
    defaultTheme: "light",
    allowUserThemeToggle: true,
  }
};

export default appConfig;
