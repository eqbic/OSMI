#version 300 es

layout (location = 0) in vec4 aVertexPosition;
layout (location = 1) in vec4 aNormal;

uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uWorld;


void main() {
    gl_PointSize = 10.0;
    gl_Position = uProjection * uView * uWorld * aVertexPosition;
}