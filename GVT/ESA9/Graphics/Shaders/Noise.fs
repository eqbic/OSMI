#version 300 es
precision highp float;


in vec3 VertexWorldPosition;
in vec3 Normal;
in vec2 TexCoord;

out vec4 FragColor;

uniform vec3 objectColor;
uniform float u_time;

float random (in vec2 st);
float noise (in vec2 st);

void main(){
        float scale = 5.0;
        // Use the noise function
        float r = noise(scale * VertexWorldPosition.xy + vec2(u_time));
        float g = noise(scale * VertexWorldPosition.xz + vec2(u_time));
        float b = noise(scale * VertexWorldPosition.yz + vec2(u_time));

        vec3 result = vec3(r, g, b);
        FragColor = vec4(result, 1.0);
}

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

