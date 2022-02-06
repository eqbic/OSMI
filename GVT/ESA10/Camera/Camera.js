import {Entity} from "../Core/Entity.js";

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

class Camera extends Entity{
    #FOV;
    #zNear;
    #zFar;
    #position;
    #target;
    #aspectRatio;

    #projectionMatrix;
    #viewMatrix;


    constructor(resolution, FOV, zNear, zFar, position, target){
        super();
        this.#aspectRatio = resolution[0] / resolution[1];
        this.#FOV = FOV * Math.PI / 180.0;
        this.#zNear = zNear;
        this.#zFar = zFar;
        this.Position = position;

        this.#projectionMatrix = mat4.create();
        mat4.perspective(this.#projectionMatrix, this.#FOV, this.#aspectRatio, this.#zNear, this.#zFar);

    }

    reset(){
       this.resetTransform();
       this.Position = [0,0,10];
    }

    get Projection(){
        return this.#projectionMatrix;
    }

    get View(){
        return this.Transformation;
    }

    get InverseView(){
        let inverse = mat4.create();
        mat4.invert(inverse, this.Transformation);
        return inverse;
    }

    get AspectRatio(){
        return this.#aspectRatio;
    }

    set Target(target){
        this.#target = target;
    }
}

export {Camera};