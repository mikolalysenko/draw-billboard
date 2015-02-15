"use strict"

var createShader = require("gl-shader")
var createMesh = require("gl-mesh")
var mat4 = require("gl-mat4")

function createBillboardMesh(gl) {
  var mesh = createMesh(gl, [[1,0,2], [1,2,3]], {
    "uv": [[-1,-1], [-1,1], [1,-1], [1,1]]
  })
  gl.__BILLBOARD_MESH = mesh
  return mesh
}

function createBillboardShader(gl) {
  var shader = createShader(gl,
  "attribute vec2 uv;\
  uniform vec3 position;\
  uniform mat4 model;\
  uniform mat4 view;\
  uniform mat4 projection;\
  uniform vec2 lo;\
  uniform vec2 hi;\
  uniform float width;\
  uniform float height;\
  varying vec2 tc;\
  void main() {\
    vec4 mposition = vec4(uv.x * width, uv.y * height, 0.0, 0.0) + view * model * vec4(position, 1.0);\
    gl_Position = projection * mposition;\
    tc = (0.5 * vec2(1.0+uv.x,1.0-uv.y) - lo) * (hi - lo);\
  }",
  "precision highp float;\
  uniform sampler2D texture;\
  varying vec2 tc;\
  void main() {\
    gl_FragColor = texture2D(texture, tc);\
  }")
  gl.__BILLBOARD_SHADER = shader
  return shader
}

function drawBillboard(gl, position, options) {
  position = position || [0,0,0]
  options = options || {}
  
  var texture = options.texture || 0
  var lo = options.lo || [0,0]
  var hi = options.hi || [1,1]
  var width = options.width || 1.0
  var height = options.height || 1.0
  var model = options.model || mat4.identity(mat4.create())
  var view = options.view || mat4.identity(mat4.create())
  var projection = options.projection || mat4.identity(mat4.create())
  
  var shader = gl.__BILLBOARD_SHADER || createBillboardShader(gl)
  var mesh = gl.__BILLBOARD_MESH || createBillboardMesh(gl)
  
  shader.bind()
  shader.uniforms.position = position
  shader.uniforms.lo = lo
  shader.uniforms.hi = hi
  shader.uniforms.width = width
  shader.uniforms.height = height
  shader.uniforms.texture = texture
  shader.uniforms.model = model
  shader.uniforms.view = view
  shader.uniforms.projection = projection
  if(options.texture) {
    shader.uniforms.texture = options.texture.bind(0)
  }
  
  mesh.bind(shader)
  mesh.draw()
  mesh.unbind()
}

module.exports = drawBillboard