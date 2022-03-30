// Resolution of the output pics
export const resolution = {
  x: 2560,
  y: 1440
}

// Number of filters to be applied to each image
export const iterationsCount = 10

// Number of images to generate
export const imagesCount = 5

// Save all iterations or only the final one
export const saveAllIterations = false

// Assign random filenames on save
export const enableRandomNames = true

// Constant saturation in 0-1 range (false to disable)
export const saturationPredefined = false

// Generation mode
// 'normal' uses filters set to true in filtersToUse
// 'random' uses randomly selected filters for each image (50% chance for each filter)
// 'test' only uses the test filter
export const genMode = 'normal'

// Filters to be used in generation
// Edit as needed, new filters can also be added
export const filtersToUse = {
  test: false,
  circles: true,
  swirl: true,
  sinlines: true,
  coslines: false,
  gradient: true,
  tangrad: true,
  fuzzy: false,
  powremain: true,
  powsubtract: true
}
