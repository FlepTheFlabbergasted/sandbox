export const throttle = (func, delay = 250) => {
  let timerFlag = null;

  return (...args) => {
    if (timerFlag === null) {
      func(...args);
      timerFlag = setTimeout(() => {
        timerFlag = null;
      }, delay);
    }
  };
};
