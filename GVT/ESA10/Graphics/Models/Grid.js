import {ModelBase} from "./ModelBase.js";
import {GridMesh} from "../Meshes/GridMesh.js";

class Grid extends ModelBase{
    constructor(gl, resolution, material) {
        super(gl, new GridMesh(gl, resolution), material);
    }
}

export {Grid};