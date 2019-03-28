const delay = require('delay')
const workflow = require('../workflow')

const func1 = val => val.toUpperCase()
const func2 = val => `${val}-${val}`
const func3 = val => `${val}!!!`

describe('How the workflow executes in parallel', () => {
  it('should take a workflow task with an array and run them in parallel', async () => {
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

  it('should take a parallel work flow and if a step fails execute the error handler', async () => {
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

    const fullFlow = [{ task: tasks }]
    const out = await workflow(...fullFlow)('dude')

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
    const fullFlow = [
      { task: flowTasks },
      {
        task: data => {
          expect(data.join('-')).toBe('X-X-X-X-X-X')
          return 'done'
        },
      },
    ]
    const out = await workflow(...fullFlow)('X')
    expect(out).toBe('done')
  })
})
