export default (state, action) => {
  switch (action.type) {
  case "X": // Just a placeholder
    return { }
  default:
    return { ...state, ...action.payload };
  }
};