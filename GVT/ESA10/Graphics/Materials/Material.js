let gl;
class Material {
    #shader;
    #baseColor;

    constructor(glContext, shader, color) {
        gl = glContext;
        this.#shader = shader;
        this.#baseColor = color;
    }

    loadTexture(texture, path){

        const image = new Image();
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
            gl.generateMipmap(gl.TEXTURE_2D);
        };
        image.src = path;
    }

    get Shader() {
        return this.#shader;
    }

    get BaseColor() {
        return this.#baseColor;
    }
}

export {Material};