#version 300 es
precision highp float;


in vec4 Normal;
in vec3 VertexWorldPosition;

out vec4 FragColor;

struct PointLight
{
    vec3 position;
    vec3 color;
    float strength;
};
#define MAX_NR_LIGHTS 20
uniform int NumberLights;
uniform PointLight pointLights[MAX_NR_LIGHTS];


uniform vec3 ambientColor;



vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos)
{
    vec3 lightDir = normalize(light.position - fragPos);
    float diff = dot(normal, lightDir);
    vec3 diffuse = vec3(0);
    if(diff > 0.95){
        diffuse = light.color * light.strength;
    }
    else if(diff > 0.75){
        diffuse = light.color * light.strength * 0.75;
    }
    else if(diff > 0.5){
        diffuse = light.color * light.strength * 0.5;
    }
    else if(diff > 0.25){
        diffuse = light.color * light.strength * 0.25;
    }
    return diffuse;
}


void main(){

        vec3 result = ambientColor;
        float intensity = 0.0;
        vec3 normal = normalize(Normal.xyz);
        for(int i = 0; i < NumberLights; i++)
        {
            result += CalcPointLight(pointLights[i], normal, VertexWorldPosition);
        }

        FragColor = vec4(result, 1.0);
}

