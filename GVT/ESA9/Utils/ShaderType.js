const shaderPath = "../Graphics/Shaders/";
class ShaderType {

    constructor() {}

    static Phong = [shaderPath + "Phong.vs", shaderPath + "Phong.fs"];
    static PBR = [shaderPath + "PBR.vs", shaderPath + "PBR.fs"];
    static Noise = [shaderPath + "Noise.vs", shaderPath + "Noise.fs"];
}

export {ShaderType};