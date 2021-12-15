class Scene{
    #camera;
    #meshes;
    #lights;

    constructor(){
        const resolution = [gl.canvas.clientWidth, gl.canvas.clientHeight];
        this.#camera = new Camera(resolution, 45, 0.1, 100, [0, 2, 5], [0, 2, 0]);
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

    addMesh(mesh){
        this.#meshes.push(mesh);
    }

    addLight(light){
        this.#lights.push(light);
    }

    drawSolid(solidShader){
        this.#clear();
        gl.useProgram(solidShader);
        const projMat = gl.getUniformLocation(solidShader, "uProjection");
        const viewMat = gl.getUniformLocation(solidShader, "uView");
        const modelTransform = gl.getUniformLocation(solidShader, "uWorld");
        gl.uniformMatrix4fv(projMat, false, this.#camera.projection);
        gl.uniformMatrix4fv(viewMat, false, this.#camera.inverseView);

        const ambient = gl.getUniformLocation(solidShader, "ambientColor");
        gl.uniform3fv(ambient, [0.1, 0.2, 0.3]);

        const numberLights = gl.getUniformLocation(solidShader, "NumberLights");
        gl.uniform1i(numberLights, this.#lights.length);

        this.#lights.forEach((light, index) => {

            let position = gl.getUniformLocation(solidShader, `pointLights[${index}].position`);
            let color = gl.getUniformLocation(solidShader, `pointLights[${index}].color`);
            let strength = gl.getUniformLocation(solidShader, `pointLights[${index}].strength`);

            gl.uniform3fv(position, light.Position);
            gl.uniform3fv(color, light.Color);
            gl.uniform1f(strength, light.Strength);
        });


        this.#meshes.forEach(mesh => {
            gl.uniformMatrix4fv(modelTransform, false, mesh.transformation);
            mesh.draw(solidShader);
        })
    }

    drawWireframe(wireframeShader){
        gl.useProgram(wireframeShader);
        const projMat = gl.getUniformLocation(wireframeShader, "uProjection");
        const viewMat = gl.getUniformLocation(wireframeShader, "uView");
        const modelTransform = gl.getUniformLocation(wireframeShader, "uWorld");
        gl.uniformMatrix4fv(projMat, false, this.#camera.projection);
        gl.uniformMatrix4fv(viewMat, false, this.#camera.inverseView);
        this.#meshes.forEach(mesh => {
            gl.uniformMatrix4fv(modelTransform, false, mesh.transformation);
            mesh.drawWireframe(wireframeShader);
            mesh.resetTransform();
        })
    }

    #clear(){
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
    }
}