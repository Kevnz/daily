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

  it('should take a workflow array that includes an array and single tasks and run them in order and return values from tasks', async () => {
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
  it('should take a workflow array that includes an error and returns the error', async () => {
    const errorMessage = 'The task failed'
    const fn = data => {
      return `${data}-${data}`
    }
    const flowTasks = [
      {
        task: async data => {
          await delay(500)
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
          return Promise.reject(new Error(errorMessage))
        },
      },
    ]
    const fullFlow = [
      { task: flowTasks },
      {
        task: data => {
          expect(true).toBeFalsy()
          return 'done'
        },
      },
    ]
    const out = await workflow(...fullFlow)('X')
    console.info(out.error.message)
    expect(out.error.message).toBe(errorMessage)
  })
  it('should take a parallel workflow and if a step fails execute the error handler and not execute further steps', async () => {
    const errorMessage = 'The step failed'
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

    const fullFlow = [
      { task: tasks },
      {
        task: data => {
          expect(true).toBeTruthy()
          return 'before'
        },
      },
      {
        task: data => {
          expect(true).toBeTruthy()
          return Promise.reject(new Error(errorMessage))
        },
      },
      {
        task: data => {
          expect(true).toBeFalsy()
          return 'after'
        },
      },
    ]
    const out = await workflow(...fullFlow)('start')

    console.info(out)
    expect(out.error.message).toBe(errorMessage)
    expect(out.startingState).toBe('start')
    expect(out.currentIndex).toBe(2)
    expect(out.currentState).toBe('before')
  })
})
