const BackOff = require('back-off').default
const backoff = new BackOff({
  times: 10,
  delay: 50,
  backoff: true,
})
const { inspect } = require('util')
module.exports = async (startValue, ...tasks) =>
  new Promise((resolve, reject) => {
    const iterator = tasks[Symbol.iterator]()
    console.log('it', iterator)
    let step = 0
    const eject = (error, currentState) => {
      console.log('The error', error)
      resolve({
        error,
        startingState: startValue,
        currentState,
        currentIndex: step,
      })
    }

    const next = async total => {
      console.log('the next', inspect(iterator, true, 4, true))
      const el = iterator.next()
      console.log('the el', inspect(el, true, 4, true))
      if (el.done) {
        resolve(total)
        console.log('total to resolve', total)
        return
      }
      try {
        console.log('the try block', el.value)
        const result = await el.value.task(total)
        console.log('result', result)
        step++
        next(result)
      } catch (err) {
        console.error('The error', err)
        eject(err, total)
      }
    }

    next(startValue)
  })
