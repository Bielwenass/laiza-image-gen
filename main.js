let fs = require("fs")
let Jimp = require("jimp")

// Settings

// Meta
const RESOLUTION =       3840 // Resolution of the output pics
const ITER_COUNT =       3 // Number of iterations to be processed for each image
const IMAGES_COUNT =     50 // Number of images to generate
const SAVE_ALL_ITERS =   false // Save all iterations or only the final one
const RANDOM_NAMES =     true // Assign random filenames on save

// Postprocessing
const SATURATION_CONST = false // Constant saturation in 0-1 range
  
// Modes
const RANDOM_FILTERS =   false // Randomize what filters will be used
const TEST_MODE =        false // All filters except test will be disabled

// Filters
const USE_TEST =         false // Enable the test filter
const USE_CIRCLES =      true // Enable the "circles" filter
const USE_SINLINES =     true // Enable the "sinlines" filter
const USE_COSLINES =     true // Enable the "coslines" filter
const USE_SWIRL =        true // Enable the "swirl" filter
const USE_TANGRAD =      true // Enable the "tangrad" filter
const USE_GRADIENT =     true // Enable the "gradient" filter
const USE_FUZZY =        false // Enable the "fuzzy" filter
const USE_POWREMAIN =    true // Enable the "powremain" filter
const USE_POWSUBTRACT =  true // Enable the "powsubtract" filter

let stream = fs.createWriteStream("morph.log", { flags:'a' })
fs.writeFile('morph.log', '', function(err){if (err) console.log(err)}) // Clean file

for (let i = 1; i <= IMAGES_COUNT; i++) {
  generateImage(i)
}

