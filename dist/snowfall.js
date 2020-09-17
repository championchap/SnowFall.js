window['snowfall'] = /******/ (function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {} // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {}
      /******/
    }) // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ) // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true // Return the exports of the module
    /******/
    /******/ /******/ return module.exports
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter
      })
      /******/
    }
    /******/
  } // define __esModule on exports
  /******/
  /******/ /******/ __webpack_require__.r = function(exports) {
    /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module'
      })
      /******/
    }
    /******/ Object.defineProperty(exports, '__esModule', { value: true })
    /******/
  } // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
  /******/
  /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
    value,
    mode
  ) {
    /******/ if (mode & 1) value = __webpack_require__(value)
    /******/ if (mode & 8) return value
    /******/ if (
      mode & 4 &&
      typeof value === 'object' &&
      value &&
      value.__esModule
    )
      return value
    /******/ var ns = Object.create(null)
    /******/ __webpack_require__.r(ns)
    /******/ Object.defineProperty(ns, 'default', {
      enumerable: true,
      value: value
    })
    /******/ if (mode & 2 && typeof value != 'string')
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key]
          }.bind(null, key)
        )
    /******/ return ns
    /******/
  } // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module['default']
          }
        : /******/ function getModuleExports() {
            return module
          }
    /******/ __webpack_require__.d(getter, 'a', getter)
    /******/ return getter
    /******/
  } // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property)
  } // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = '' // Load entry module and return exports
  /******/
  /******/
  /******/ /******/ return __webpack_require__(
    (__webpack_require__.s = './src/snowfall.js')
  )
  /******/
})(
  /************************************************************************/
  /******/ {
    /***/ './src/snowfall.js':
      /*!*************************!*\
  !*** ./src/snowfall.js ***!
  \*************************/
      /*! no static exports found */
      /***/ function(module, exports, __webpack_require__) {
        const vec2 = __webpack_require__(/*! ./vec2 */ './src/vec2.js')

        const appContainer = document.querySelector('#snow-container')

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        let gravity = vec2.create(0, 0)
        let wind = vec2.create(0, 0)
        let density = 250

        let snowflakes = []

        let bg = '#000000'
        let primary = '#8d90b7'
        let secondary = '#ffffff'

        let amplitude = 0.0
        let frequency = 0.0

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
              setGravity(config.gravity.angle, 0.6)
            }

            if (
              config.gravity.angle === undefined &&
              config.gravity.strength !== undefined
            ) {
              setGravity(90, config.gravity.strength)
            }
          }

          if (config.wind !== undefined) {
            if (
              config.wind.angle !== undefined &&
              config.wind.strength !== undefined
            ) {
              setWind(config.wind.angle, config.wind.strength)
            }

            if (
              config.wind.angle !== undefined &&
              config.wind.strength === undefined
            ) {
              setWind(config.wind.angle, 0.0)
            }

            if (
              config.wind.angle === undefined &&
              config.wind.strength !== undefined
            ) {
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

        let sine = null

        function update() {
          snowflakes.forEach(snowflake => {
            w.x = wind.x
            w.y = wind.y

            w.multiplyScalar(snowflake.size + snowflake.random)

            snowflake.pos.add(w)

            g.x = gravity.x
            g.y = gravity.y

            g.multiplyScalar(snowflake.size + snowflake.random)

            snowflake.pos.add(g)

            const phase = snowflake.noise

            sine = vec2.create(amplitude * Math.sin(frequency * t + phase), 0)

            snowflake.pos.add(sine)

            if (snowflake.pos.x > canvas.width) {
              snowflake.pos.x = 0
            }

            if (snowflake.pos.x < 0) {
              snowflake.pos.x = canvas.width
            }

            if (snowflake.pos.y > canvas.height) {
              snowflake.pos.y = 0
              snowflake.pos.x = Math.random() * canvas.width
            }

            if (snowflake.pos.y < 0) {
              snowflake.pos.y = canvas.height
              snowflake.pos.x = Math.random() * canvas.width
            }
          })

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
            drawCircle(snowflake.pos, snowflake.size)
            ctx.fill()
          })

          ctx.fillStyle = secondary
          foreground.forEach(snowflake => {
            ctx.beginPath()
            drawCircle(snowflake.pos, snowflake.size)
            ctx.fill()
          })
        }

        function makeSnowflakes(num) {
          let result = []

          while (num--) {
            result.push({
              pos: vec2.create(
                Math.random() * canvas.width,
                Math.random() * canvas.height
              ),
              size: 3 + Math.random() * 5,
              // Random value, just to add some uncertainty
              noise: Math.random() * 10,
              amplitude: Math.random() * 2,
              frequency: Math.random() * 0.01,
              random: Math.random()
            })
          }

          return result
        }

        // This function figures out how many snowflakes we should use for our given canvas size
        // Just setting a fixed number of snowflakes would give an uneven distribution of
        // snowflakes across different screen sizes, for example.
        function requiredSnowflakes() {
          const tenEightyPee = 1920 * 1080
          const thisScreen = canvas.width * canvas.height
          const snowflakeCount = Math.round(
            density * (thisScreen / tenEightyPee)
          )

          return snowflakeCount
        }

        function drawCircle(position, radius) {
          ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI, false)
        }

        function restart() {
          snowflakes = makeSnowflakes(requiredSnowflakes())
        }

        function setGravity(degrees, strength) {
          gravity = vec2.fromDegrees(degrees)
          gravity.multiplyScalar(strength)
        }

        function setWind(degrees, strength) {
          wind = vec2.fromDegrees(degrees)
          wind.multiplyScalar(strength)
        }

        function setAmplitude(num) {
          amplitude = num
        }

        function setAngle(deg) {
          degrees = deg
        }

        function setBackground(col) {
          bg = col
        }

        function setDensity(den) {
          density = den
          restart()
        }

        function setFrequency(freq) {
          frequency = freq
        }

        function setPrimary(col) {
          primary = col
        }

        function setSecondary(col) {
          secondary = col
        }

        function setStrength(str) {
          strength = str
        }

        module.exports = {
          setAmplitude,
          setAngle,
          setBackground,
          setDensity,
          setFrequency,
          setGravity,
          setPrimary,
          setSecondary,
          setStrength,
          setWind,
          start
        }

        /***/
      },

    /***/ './src/vec2.js':
      /*!*********************!*\
  !*** ./src/vec2.js ***!
  \*********************/
      /*! no static exports found */
      /***/ function(module, exports) {
        function create(_x, _y) {
          let x = _x
          let y = _y

          const add = v => {
            x += v.x
            y += v.y
          }

          const addScalar = s => {
            x += s
            y += s
          }

          const divide = v => {
            x /= v.x
            y /= v.y
          }

          const divideScalar = s => {
            x /= s
            y /= s
          }

          const dot = v => {
            return x * v.x + y * v.y
          }

          const getLength = () => {
            return Math.sqrt(x * x + y * y)
          }

          const getOpposite = v => {
            return create(-v.x, -v.y)
          }

          const getPerp = () => {
            return create(-y, x)
          }

          const isEqualTo = v => {
            return x == v.x && y == v.y
          }

          const multiply = v => {
            x *= v.x
            y *= v.y
          }

          const multiplyScalar = s => {
            x *= s
            y *= s
          }

          const normalise = () => {
            let l = getLength()

            x = x / l
            y = y / l
          }

          const setLength = l => {
            normalise()
            multiplyScalar(l)
          }

          const subtract = v => {
            x -= v.x
            y -= v.y
          }

          const subtractScalar = s => {
            x -= s
            y -= s
          }

          return {
            add,
            addScalar,
            clone,
            divide,
            divideScalar,
            dot,
            getLength,
            getOpposite,
            getPerp,
            isEqualTo,
            multiply,
            multiplyScalar,
            normalise,
            setLength,
            subtract,
            subtractScalar,
            set x(_x) {
              x = _x
            },
            get x() {
              return x
            },
            set y(_y) {
              y = _y
            },
            get y() {
              return y
            }
          }
        }

        const fromDegrees = degrees => {
          const rad = degrees * (Math.PI / 180)
          return create(Math.cos(rad), Math.sin(rad))
        }

        const clone = v => {
          return create(v.x, v.y)
        }

        module.exports = {
          clone,
          create,
          fromDegrees
        }

        /***/
      }

    /******/
  }
)
//# sourceMappingURL=snowfall.js.map
