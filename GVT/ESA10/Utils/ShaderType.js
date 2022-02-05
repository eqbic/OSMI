class ShaderType {

    constructor() {}

    static Phong = ["Graphics/Shaders/Phong.vs", "Graphics/Shaders/Phong.fs"];
    static PBR = ["Graphics/Shaders/PBR.vs", "Graphics/Shaders/PBR.fs"];
    static Noise = ["Graphics/Shaders/Noise.vs", "Graphics/Shaders/Noise.fs"];
    static Constant = ["Graphics/Shaders/Constant.vs", "Graphics/Shaders/Constant.fs"];
}

export {ShaderType};