class Scene{
    #camera;
    #meshes;
    
    constructor(){
        const resolution = [gl.canvas.clientWidth, gl.canvas.clientHeight];
        this.#camera = new Camera(resolution, 45, 0.1, 100, [0, 20, 12], [0, 2, 0]);
        this.#meshes = [];
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    }

    get camera(){
        return this.#camera;
    }

    addMesh(mesh){
        this.#meshes.push(mesh);
    }

    drawSolid(solidShader){
        this.#clear();
        gl.useProgram(solidShader);
        const projMat = gl.getUniformLocation(solidShader, "uProjection");
        const viewMat = gl.getUniformLocation(solidShader, "uView");
        const modelTransform = gl.getUniformLocation(solidShader, "uWorld");
        gl.uniformMatrix4fv(projMat, false, this.#camera.projection);
        gl.uniformMatrix4fv(viewMat, false, this.#camera.inverseView);
        
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
        gl.clearColor(0.2, 0.5, 0.5, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
    }
}