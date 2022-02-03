import {Material} from "./Material.js";
import {Shader} from "../../Core/Shader.js";
import {ShaderType} from "../../Utils/ShaderType.js";

let gl;
class PhongMaterial extends Material{
    #colorMap;

    constructor(glContext, color, colorMapPath) {
        super(glContext, new Shader(glContext, ShaderType.Phong), color);
        gl = glContext;
        this.#colorMap = gl.createTexture();
        this.loadTexture(this.#colorMap, colorMapPath);
    }

    get ColorMap(){
        return this.#colorMap;
    }
}

export {PhongMaterial};