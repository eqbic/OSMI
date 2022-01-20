import {ModelBase} from "./ModelBase.js";
import {ObjMesh} from "../Meshes/ObjMesh.js";

class FileModel extends ModelBase{
    constructor(gl, path, material) {
        super(gl, new ObjMesh(gl, path), material);
    }
}

export {FileModel};