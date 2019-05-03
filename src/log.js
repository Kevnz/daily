const chalk = require('chalk')
const util = require('util')

const mapping = {
  log: chalk.blue,
  info: chalk.cyan,
  warn: chalk.yellow,
  error: chalk.red,
}
const labels = {
  log: chalk.bgBlue.white.bold,
  info: chalk.bgCyan.white.bold,
  warn: chalk.bgYellow.gray.bold,
  error: chalk.bgRed.white.bold,
}
;['log', 'warn', 'error', 'info'].forEach((method) => {
  const oldMethod = console[method].bind(console)
  console[method] = (...args) => {
    if (args.length > 1) {
      oldMethod(mapping[method](labels[method](` ${args[0]}: `), util.inspect(args[1])))
    } else {
      oldMethod(mapping[method](...args))
    }
    if (process.env.NODE_ENV !== 'development') {

    }
  }
})
