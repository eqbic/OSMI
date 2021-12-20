class Scene{
    #camera;
    #meshes;
    #lights;

    constructor(){
        const resolution = [gl.canvas.clientWidth, gl.canvas.clientHeight];
        this.#camera = new Camera(resolution, 45, 0.1, 100, [0, 2, 7], [0, 2, 0]);
        this.#meshes = [];
        this.#lights = [];

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    }

    get camera(){
        return this.#camera;
    }

    get lights(){
        return this.#lights;
    }

    get Meshes(){
        return this.#meshes;
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

            shader.setMat4("uProjection", this.#camera.projection);
            shader.setMat4("uView", this.#camera.inverseView);
            shader.setVec3("ambientColor", [0.1, 0.2, 0.3]);
            shader.setInt("NumberLights", this.#lights.length);
            shader.setMat4("uWorld", mesh.Transformation);

            mesh.draw();
        })
    }

    #clear(){
        gl.clearColor(0.1, 0.2, 0.3, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
    }
}