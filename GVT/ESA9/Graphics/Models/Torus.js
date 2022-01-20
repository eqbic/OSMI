import {ModelBase} from "./ModelBase.js";
import {TorusMesh} from "../Meshes/TorusMesh.js";

class Torus extends ModelBase{
    constructor(gl, resolution_n, resolution_m, material) {
        super(gl, new TorusMesh(gl,resolution_n, resolution_m), material);
    }
}
export {Torus};