const fs = require('fs').promises
const bent = require('bent')
const getBuffer = bent('buffer')

;(async () => {
  let buffer = await getBuffer('https://javascript.rodeo/js-rodeo.png')
  await fs.writeFile('js-rodeo.png', buffer)
})()
