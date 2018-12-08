module.exports = (startValue, ...funcs) =>
  new Promise((resolve, reject) => {
    const iterator = funcs[Symbol.iterator]()
    const next = async total => {
      const el = iterator.next()

      if (el.done) {
        resolve(total)
        return
      }
      const result = await el.value(total)
      next(result)
    }

    next(startValue)
  })
