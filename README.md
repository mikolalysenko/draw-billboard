draw-billboard
==============
Draws a 2D billboarded sprite in WebGL.  Useful for debugging and small special effects.

Example
=======

```javascript
var shell = require("gl-now")()
var camera = require("game-shell-orbit-camera")(shell)
var renderText = require("gl-render-text")
var mat4 = require("gl-mat4")
var drawBillboard = require("draw-billboard")

var texture
var positions = new Array(100)

shell.on("gl-init", function() {
  var gl = shell.gl
  texture = renderText(gl, "Billboard")
  
  for(var i=0; i<100; ++i) {
    positions[i] = [ 100 * (0.5 - Math.random()),
                     100 * (0.5 - Math.random()),
                     100 * (0.5 - Math.random()) ]
  }
})

shell.on("gl-render", function() {
  var proj = mat4.perspective(mat4.create(), Math.PI/4.0, shell.width/shell.height, 0.1, 1000.0)
  var view = camera.view()
  for(var i=0; i<100; ++i) {
    drawBillboard(shell.gl, positions[i], { texture: texture, projection: proj, view: view })
  }
})
```

[Try it in your browser.](http://mikolalysenko.github.io/draw-billboard/)

Install
=======

    npm install draw-billboard
    
API
===

### `require("draw-billboard")(gl, position[, options])`
Draws a billboard at the given position.

* `gl` is a WebGL context
* `positions` is the position of the billboarded sprite
* `options` is an object containing the following properties:
    + `texture` A WebGL texture object
    + `lo` Lower texture coordinate
    + `hi` Upper texture coordiante
    + `width` Width of billboard to draw
    + `height` Height of billboard to draw
    + `model` Model matrix for billboard
    + `view` View matrix for billboard
    + `projection` Projection matrix for billboard
    
# Credits
(c) 2013 Mikola Lysenko. MIT License