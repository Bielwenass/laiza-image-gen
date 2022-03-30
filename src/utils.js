export function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min
}

export function getRandomColor (maxAlpha) {
  return [
    getRandomInt(0, 255),
    getRandomInt(0, 255),
    getRandomInt(0, 255),
    getRandomInt(0, maxAlpha)
  ]
}

export function dist (ptA, ptB) {
  return Math.hypot(ptA[0] - ptB[0], ptA[1] - ptB[1])
}

export function clamp (x, min, max) {
  return Math.max(Math.min(x, max), min)
}
