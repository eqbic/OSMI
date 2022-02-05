import {Material} from "./Material.js";
import {Shader} from "../../Core/Shader.js";
import {ShaderType} from "../../Utils/ShaderType.js";

let gl

class ConstantMaterial extends Material{
    constructor(glContext, color) {
        super(glContext, new Shader(glContext, ShaderType.Constant), color);
    }
}

export {ConstantMaterial};