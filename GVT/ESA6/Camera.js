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

    zoom(amount){
        this.move([0,0,-amount]);
        
    }

    move(direction){
        mat4.translate(this.#viewMatrix, this.#viewMatrix, direction);
        mat4.getTranslation(this.#position, this.#viewMatrix);
        mat4.targetTo(this.#viewMatrix, this.#position, this.#target, [0.0, 1.0, 0.0]);
    }

    moveAlongCircle(angle) {
        let angle_rad = angle * Math.PI / 180;
        let destination = vec3.create();
        vec3.rotateY(destination, this.#position, [0.0, 0.0, 0.0], angle_rad);
        
        let direction = vec3.create();
        vec3.sub(direction, destination, this.#position);
        
        this.#viewMatrix[12] += direction[0];
        this.#viewMatrix[13] += direction[1];
        this.#viewMatrix[14] += direction[2];
        mat4.getTranslation(this.#position, this.#viewMatrix);
        mat4.targetTo(this.#viewMatrix, this.#position, this.#target, [0.0, 1.0, 0.0]);
    }
}