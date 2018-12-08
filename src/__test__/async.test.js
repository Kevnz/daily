const delay = require('delay')
const composer = require('../async-composer')

const func1 = val => val.toUpperCase()
const func2 = val => `${val}-${val}`
const func3 = val => `${val}!!!`

const workflow = tasks => {
  console.log('the workflow')
  const mappedTasks = tasks.map(t => t.task)
  console.log('mapped', mappedTasks)
  return composer(...mappedTasks)
}
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

    const out = await workflow(flowTasks)('dude')
    expect(out).toBe('DUDE-DUDE!!!')
  })

  it('should take a work flow and keep state', () => {
    console.log('test')
  })
})
