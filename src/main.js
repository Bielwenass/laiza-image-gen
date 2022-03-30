import fs from 'fs'
import Jimp from 'jimp'
import path from 'path'

import { fileURLToPath } from 'url'

import { getRandomInt, clamp } from './utils.js'
import { filters } from './filters.js'
import {
  resolution,
  iterationsCount,
  imagesCount,
  saveAllIterations,
  enableRandomNames,
  saturationPredefined,
  genMode,
  filtersToUse
} from './settings.js'

const outputPath = path.join(fileURLToPath(import.meta.url), '../../output')
const outputPathRel = path.relative('./', outputPath)

// Clear log file if it exists
if (fs.existsSync(`${outputPathRel}/morph.log`)) {
  fs.writeFile(`${outputPathRel}/morph.log`, '', (err) => { if (err) console.error(err) })
}

const generationLog = fs.createWriteStream(`${outputPathRel}/morph.log`, { flags: 'a' })

for (let i = 1; i <= imagesCount; i++) {
  generateImage(i)
}

function generateImage (imageId) {
  const usableFilters = []

  switch (genMode) {
    case 'normal':
      for (const [filterName, isEnabled] of Object.entries(filtersToUse)) {
        if (isEnabled) {
          usableFilters.push(filterName)
        }
      }

      break
    case 'random':
      for (const filterName of Object.keys(filtersToUse)) {
        // 50% chance to select any given filter
        if (getRandomInt(0, 1)) {
          usableFilters.push(filterName)
        }
      }

      break
    case 'test':
      usableFilters.push('test')

      break
  }

  let imageName = imageId

  if (enableRandomNames) {
    const randomString = Math.random().toString(26).substring(7)
    imageName += '_' + randomString
  }

  generationLog.write(`\n\nimage ${imageName} generation start \n`)

  const image = new Jimp(resolution.x, resolution.y)

  let again = 0
  let randPtX = 0
  let randPtY = 0

  for (let iter = 1; iter <= iterationsCount; iter++) {
    generationLog.write(`\niteration ${iter}\n`)

    // 50% chance for the next iteration base point to be close to the current one
    // Creates interesting overlapping patterns
    if (!again) {
      randPtX = getRandomInt(-resolution.x, resolution.x * 2)
      randPtY = getRandomInt(-resolution.y, resolution.y * 2)
    } else if (getRandomInt(0, 1)) {
      randPtX += getRandomInt(-resolution.x / 10, resolution.x / 10)
      randPtY += getRandomInt(-resolution.y / 10, resolution.y / 10)
    }

    again = getRandomInt(0, 1)

    const radius = getRandomInt(0, Math.max(resolution.x, resolution.y) / 2)

    // Randomly select a filter among all currently used
    const selectedFilter = usableFilters[Math.floor(Math.random() * usableFilters.length)]

    // Apply the filter
    if (selectedFilter in filters) {
      filters[selectedFilter](image, randPtX, randPtY, radius)
      generationLog.write(`${selectedFilter} at X = ${randPtX} Y = ${randPtY} radius = ${radius}\n`)
    } else {
      throw new Error(`Filter ${selectedFilter} not defined`)
    }

    // Make sure the image is fully opaque before the next iteration
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      image.bitmap.data[idx + 3] = 255
    })

    // Save intermediate iterations if needed
    if (saveAllIterations && iter !== iterationsCount) {
      image.write(`${outputPathRel}/${imageName}_iter${iter}.png`)
    }
  }

  const saturation = typeof saturationPredefined === 'number'
    ? saturationPredefined
    : Math.random()

  // Apply saturation
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const max = Math.max(image.bitmap.data[idx + 0], image.bitmap.data[idx + 1], image.bitmap.data[idx + 2])

    for (let i = 0; i < 3; i++) {
      image.bitmap.data[idx + i] += Math.abs(max - image.bitmap.data[idx + i]) * Math.abs(1 - saturation)
      image.bitmap.data[idx + i] = clamp(image.bitmap.data[idx + i], 0, 255)
    }
  })

  image.writeAsync(`${outputPathRel}/${imageName}.png`)

  console.log(`Generated image ${imageName}`)
}

generationLog.write('\n\nend\n')
