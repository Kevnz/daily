const defaults = {
  concurrency: Infinity,
}

const Map = (iterable, mappingFunction, passedOptions) =>
  new Promise((resolve, reject) => {
    const options = {
      ...defaults,
      ...passedOptions,
    }

    const { concurrency } = options

    const ret = []
    const iterator = iterable[Symbol.iterator]()
    let isRejected = false
    let isIterableDone = false
    let resolvingCount = 0
    let currentIndex = 0

    const next = () => {
      if (isRejected) {
        return
      }

      const nextItem = iterator.next()
      const i = currentIndex
      currentIndex++

      if (nextItem.done) {
        isIterableDone = true

        if (resolvingCount === 0) {
          resolve(ret)
        }
        return
      }

      resolvingCount++

      Promise.resolve(nextItem.value)
        .then(element => mappingFunction(element, i))
        .then(
          value => {
            ret[i] = value
            resolvingCount--
            next()
          },
          error => {
            isRejected = true
            reject(error)
          }
        )
    }

    for (let i = 0; i < concurrency; i++) {
      next()

      if (isIterableDone) {
        break
      }
    }
  })

module.exports = Map
