const engine = require('./workflow.engine')
console.log('engine', typeof engine)
module.exports = (...tasks) => {
  console.log('the tasks', tasks)
  return val => engine(val, ...tasks)
}
