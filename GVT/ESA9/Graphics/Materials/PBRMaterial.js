import {Material} from "./Material.js";
import {Shader} from "../../Core/Shader.js";
import {Shaders} from "../../Utils/Shaders.js";

let gl;
class PBRMaterial extends Material{
    #colorMap;
    #metalMap;
    #roughnessMap;
    #normalMap;

    constructor(glContext, color, colorMapPath, metalMapPath, roughnessMapPath, normalMapPath) {
        super(glContext, new Shader(glContext, Shaders.PBR), color);
        gl = glContext;

        this.#colorMap = gl.createTexture();
        this.#metalMap = gl.createTexture();
        this.#roughnessMap = gl.createTexture();
        this.#normalMap = gl.createTexture();

        this.loadTexture(this.#colorMap, colorMapPath);
        this.loadTexture(this.#metalMap, metalMapPath);
        this.loadTexture(this.#roughnessMap, roughnessMapPath);
        this.loadTexture(this.#normalMap, normalMapPath);
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

    get NormalMap(){
        return this.#normalMap;
    }
}

export {PBRMaterial};