// Detected z-index tokens
export const zIndex = {
  auto: "auto",
  hide: -1,
  base: 0,
  dropdown: 10,       // z-10 (e.g. topbar/card headers/dropdowns)
  sticky: 20,
  backdrop: 30,       // z-30 (e.g. mobile navigation backdrop)
  drawer: 40,         // z-40 (e.g. mobile sidebar)
  modal: 50,          // z-50 (e.g. CalendarModal, ColumnEditorModal)
  popover: 60,
  toast: 70,
};

export default zIndex;
