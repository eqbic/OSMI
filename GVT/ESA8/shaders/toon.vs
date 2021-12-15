#version 300 es

layout (location = 0) in vec4 aVertexPosition;
layout (location = 1) in vec4 aNormal;

uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uWorld;

out vec4 Normal;
out vec3 VertexWorldPosition;

void main(){
    gl_Position = uProjection * uView * uWorld * aVertexPosition;
    VertexWorldPosition = vec3(uWorld * aVertexPosition);
    Normal = aNormal;
}