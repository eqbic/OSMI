class Camera {
    #FOV;
    #zNear;
    #zFar;
    #position;
    #target;
    #aspectRatio;

    #projectionMatrix;
    #viewMatrix;

    constructor(resolution, FOV, zNear, zFar, position, target){
        this.#aspectRatio = resolution[0] / resolution[1];
        this.#FOV = FOV * Math.PI / 180.0;
        this.#zNear = zNear;
        this.#zFar = zFar;
        this.#position = position;
        this.#target = target;

        this.#projectionMatrix = mat4.create();
        mat4.perspective(this.#projectionMatrix, this.#FOV, this.#aspectRatio, this.#zNear, this.#zFar);

        this.#viewMatrix = mat4.create();
        mat4.translate(this.#viewMatrix, this.#viewMatrix,this.#position);
        mat4.targetTo(this.#viewMatrix, this.#position, this.#target, [0.0, 1.0, 0.0]);
    }

    get projection(){
        return this.#projectionMatrix;
    }

    get view(){
        return this.#viewMatrix;
    }

    get inverseView(){
        let inverse = mat4.create();
        mat4.invert(inverse, this.#viewMatrix);
        return inverse;
    }
}