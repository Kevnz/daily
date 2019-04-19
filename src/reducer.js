module.exports = (startValue, ...funcs) =>
  funcs.reduce((inProgress, current) => current(inProgress), startValue)
