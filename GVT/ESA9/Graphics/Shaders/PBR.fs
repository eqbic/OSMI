#version 300 es
precision highp float;

out vec4 FragColor;
in vec2 TexCoord;
in vec3 VertexWorldPosition;
in vec3 Normal;

uniform vec3 viewPosition;
uniform sampler2D u_ColorMap;
uniform sampler2D u_MetalMap;
uniform sampler2D u_RoughnessMap;
uniform sampler2D u_NormalMap;

uniform vec3 objectColor;
uniform vec3 ambientColor;


vec3 albedo = vec3(1.0, 0.0, 0.0);
float metallic = 0.0;
float roughness = 1.0;
float ao = 1.0;
vec3 texNormal = vec3(0);

const float PI = 3.14159265359;

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


float DistributionGGX(vec3 N, vec3 H, float roughness);
float GeometrySchlickGGX(float NdotV, float roughness);
float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness);
vec3 fresnelSchlick(float cosTheta, vec3 F0);
vec3 GetPointLightDir(Light light, vec3 fragPos);
vec3 GetDirectionalLightDir(Light light);

void main()
{
    albedo = texture(u_ColorMap, TexCoord).rgb * objectColor;
    metallic = texture(u_MetalMap, TexCoord).b;
    roughness = texture(u_RoughnessMap, TexCoord).r;
    texNormal = texture(u_NormalMap, TexCoord).rgb;
    vec3 N = normalize(Normal);
    vec3 V = normalize(viewPosition - VertexWorldPosition);

    vec3 F0 = vec3(0.04);
    F0 = mix(F0, albedo, metallic);

    // reflectance equation
    vec3 Lo = vec3(0.0);

    Light light;
    for(int i = 0; i < numberLights; ++i)
    {
        light = lights[i];
        // calculate per-light radiance
        vec3 L = vec3(0);
        float distance = 0.0;
        if(light.type == 0){
            L = GetPointLightDir(light, VertexWorldPosition);
            distance = length(L);
        }else if(light.type == 1){
            L = GetDirectionalLightDir(light);
            distance = 1.0;
        }

        vec3 H = normalize(V + L);
        float attenuation = light.strength / (distance * distance);
        vec3 radiance     = light.color * attenuation;

        // cook-torrance brdf
        float NDF = DistributionGGX(N, H, roughness);
        float G   = GeometrySmith(N, V, L, roughness);
        vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);

        vec3 kS = F;
        vec3 kD = vec3(1.0) - kS;
        kD *= 1.0 - metallic;

        vec3 numerator    = NDF * G * F;
        float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.0001;
        vec3 specular     = numerator / denominator;

        // add to outgoing radiance Lo
        float NdotL = max(dot(N, L), 0.0);
        Lo += (kD * albedo / PI + specular) * radiance * NdotL;
    }

    vec3 ambient = ambientColor * albedo * ao;
    vec3 color = ambient + Lo;

    color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0/2.2));


    FragColor = vec4(color, 1.0);
}

vec3 GetPointLightDir(Light light, vec3 fragPos){
    return normalize(light.position - fragPos);
}

vec3 GetDirectionalLightDir(Light light){
    return normalize(light.position);
}


float DistributionGGX(vec3 N, vec3 H, float roughness)
{
    float a      = roughness*roughness;
    float a2     = a*a;
    float NdotH  = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;

    float num   = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;

    return num / denom;
}

float GeometrySchlickGGX(float NdotV, float roughness)
{
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;

    float num   = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return num / denom;
}
float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
{
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2  = GeometrySchlickGGX(NdotV, roughness);
    float ggx1  = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}

vec3 fresnelSchlick(float cosTheta, vec3 F0)
{
    return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}