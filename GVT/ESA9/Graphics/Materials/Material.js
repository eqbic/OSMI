let gl;
class Material{
    #shader;
    #baseColor;
    #colorTexture;
    constructor(glContext, shader, color, texturePath) {
        gl = glContext;
        this.#shader = shader;
        this.#baseColor = color;
        this.#colorTexture = gl.createTexture();
        // gl.bindTexture(gl.TEXTURE_2D, this.#colorTexture);
        //
        // // Fill the texture with a 1x1 blue pixel.
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 255, 0, 255]));

        // Asynchronously load an image
        const image = new Image();
        let _self = this;
        image.onload = function (){
            gl.bindTexture(gl.TEXTURE_2D, _self.#colorTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, this);
            gl.generateMipmap(gl.TEXTURE_2D);
        };
        image.src = texturePath;
    }

    get Shader(){
        return this.#shader;
    }

    get BaseColor(){
        return this.#baseColor;
    }

    get ColorTexture(){
        return this.#colorTexture;
    }
}

export {Material};