function generateImage(num) {
  let usable_filters = []

  if (TEST_MODE) {
    usable_filters.push("testfilter")
  } else if (RANDOM_FILTERS) {
    if (USE_TEST) usable_filters.push("testfilter")
    if (USE_CIRCLES && getRandomInt(0, 4)) usable_filters.push("circles")
    if (USE_SINLINES && getRandomInt(0, 3)) usable_filters.push("sinlines")
    if (USE_COSLINES && getRandomInt(0, 3)) usable_filters.push("coslines")
    if (USE_SWIRL && getRandomInt(0, 4)) usable_filters.push("swirl")
    if (USE_TANGRAD && getRandomInt(0, 4)) usable_filters.push("tangrad")
    if (USE_GRADIENT && getRandomInt(0, 4)) usable_filters.push("gradient")
    if (USE_FUZZY && getRandomInt(0, 1)) usable_filters.push("fuzzy")
    if (USE_POWREMAIN && getRandomInt(0, 2)) usable_filters.push("powremain")
    if (USE_POWSUBTRACT && getRandomInt(0, 2)) usable_filters.push("powsubtract")
    stream.write('\n' + "generated with random filters - " + usable_filters + '\n')
  } else {
    if (USE_TEST)        usable_filters.push("testfilter")
    if (USE_CIRCLES)     usable_filters.push("circles")
    if (USE_SINLINES)    usable_filters.push("sinlines")
    if (USE_COSLINES)    usable_filters.push("coslines")
    if (USE_SWIRL)       usable_filters.push("swirl")
    if (USE_TANGRAD)     usable_filters.push("tangrad")
    if (USE_GRADIENT)    usable_filters.push("gradient")
    if (USE_FUZZY)       usable_filters.push("fuzzy")
    if (USE_POWREMAIN)   usable_filters.push("powremain")
    if (USE_POWSUBTRACT) usable_filters.push("powsubtract")
  }

  stream.write("image " + num + " generation start \n")
  let image = new Jimp(RESOLUTION, RESOLUTION, function (err, image) {
    let again = 0
    let randPtX = 0
    let randPtY = 0

    for (let i = 1; i <= ITER_COUNT; i++) {
      stream.write('\n' + "iteration " + i + '\n')

      if (!again) {
        randPtX = getRandomInt(-RESOLUTION, RESOLUTION * 2)
        randPtY = getRandomInt(-RESOLUTION, RESOLUTION * 2)
      } else if (getRandomInt(0, 1)) {
        randPtX += getRandomInt(-50, 50)
        randPtY += getRandomInt(-50, 50)
      }

      let radius = getRandomInt(10, RESOLUTION / 2)
      again = getRandomInt(0, 1)

      switch (usable_filters[Math.floor(Math.random() * usable_filters.length)]) {
        case "testfilter": 
          testfilter(this, randPtX, randPtY, radius)
          stream.write("TESTING A NEW FILTER at X = " + randPtX + " Y = " + randPtY + " radius = " + radius + "\n")
          break
        case "circles":
          circles(this, randPtX, randPtY, radius)
          stream.write("circles at X = " + randPtX + " Y = " + randPtY + " radius = " + radius + "\n")
          break
        case "sinlines":
          sinlines(this, randPtX, randPtY, radius)
          stream.write("sinlines at X = " + randPtX + " Y = " + randPtY + " radius = " + radius + "\n")
          break
        case "coslines":
          coslines(this, randPtX, randPtY, radius)
          stream.write("coslines at X = " + randPtX + " Y = " + randPtY + " radius = " + radius + "\n")
          break
        case "swirl":
          swirl(this, randPtX, randPtY, radius)
          stream.write("swirl at X = " + randPtX + " Y = " + randPtY + " radius = " + radius + "\n")
          break
        case "tangrad":
          tangrad(this, randPtX, randPtY, radius)
          stream.write("tangrad at X = " + randPtX + " Y = " + randPtY + " radius = " + radius + "\n")
          break
        case "gradient":
          gradient(this, randPtX, randPtY, radius)
          stream.write("gradient at X = " + randPtX + " Y = " + randPtY + " radius = " + radius + "\n")
          break
        case "fuzzy":
          fuzzy(this, randPtX, randPtY, radius)
          stream.write("fuzzy at X = " + randPtX + " Y = " + randPtY + " radius = " + radius + "\n")
          break
        case "powremain":
          powremain(this, randPtX, randPtY)
          stream.write("powremain at X = " + randPtX + " Y = " + randPtY + "\n")
          break
        case "powsubtract":
          powsubtract(this, randPtX, randPtY)
          stream.write("powsubtract at X = " + randPtX + " Y = " + randPtY + "\n")
          break
        case "default":
          stream.write("none of the filters could be applied" + "\n")
      }

      image.scan (0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        this.bitmap.data[ idx + 3 ] = 255
      })
      let hue = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

      if (i != ITER_COUNT && SAVE_ALL_ITERS) {
        image.write( "outp" + i + ".png" )
      }
    }

    let sat = SATURATION_CONST || getRandomInt(10, 100) / 100

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      let max = Math.max(this.bitmap.data[ idx + 0 ], this.bitmap.data[ idx + 1 ], this.bitmap.data[ idx + 2 ])
      this.bitmap.data[ idx + 0 ] += Math.abs(max - this.bitmap.data[ idx + 0 ]) * Math.abs(1 - sat)
      if (this.bitmap.data[ idx + 0 ] > 255) this.bitmap.data[ idx + 0 ] = 255
      this.bitmap.data[ idx + 1 ] += Math.abs(max - this.bitmap.data[ idx + 1 ]) * Math.abs(1 - sat)
      if (this.bitmap.data[ idx + 1 ] > 255) this.bitmap.data[ idx + 1 ] = 255
      this.bitmap.data[ idx + 2 ] += Math.abs(max - this.bitmap.data[ idx + 2 ]) * Math.abs(1 - sat)
      if (this.bitmap.data[ idx + 2 ] > 255) this.bitmap.data[ idx + 2 ] = 255
    })

    if (RANDOM_NAMES) {
      let randomString = Math.random().toString(26).substring(7);
      image.write(`result/${num}_${randomString}.png`)
    } else {
      image.write(`result/${num}.png`)
    }

    stream.write("generation end" + '\n\n\n')
    delete image
    console.log(`Generated image ${num}`)
  })
}

function circles(image, randPtX, randPtY, radius) {
  let colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)]
  let colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    let formula = dist([randPtX, randPtY], [x, y]) / radius

    for (let i = 0; i < 3; i++) {
      this.bitmap.data[ idx + i ] = Math.abs(this.bitmap.data[ idx + i ] - colA[i] * formula )
    }
  })
}

function sinlines(image, randPtX, randPtY, radius) {
  let colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)]
  let colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    let xpercent = x / RESOLUTION
    let ypercent = y / RESOLUTION

    for (let i = 0; i < 3; i++) {
      this.bitmap.data[ idx + i ] = Math.abs(this.bitmap.data[ idx + i ] + 127 + 0.5 * colA[i] * Math.sin(xpercent + ypercent))
    }
  })
}

function coslines(image, randPtX, randPtY, radius) {
  let colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)]
  let colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    let xpercent = x / RESOLUTION
    let ypercent = y / RESOLUTION

    for (let i = 0; i < 3; i++) {
      this.bitmap.data[ idx + i ] = Math.abs(this.bitmap.data[ idx + i ] + 127 + 0.5 * colA[i] * Math.cos(xpercent + ypercent))
    }
  })
}


