/**
 * @module snowfall
 */

const vec2 = require('./vec2')
const { lerp } = require('./math')

const appContainer = document.querySelector('#snow-container')

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

let gravity = vec2.create(0, 0.7)
let wind = vec2.create(0, 0)
let density = 200

let snowflakes = []

let bg = '#0d0014'
let primary = '#8d90b7'
let secondary = '#ffffff'

let amplitude = 1.0
let frequency = 0.02

let fadeIn = false
let scroll = false

/**
 * A config object for the Snowfall Script
 * @typedef {Object} SnowConfig
 *
 * @property {string} [bg = '#0d0014'] - A hex string representing the
 * Background Colour of the canvas.
 * @property {string} [primary = '#8d90b7'] - A hex string representing the
 * colour of the snowflakes in the foreground.
 * @property {string} [secondary = '#ffffff'] - A hex string representing
 * the colour of the snowflakes in the background.
 * @property {number} [density = 200] - A number representing the required
 * density of snowflakes on screen. Note, this is not the actual number of
 * snowflakes.
 * @property {Boolean} [fadeIn = false] - Should the snowflakes grow in size
 * when the app starts or should they begin at their full size?
 * @property {Boolean} [scroll = false] - Should the snowflakes scroll when
 * the user scrolls up and down the page?
 *
 * @property {Object} wave - Configure the wave motion of the snowflakes.
 * @property {number} [wave.frequency = 0.02] - The frequency of the wave
 * the snowflakes follow.
 * @property {number} [wave.amplitude = 1.0] - The amplitude of the wave the
 * snowflakes follow.
 *
 * @property {Object} gravity - Configure the gravity of the simulation.
 * @property {number} [gravity.angle = 90] - The angle of gravity, in
 * degrees.
 * @property {number} [gravity.strength = 0.7] - The strength of gravity.
 *
 * @property {Object} wind - Configure the wind.
 * @property {number} [wind.angle = 0] - The angle of the wind, in degrees.
 * @property {number} [wind.strength = 0] - The strength of the wind.
 */

/**
 * @param {SnowConfig} config - A config, possibly from the Visual Config Editor.
 */
function start(config = {}) {
  if (config.bg !== undefined) {
    bg = config.bg
  }

  if (config.primary !== undefined) {
    primary = config.primary
  }

  if (config.secondary !== undefined) {
    secondary = config.secondary
  }

  if (config.density !== undefined) {
    density = config.density
  }

  if (config.fadeIn !== undefined) {
    fadeIn = config.fadeIn
  }

  if (config.scroll !== undefined) {
    scroll = config.scroll
  }

  if (config.wave !== undefined) {
    if (config.wave.amplitude !== undefined) {
      amplitude = config.wave.amplitude
    }

    if (config.wave.frequency !== undefined) {
      frequency = config.wave.frequency
    }
  }

  if (config.gravity !== undefined) {
    if (
      config.gravity.angle !== undefined &&
      config.gravity.strength !== undefined
    ) {
      setGravity(config.gravity.angle, config.gravity.strength)
    }

    if (
      config.gravity.angle !== undefined &&
      config.gravity.strength === undefined
    ) {
      setGravity(config.gravity.angle, 0.7)
    }

    if (
      config.gravity.angle === undefined &&
      config.gravity.strength !== undefined
    ) {
      setGravity(90, config.gravity.strength)
    }
  }

  if (config.wind !== undefined) {
    if (config.wind.angle !== undefined && config.wind.strength !== undefined) {
      setWind(config.wind.angle, config.wind.strength)
    }

    if (config.wind.angle !== undefined && config.wind.strength === undefined) {
      setWind(config.wind.angle, 0.0)
    }

    if (config.wind.angle === undefined && config.wind.strength !== undefined) {
      setWind(0.0, config.wind.strength)
    }
  }

  canvas.width = appContainer.offsetWidth
  canvas.height = appContainer.offsetHeight
  appContainer.appendChild(canvas)

  snowflakes = makeSnowflakes(requiredSnowflakes())

  window.onresize = onResize
  window.requestAnimationFrame(onEnterFrame)
}

/**
 * Schedule Function
 *
 * @param  {Object} schedule - An object that configures the schedule.
 * @param  {number[]} schedule.months - An array listing the months to run the snowfall script on. 1-12.
 * @param  {SnowConfig} config - A config object, just like would be passed into start()
 */
function schedule(sch = {}, config = {}) {
  const now = new Date()
  const month = now.getMonth() + 1

  const isInRange = sch.months.includes(month)

  if (isInRange) {
    const density = 100
    const flakeSize = 2

    start({ ...config, density, flakeSize })
  }
}

/**
 * Set the background colour
 *
 * @param {string} colour - The background colour of the Canvas
 */
function setBackground(col) {
  bg = col
}

/**
 * Sets the colour of the Snowflakes in the foreground
 *
 * @param {string} colour - A Hex string representing the colour of the
 *                          foreground snow.
 */
function setPrimary(col) {
  primary = col
}

/**
 * Sets the colour of the Snowflakes in the background
 *
 * @param {string} colour - A Hex string representing the colour of the
 *                          background snow.
 */
function setSecondary(col) {
  secondary = col
}

