import {ModelBase} from "./ModelBase.js";
import {SphereMesh} from "../Meshes/SphereMesh.js";

class Sphere extends ModelBase{
    constructor(gl, resolution, material) {
        super(gl, new SphereMesh(gl, resolution), material);
    }
}
export {Sphere};