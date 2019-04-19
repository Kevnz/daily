const vm = require('vm')
const delay = require('delay')
const workflow = require('../workflow')

const func1 = val => val.toUpperCase()
const func2 = val => `${val}-${val}`
const func3 = val => `${val}!!!`

describe('Tasks being hydrated from strings', () => {
  it('should take a task saved as a string and execute it', async () => {
    const strungFunced = `async data => {
      await delay(100)
      return func1(data)
    }`
    const getFunced = new Function(strungFunced)
    console.log('get funced', getFunced)
    const getTheFuncedOut = getFunced()
    console.log('get TheFuncedOut', getTheFuncedOut)
    const flowTasks = [
      {
        task: async data => {
          await delay(100)
          return func1(data)
        },
      },
      {
        task: async data => {
          await delay(100)
          return func2(data)
        },
      },
      {
        task: async data => {
          await delay(100)
          return func3(data)
        },
      },
    ]
    const fullFlow = [{ task: flowTasks }]

    const out = await workflow(...fullFlow)('dude')
    const expected = ['DUDE', 'dude-dude', 'dude!!!']
    expect(out.join('')).toBe(expected.join(''))
  })
})
