attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec4 color;

varying lowp vec4 vColor;

void main() {
    gl_PointSize = 5.0;
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = color;
}