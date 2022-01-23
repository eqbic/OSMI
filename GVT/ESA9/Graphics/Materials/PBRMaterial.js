import {Material} from "./Material.js";
import {Shader} from "../../Core/Shader.js";
import {Shaders} from "../../Utils/Shaders.js";

let gl;
class PBRMaterial extends Material{
    #colorMap;
    #metalMap;
    #roughnessMap;

    constructor(glContext, color, colorMapPath, metalMapPath, roughnessMapPath) {
        super(glContext, new Shader(glContext, Shaders.PBR), color);
        gl = glContext;

        this.#colorMap = gl.createTexture();
        this.#metalMap = gl.createTexture();
        this.#roughnessMap = gl.createTexture();

        this.loadTexture(this.#colorMap, colorMapPath);
        this.loadTexture(this.#metalMap, metalMapPath);
        this.loadTexture(this.#roughnessMap, roughnessMapPath);
    }

    get ColorMap() {
        return this.#colorMap;
    }

    get MetalMap(){
        return this.#metalMap;
    }

    get RoughnessMap(){
        return this.#roughnessMap;
    }
}

export {PBRMaterial};