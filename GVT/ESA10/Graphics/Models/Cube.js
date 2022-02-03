import {ModelBase} from "./ModelBase.js";
import {CubeMesh} from "../Meshes/CubeMesh.js";

class Cube extends ModelBase{
    constructor(gl,material) {
        super(new CubeMesh(gl), material);
    }
}

export {Cube};