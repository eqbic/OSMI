#version 300 es
precision highp float;


in vec3 VertexWorldPosition;
in vec4 Normal;
in vec2 TexCoord;

out vec4 FragColor;

struct Light
{
    int type;
    vec3 position;
    vec3 color;
    float strength;
};

#define MAX_NR_LIGHTS 20

uniform int numberLights;
uniform Light lights[MAX_NR_LIGHTS];
uniform vec3 objectColor;
uniform vec3 ambientColor;
uniform vec3 viewPosition;

uniform sampler2D u_texture;

vec3 CalcLight(Light light, vec3 normal, vec3 fragPos, vec3 lightDir)
{
    float specularStrength = light.strength;
    vec3 viewDir = normalize(viewPosition - fragPos);
    vec3 reflectDir = reflect(-lightDir, normal);
    float diff = dot(normal, lightDir);
    vec3 diffuse  = light.color  * diff * light.strength;

    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 256.0);
    vec3 specular = specularStrength * spec * light.color;
    vec3 result = diffuse + specular;

    return result;
}

vec3 GetPointLightDir(Light light, vec3 fragPos){
    return normalize(light.position - fragPos);
}

vec3 GetDirectionalLightDir(Light light){
    return normalize(light.position);
}

void main(){

        vec3 result = ambientColor;
        vec3 normal = normalize(Normal.xyz);
        vec3 lightDir = vec3(0);
        Light light;
        for(int i = 0; i < numberLights; i++)
        {
            light = lights[i];
            if(light.type == 0){
                lightDir = GetPointLightDir(light, VertexWorldPosition);
            }else if(light.type == 1){
                lightDir = GetDirectionalLightDir(light);
            }

            result += CalcLight(light, normal, VertexWorldPosition, lightDir);
        }

        result = result * objectColor * texture(u_texture, TexCoord).rgb;
        FragColor = vec4(result, 1.0);
}

