# snowfall.js

The perfect snow effect for your Winter themed website!

Suggested use: attach it as a fixed background to your page with the content
displayed over the top. [Check out this example](http://erikwatson.me/?snow).

## Features

- [Visual config editor](https://erikwatson.github.io/snowfall-editor/)
- [API Reference](https://erikwatson.github.io/snowfall.js/)
- Easy to use.
- Simple, but beautiful.
- Scheduling, so you can set it and forget it.
- Multiple layers give the illusion of depth.
- Density of snowflakes looks correct even when the window is resized.
- Small, with no dependencies.

## Instructions - Package Manager

### Install it

```sh
# if you're using yarn install with
yarn add @erikwatson/snowfall

# if you're using npm install with
npm install @erikwatson/snowfall
```

### Use it

Add a div with an ID of `snow-container` to your page. You will need to set the
width and height of this yourself using CSS.

```html
<div id="snow-container"></div>
```

Then, at the bottom of your page body add the following.

```html
<script
  type="text/javascript"
  src="./node_modules/@erikwatson/snowfall/dist/snowfall.min.js"
></script>
<script>
  // You can change the defaults by passing in a config object here
  // Use the Visual Config Editor to create one
  snowfall.start()
</script>
```

**WARNING:** You should symlink to the .js file rather than have a publicly
accessible node_modules folder. It is this way here just to keep example simple.

## Instructions - CDN

First, add a div with an ID of `snow-container` to your page. You will need to
set the width and height of this yourself using CSS.

```html
<div id="snow-container"></div>
```

Then, at the bottom of your page body add the following.

```html
<script src="https://cdn.jsdelivr.net/npm/@erikwatson/snowfall/dist/snowfall.min.js"></script>
<script>
  // You can change the defaults by passing in a config object here
  // Use the Visual Config Editor to create one
  snowfall.start()
</script>
```

### Specify Version

It is not recommended to always use the latest version, especially in
production. You can change the CDN url to specify control over the version using
the `@version` syntax like so.

- **latest release**: https://cdn.jsdelivr.net/npm/@erikwatson/snowfall/dist/snowfall.min.js
- **major release**: https://cdn.jsdelivr.net/npm/@erikwatson/snowfall@3/dist/snowfall.min.js
- **minor release**: https://cdn.jsdelivr.net/npm/@erikwatson/snowfall@3.1/dist/snowfall.min.js
- **patch release**: https://cdn.jsdelivr.net/npm/@erikwatson/snowfall@3.0.1/dist/snowfall.min.js

## Author

- [Erik Watson](http://erikwatson.me)
