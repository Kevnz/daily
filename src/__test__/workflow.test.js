const delay = require('delay')
const workflow = require('../workflow')

const func1 = val => val.toUpperCase()
const func2 = val => `${val}-${val}`
const func3 = val => `${val}!!!`

describe('How the workflow executes', () => {
  it('should take a workflow array and run them in order', async () => {
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

    const out = await workflow(...flowTasks)('dude')
    expect(out).toBe('DUDE-DUDE!!!')
  })

  it('should take a work flow and if a step fails execute the error handler', async () => {
    const tasks = [
      {
        task: async data => {
          await delay(100)
          return func1(data)
        },
      },
      {
        task: async data => {
          await delay(100)
          return func3(data)
        },
      },
    ]

    const out = await workflow(...tasks)('dude')

    expect(out.error).not.toBeNull()
  })

  it('should take a workflow array and run them in order and return values from tasks', async () => {
    const fn = data => {
      return `${data}-${data}`
    }
    const flowTasks = [
      {
        task: async data => {
          await delay(100)
          return fn(data)
        },
      },
      {
        task: async data => {
          await delay(130)
          return fn(data)
        },
      },
      {
        task: async data => {
          await delay(100)
          return fn(data)
        },
      },
    ]

    const out = await workflow(...flowTasks)('dude')
    expect(out).toBe('dude-dude-dude-dude-dude-dude-dude-dude')
  })
})
