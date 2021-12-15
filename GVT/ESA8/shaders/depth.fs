#version 300 es
precision highp float;

in vec4 vertexColor;

out vec4 outColor;


void main(){
    float depth = (1.0f - gl_FragCoord.w);
    outColor = vec4(depth, depth, depth, 1.0);
}