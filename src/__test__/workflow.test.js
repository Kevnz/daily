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
          console.log('THE TASK 1')
          await delay(100)
          return func1(data)
        },
      },
      {
        task: async data => {
          console.log('THE TASK 2')
          await delay(100)
          return func2(data)
        },
      },
      {
        task: async data => {
          console.log('THE TASK 3')
          await delay(100)
          return func3(data)
        },
      },
    ]

    const out = await workflow(...flowTasks)('dude')
    expect(out).toBe('DUDE-DUDE!!!')
  })

  it('should take a work flow and if a step fails execute the error handler', async () => {
    const tasksThatHaveError = [
      {
        task: async data => {
          console.log('THE TASK 1 BEFORE FAIL')
          await delay(100)
          return func1(data)
        },
      },
      {
        task: async data => {
          console.log('THE ERROR TASK 2')
          await delay(100)
          throw new Error('Go Boom')
        },
      },
      {
        task: async data => {
          console.log('THE TASK 3 THAT NEVER HITS')
          await delay(100)
          return func3(data)
        },
      },
    ]

    const out = await workflow(...tasksThatHaveError)('dude')

    expect(out.error).not.toBeNull()
  })
})
