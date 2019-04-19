const reducer = require('../reducer')
const composer = require('../composer')
describe('Composing functions', async () => {
  const func1 = val => val.toUpperCase()
  const func2 = val => `${val}-${val}`
  const func3 = val => `${val}!!!`
  it('should take a starting value and execute an array of functions', async () => {
    const chain = await reducer('dude', func1, func2, func3)
    expect(chain).toBe('DUDE-DUDE!!!')
  })
  it('should take a group of functions and return 1 function that does all', async () => {
    const chain = await composer(func1, func2, func3)
    expect(chain('dude')).toBe('DUDE-DUDE!!!')
  })
})
