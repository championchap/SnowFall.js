# snowfall.js

A nice snow effect drawn in a canvas element, perfect for a classic 90's Winter theme.

## Features

- [Visual config editor](https://erikwatson.github.io/snowfall.js/)
- [API Reference](https://github.com/erikwatson/snowfall.js/wiki/API-Reference)
- Foreground and Background Layers
- Proportional number of snowflakes across resolutions
- Small, with no dependencies

## Instructions

First, install.

```sh
# if you're using yarn
yarn add @erikwatson/snowfall

# if you're using npm
npm install @erikwatson/snowfall
```

Then...

```html
<!-- You are expected to size and position this yourself with CSS -->
<div id="snow-container"></div>

<!-- Include the lib, wherever you've put it -->
<script type="text/javascript" src="./path/to/snowfall.min.js"></script>
```

```js
// You can change the defaults by passing in a config object here
// Use the Visual Config Editor to create one
snowfall.start()
```

## Build it yourself

- `git clone git@github.com:erikwatson/snowfall.js.git`
- `yarn install`
- `yarn build`

## Authors

- [Erik Watson](http://erikwatson.me)