function swirl(image, randPtX, randPtY, radius) {
  let colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)]
  let colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    for (let i = 0; i < 3; i++) {
      this.bitmap.data[ idx + i ] = Math.abs(this.bitmap.data[ idx + i ] - colA[i] * (1 / dist([randPtX, randPtY], [x, y]) * radius ) )
    }
  })
}

function tangrad(image, randPtX, randPtY, radius) {
  let colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)]
  let colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    let xpercent = x / RESOLUTION
    let ypercent = y / RESOLUTION
    let formulaA = Math.tan(xpercent)
    let formulaB = Math.tan(ypercent)

      for (let i = 0; i < 3; i++) {
        let resultingColor = colA[i] * formulaA - colB[i] * formulaB
        this.bitmap.data[ idx + i ] = Math.abs(this.bitmap.data[ idx + i ] - resultingColor)
      }
  })
}

function gradient(image, randPtX, randPtY, radius) {
  let colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)]
  let colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    let xpercent = x / RESOLUTION
    let ypercent = y / RESOLUTION

    for (let i = 0; i < 3; i++) {
      this.bitmap.data[ idx + i ] = Math.abs(this.bitmap.data[ idx + i ] - (xpercent * colA[i] + (1 - xpercent) * colB[i]))
    }
  })
}

function fuzzy(image, randPtX, randPtY, radius) {
  let colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)]

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    let formula = dist([randPtX, randPtY], [x, y]) * getRandomInt(1, 1000) / 7500

    for (let i = 0; i < 3; i++) {
      let resultingColor = colA[i] / formula > 255 ? 255 : colA[i] / formula
      this.bitmap.data[ idx + i ] = Math.abs(this.bitmap.data[ idx + i ] - resultingColor )
    }
  })
}

function powremain(image, randPtX, randPtY) {
  let colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)]

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    let xpercent = x / RESOLUTION
    let ypercent = y / RESOLUTION
    let formula = Math.pow(xpercent, Math.sin(randPtX)) % Math.pow(ypercent, Math.sin(randPtY))

    for (let i = 0; i < 3; i++) {
      let resultingColor = colA[i] / formula > 255 ? 255 : colA[i] / formula
      this.bitmap.data[ idx + i ] = Math.abs(this.bitmap.data[ idx + i ] - resultingColor )
    }
  })
}

function powsubtract(image, randPtX, randPtY) {
  let colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)]
  let colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) { 
    let xpercent = x / RESOLUTION
    let ypercent = y / RESOLUTION
    let formula = Math.pow(xpercent, Math.sin(randPtX)) - Math.pow(ypercent, Math.sin(randPtY))

    for (let i = 0; i < 3; i++) {
      let resultingColor = colA[i] / formula > 255 ? 255 : colA[i] / formula
      this.bitmap.data[ idx + i ] = Math.abs(this.bitmap.data[ idx + i ] - resultingColor )
    }
  })
}

// formula = Math.abs(Math.pow(x, coef1)-Math.pow(y, Math.sin(coef2)))
// formula = Math.abs(Math.pow(xpercent, coef1)*Math.pow(ypercent, Math.sin(coef2)))

function testfilter(image, randPtX, randPtY, radius) {
  let colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)]
  let colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

  // randPtX = 500
  // randPtY = 500
  let coef1 = getRandomInt(0, 5)
  let coef2 = getRandomInt(0, 5)

  let min = 999999
  let max = -999999
  let coef = getRandomInt(1, 1000) / 7500

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    let xpercent = x / RESOLUTION
    let ypercent = y / RESOLUTION
    let formula = Math.abs(Math.pow(xpercent, coef1)*Math.pow(ypercent, Math.sin(coef2)))

    if (formula > max) {
      max = formula
    }
    if (formula < min) {
      min = formula
    }

    for (let i = 0; i < 3; i++) {
      let resultingColor = colA[i] * formula > 255 ? 255 : colA[i] * formula
      this.bitmap.data[ idx + i ] = Math.abs(this.bitmap.data[ idx + i ] - resultingColor )
    }
  })

  stream.write("min = " + min + " max = " + max + " coef = " + coef + "\n")
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min
}

function dist(ptA, ptB) {
  return Math.hypot(ptA[0] - ptB[0], ptA[1] - ptB[1])
}

stream.write("end \n")
return
