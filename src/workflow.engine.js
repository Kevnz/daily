const BackOff = require('back-off').default
const backoff = new BackOff({
  times: 10,
  delay: 50,
  backoff: true,
})

module.exports = async (startValue, ...tasks) =>
  new Promise((resolve, reject) => {
    const iterator = tasks[Symbol.iterator]()

    let step = 0
    const eject = (error, currentState) => {
      console.error('The error', error)
      resolve({
        error,
        startingState: startValue,
        currentState,
        currentIndex: step,
      })
    }

    const next = async total => {
      const el = iterator.next()
      if (el.done) {
        resolve(total)
        return
      }
      try {
        if (typeof el.value.task === 'function') {
          const result = await el.value.task(total)
          step++
          next(result)
        } else {
          const result = await Promise.all(
            el.value.task.map(t => t.task(total))
          )
          step++
          next(result)
        }
      } catch (err) {
        console.error('The error', err)
        eject(err, total)
      }
    }

    next(startValue)
  })
