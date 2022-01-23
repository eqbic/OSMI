const shaderPath = "../Graphics/Shaders/";
class Shaders{

    constructor() {}

    static Phong = [shaderPath + "Phong.vs", shaderPath + "Phong.fs"];
    static PBR = [shaderPath + "PBR.vs", shaderPath + "PBR.fs"];
}

export {Shaders};