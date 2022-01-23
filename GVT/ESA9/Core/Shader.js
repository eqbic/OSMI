let gl;

class Shader {
    #vertexShaderSource;
    #fragmentShaderSource;
    #program;

    constructor(glContext, shaderType) {
        gl = glContext;
        this.#vertexShaderSource = this.getShaderSource(shaderType[0]);
        this.#fragmentShaderSource = this.getShaderSource(shaderType[1]);
        this.#program = this.initShaderProgram(this.#vertexShaderSource, this.#fragmentShaderSource);
    }

    use(){
        gl.useProgram(this.#program);
    }

    setInt(uniformName, value){
        const uniformID = gl.getUniformLocation(this.#program, uniformName);
        gl.uniform1i(uniformID, value);
    }

    setFloat(uniformName, value){
        const uniformID = gl.getUniformLocation(this.#program, uniformName);
        gl.uniform1f(uniformID, value);
    }

    setVec3(uniformName, value){
        const uniformID = gl.getUniformLocation(this.#program, uniformName);
        gl.uniform3fv(uniformID, value);
    }

    setVec4(uniformName, value){
        const uniformID = gl.getUniformLocation(this.#program, uniformName);
        gl.uniform4fv(uniformID, value);
    }

    setMat4(uniformName, value){
        const uniformID = gl.getUniformLocation(this.#program, uniformName);
        gl.uniformMatrix4fv(uniformID, false, value);
    }

    getUniformLocation(uniformName){
        return gl.getUniformLocation(this.#program, uniformName);
    }



    getShaderSource(url) {
        let req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.send();
        return (req.status === 200) ? req.responseText : null;
    };

    loadShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    initShaderProgram(vsSource, fsSource) {
        const vertexShader = this.loadShader(gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }
}

export {Shader};