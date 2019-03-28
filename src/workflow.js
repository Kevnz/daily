const engine = require('./workflow.engine')

module.exports = (...tasks) => {
  return val => engine(val, ...tasks)
}
