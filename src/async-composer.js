const reducer = require('./async-reducer')
module.exports = (...funcs) => {
  return val => reducer(val, ...funcs)
}
