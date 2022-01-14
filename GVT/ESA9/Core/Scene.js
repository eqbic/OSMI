import {Camera} from "../Camera/Camera.js";
let gl;
class Scene{
    #camera;
    #meshes;
    #lights;
    #ambientColor;

    constructor(glContext, ambientColor){
        gl = glContext;
        const resolution = [gl.canvas.clientWidth, gl.canvas.clientHeight];
        this.#camera = new Camera(resolution, 45, 0.1, 100, [0, 2, 7], [0, 0, 0]);
        this.#meshes = [];
        this.#lights = [];
        this.#ambientColor = ambientColor;

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    }

    get Lights(){
        return this.#lights;
    }
    get Meshes(){
        return this.#meshes;
    }

    get Camera() {
        return this.#camera;
    }

    addMesh(mesh){
        this.#meshes.push(mesh);
    }

    addLight(light){
        this.#lights.push(light);
    }

    draw(){
        this.#clear();
        this.#meshes.forEach(mesh => {
            const shader = mesh.Shader;
            shader.use();

            this.#lights.forEach((light, index) => {
                shader.setVec3(`pointLights[${index}].position`, light.Position);
                shader.setVec3(`pointLights[${index}].color`, light.Color);
                shader.setFloat(`pointLights[${index}].strength`, light.Strength);
            });

            shader.setMat4("uProjection", this.#camera.Projection);
            shader.setMat4("uView", this.#camera.InverseView);
            shader.setVec4("objectColor", mesh.Color);
            shader.setVec3("ambientColor", this.#ambientColor);
            shader.setInt("NumberLights", this.#lights.length);
            shader.setMat4("uWorld", mesh.Transformation);
            shader.setVec3("viewPosition", this.#camera.Position);

            mesh.draw();
        })
    }

    #clear(){
        gl.clearColor(this.#ambientColor[0], this.#ambientColor[1], this.#ambientColor[2], 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
    }
}

export {Scene};