#version 300 es
precision highp float;

in vec3 VertexWorldPosition;
in vec3 Normal;
in vec2 TexCoord;

out vec4 FragColor;

uniform vec3 objectColor;

void main(){
        FragColor = vec4(objectColor, 1.0);
}

