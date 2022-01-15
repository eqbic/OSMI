#version 300 es

layout (location = 0) in vec3 aVertexPosition;
layout (location = 1) in vec3 aNormal;
layout (location = 2) in vec2 aTexCoord;

uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uWorld;


out vec3 VertexWorldPosition;
out vec4 Normal;
out vec2 TexCoord;

void main(){
    vec4 vertexPosition = vec4(aVertexPosition, 1.0);
    gl_Position = uProjection * uView * uWorld * vertexPosition;

    VertexWorldPosition = vec3(uWorld * vertexPosition);
    Normal = uWorld * vec4(aNormal, 0.0);
    TexCoord = aTexCoord;
}