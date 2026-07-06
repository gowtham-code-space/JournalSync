import { shadows } from "./shadows";
import { zIndex } from "./zIndex";

// Semantic elevation tokens combining shadows and z-indices
export const elevation = {
  flat: {
    boxShadow: shadows.none,
    zIndex: zIndex.base,
  },
  card: {
    boxShadow: shadows.sm,
    zIndex: zIndex.base,
  },
  dropdown: {
    boxShadow: shadows.md,
    zIndex: zIndex.dropdown,
  },
  sidebar: {
    boxShadow: shadows.none, // standard light mode has simple border, dark has border
    zIndex: zIndex.drawer,
  },
  modal: {
    boxShadow: shadows.xxl,  // shadow-2xl
    zIndex: zIndex.modal,
  },
  stickyHeader: {
    boxShadow: shadows.none,
    zIndex: zIndex.dropdown,
  }
};

export default elevation;
