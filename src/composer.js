const reducer = require('./reducer')
module.exports = (...funcs) => {
  return val => reducer(val, ...funcs)
}