/**
 * Set the density of the Snowflakes. This is the number of snowflakes on screen
 * at a resolution of 1280 x 1080, but this number is scaled up and down at
 * higher and lower resolutions respectively to give a consistent look when
 * resizing.
 *
 * Setting this restarts the simulation.
 *
 * @param {number} density - A number representing the density of snowflakes.
 */
function setDensity(den) {
  density = den
  restart()
}

/**
 * Should the snowflakes grow in size from nothing until they reach their full
 * size? It happens pretty quickly.
 *
 * Setting this restarts the simulation.
 *
 * @param {Boolean} value - Yes or no?
 */
function setFade(val) {
  fadeIn = val
  restart()
}

/**
 * Should the snowflakes scroll up and down the page as the User scrolls?
 * @param {Boolean} value - Yes or no?
 */
function setScroll(val) {
  scroll = val
}

/**
 * Set the Amplitude of the Wave motion of the Snowflakes
 *
 * @param {number} amplitude - The Amplitude to set
 */
function setAmplitude(num) {
  amplitude = num
}

/**
 * Set the Frequency of the Wave motion of the Snowflakes.
 *
 * @param {number} frequency - The frequency to set
 */
function setFrequency(freq) {
  frequency = freq
}

/**
 * Set the angle and strength of gravity in the simulation.
 *
 * @param {number} angle - The angle of gravity, in degrees
 * @param {number} strength - The strength of the gravity
 */
function setGravity(degrees, strength) {
  gravity = vec2.fromDegrees(degrees)
  gravity.multiplyScalar(strength)
}

/**
 * Set the angle and strength of the wind in the simulation.
 *
 * @param {number} angle - The angle of the wind, in degrees
 * @param {number} strength - The strength of the wind
 */
function setWind(degrees, strength) {
  wind = vec2.fromDegrees(degrees)
  wind.multiplyScalar(strength)
}

function onResize() {
  canvas.width = appContainer.offsetWidth
  canvas.height = appContainer.offsetHeight

  snowflakes = makeSnowflakes(requiredSnowflakes())
}

function onEnterFrame() {
  update()
  render()

  window.requestAnimationFrame(onEnterFrame)
}

let t = 0

const w = vec2.create(0, 0)
const g = vec2.create(0, 0)

function update() {
  snowflakes.forEach(snowflake => {
    // add the wind
    w.x = wind.x
    w.y = wind.y

    w.multiplyScalar(snowflake.size + snowflake.random)
    snowflake.pos.add(w)

    // add gravity
    g.x = gravity.x
    g.y = gravity.y

    g.multiplyScalar(snowflake.size + snowflake.random)
    snowflake.pos.add(g)

    // add the wave motion
    const phase = snowflake.noise
    let sine = vec2.create(amplitude * Math.sin(frequency * t + phase), 0)

    snowflake.pos.add(sine)

    // wrap the snowflakes when they move off screen
    if (snowflake.pos.x > canvas.width) {
      snowflake.pos.x = 0
    }

    if (snowflake.pos.x < 0) {
      snowflake.pos.x = canvas.width
    }

    if (snowflake.pos.y > canvas.height) {
      snowflake.pos.y = snowflake.pos.y - canvas.height
      snowflake.pos.x = Math.random() * canvas.width
    }

    if (snowflake.pos.y < 0) {
      snowflake.pos.y = canvas.height - snowflake.pos.y
      snowflake.pos.x = Math.random() * canvas.width
    }

    if (snowflake.renderedSize < snowflake.size) {
      snowflake.renderedSize = lerp(
        snowflake.renderedSize,
        snowflake.size,
        0.025
      )
    }
  })

  previousPageYOffset = window.pageYOffset
  t += 1
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (bg) {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const bgSize = 7

  const foreground = snowflakes.filter(x => x.size >= bgSize)
  const background = snowflakes.filter(x => x.size < bgSize)

  ctx.fillStyle = primary
  background.forEach(snowflake => {
    ctx.beginPath()
    drawCircle(snowflake.pos, snowflake.renderedSize)
    ctx.fill()
  })

  ctx.fillStyle = secondary
  foreground.forEach(snowflake => {
    ctx.beginPath()
    drawCircle(snowflake.pos, snowflake.renderedSize)
    ctx.fill()
  })
}

function makeSnowflakes(num) {
  let result = []

  while (num--) {
    const size = 3 + Math.random() * 5
    const renderedSize = fadeIn === true ? 0 : size

    result.push({
      pos: vec2.create(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ),
      size,
      renderedSize,
      // Random value, just to add some uncertainty
      noise: Math.random() * 10,
      amplitude: Math.random() * 2,
      frequency: Math.random() * 0.01,
      random: Math.random()
    })
  }

  return result
}

// This function figures out how many snowflakes we should use for our given
// canvas size.
//
// Just setting a fixed number of snowflakes would give an uneven distribution
// of snowflakes across different screen sizes, for example.
function requiredSnowflakes() {
  const tenEightyPee = 1920 * 1080
  const thisScreen = canvas.width * canvas.height
  const snowflakeCount = Math.round(density * (thisScreen / tenEightyPee))

  return snowflakeCount
}

function drawCircle(position, radius) {
  ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI, false)
}

function restart() {
  snowflakes = makeSnowflakes(requiredSnowflakes())
}

module.exports = {
  schedule,
  setAmplitude,
  setBackground,
  setDensity,
  setFade,
  setFrequency,
  setGravity,
  setPrimary,
  setScroll,
  setSecondary,
  setWind,
  start
}
