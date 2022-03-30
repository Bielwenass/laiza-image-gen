import { getRandomInt, getRandomColor, dist, clamp } from './utils.js'
import { resolution } from './settings.js'

export const filters = {
  circles (image, randPtX, randPtY, radius) {
    const colA = getRandomColor(200)

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const formula = dist([randPtX, randPtY], [x, y]) / radius

      for (let i = 0; i < 3; i++) {
        this.bitmap.data[idx + i] = Math.abs(this.bitmap.data[idx + i] - colA[i] * formula)
      }
    })
  },

  swirl (image, randPtX, randPtY, radius) {
    const colA = getRandomColor(200)

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      for (let i = 0; i < 3; i++) {
        this.bitmap.data[idx + i] = Math.abs(this.bitmap.data[idx + i] - colA[i] * (1 / dist([randPtX, randPtY], [x, y]) * radius))
      }
    })
  },

  sinlines (image, randPtX, randPtY, radius) {
    const colA = getRandomColor(200)

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const xpercent = x / resolution.x
      const ypercent = y / resolution.y

      for (let i = 0; i < 3; i++) {
        this.bitmap.data[idx + i] = Math.abs(this.bitmap.data[idx + i] + 127 + 0.5 * colA[i] * Math.sin(xpercent + ypercent))
      }
    })
  },

  coslines (image, randPtX, randPtY, radius) {
    const colA = getRandomColor(200)

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const xpercent = x / resolution.x
      const ypercent = y / resolution.y

      for (let i = 0; i < 3; i++) {
        this.bitmap.data[idx + i] = Math.abs(this.bitmap.data[idx + i] + 127 + 0.5 * colA[i] * Math.cos(xpercent + ypercent))
      }
    })
  },

  gradient (image, randPtX, randPtY, radius) {
    const colA = getRandomColor(200)
    const colB = getRandomColor(255)

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const xpercent = x / resolution.x

      for (let i = 0; i < 3; i++) {
        this.bitmap.data[idx + i] = Math.abs(this.bitmap.data[idx + i] - (xpercent * colA[i] + (1 - xpercent) * colB[i]))
      }
    })
  },

  tangrad (image, randPtX, randPtY, radius) {
    const colA = getRandomColor(200)
    const colB = getRandomColor(255)

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const xpercent = x / resolution.x
      const ypercent = y / resolution.y
      const formulaA = Math.tan(xpercent)
      const formulaB = Math.tan(ypercent)

      for (let i = 0; i < 3; i++) {
        const resultingColor = colA[i] * formulaA - colB[i] * formulaB
        this.bitmap.data[idx + i] = Math.abs(this.bitmap.data[idx + i] - resultingColor)
      }
    })
  },

  fuzzy (image, randPtX, randPtY, radius) {
    const colA = getRandomColor(200)

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const formula = dist([randPtX, randPtY], [x, y]) * getRandomInt(1, 1000) / 7500

      for (let i = 0; i < 3; i++) {
        const resultingColor = clamp(colA[i] / formula, 0, 255)
        this.bitmap.data[idx + i] = Math.abs(this.bitmap.data[idx + i] - resultingColor)
      }
    })
  },

  powremain (image, randPtX, randPtY) {
    const colA = getRandomColor(200)

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const xpercent = x / resolution.x
      const ypercent = y / resolution.y
      const formula = Math.pow(xpercent, Math.sin(randPtX)) % Math.pow(ypercent, Math.sin(randPtY))

      for (let i = 0; i < 3; i++) {
        const resultingColor = clamp(colA[i] / formula, 0, 255)
        this.bitmap.data[idx + i] = Math.abs(this.bitmap.data[idx + i] - resultingColor)
      }
    })
  },

  powsubtract (image, randPtX, randPtY) {
    const colA = getRandomColor(200)

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const xpercent = x / resolution.x
      const ypercent = y / resolution.y
      const formula = Math.pow(xpercent, Math.sin(randPtX)) - Math.pow(ypercent, Math.sin(randPtY))

      for (let i = 0; i < 3; i++) {
        const resultingColor = clamp(colA[i] / formula, 0, 255)
        this.bitmap.data[idx + i] = Math.abs(this.bitmap.data[idx + i] - resultingColor)
      }
    })
  },

  test (image, randPtX, randPtY, radius) {
    const colA = getRandomColor(200)

    // randPtX = 500
    // randPtY = 500
    const coef1 = getRandomInt(0, 5)
    const coef2 = getRandomInt(0, 5)

    let min = 999999
    let max = -999999
    // const coef = getRandomInt(1, 1000) / 7500

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const xpercent = x / resolution.x
      const ypercent = y / resolution.y
      const formula = Math.abs(Math.pow(xpercent, coef1) * Math.pow(ypercent, Math.sin(coef2)))

      if (formula > max) {
        max = formula
      }
      if (formula < min) {
        min = formula
      }

      for (let i = 0; i < 3; i++) {
        const resultingColor = clamp(colA[i] * formula, 0, 255)
        this.bitmap.data[idx + i] = Math.abs(this.bitmap.data[idx + i] - resultingColor)
      }
    })
  }
}
