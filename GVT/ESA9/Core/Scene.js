import {Camera} from "../Camera/Camera.js";
let gl;
class Scene{
    #camera;
    #models;
    #lights;
    #ambientColor;

    constructor(glContext, ambientColor){

        gl = glContext;
        const resolution = [gl.canvas.clientWidth, gl.canvas.clientHeight];
        this.#camera = new Camera(resolution, 45, 0.1, 100, [3, 2, 3], [0, 0, 0]);
        this.#models = [];
        this.#lights = [];
        this.#ambientColor = ambientColor;



    }

    get Lights(){
        return this.#lights;
    }
    get Meshes(){
        return this.#models;
    }

    get Camera() {
        return this.#camera;
    }

    get AmbientColor(){
        return this.#ambientColor;
    }

    addModel(model){
        this.#models.push(model);
    }

    addLight(light){
        this.#lights.push(light);
    }

    draw(){
        this.#clear();
        this.#models.forEach(model => {
            model.draw(this);
        })
    }

    #clear(){
        gl.clearColor(this.#ambientColor[0], this.#ambientColor[1], this.#ambientColor[2], 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
    }
}

export {Scene};