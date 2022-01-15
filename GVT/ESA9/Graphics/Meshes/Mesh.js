import {Entity} from "../../Core/Entity.js";
let gl;
class Mesh extends Entity{
    #vao;
    #vbo;
    #indexBuffer;
    #indices;
    #color;
    #shader;

    constructor(glContext,shader, color){
        super();
        gl = glContext;
        this.#shader = shader;
        this.#color = color;
    }

    get Color(){
        return this.#color;
    }

    get Shader(){
        return this.#shader;
    }

    set Shader(shader){
        this.#shader = shader;
    }

    setupMesh(vertices, indices){
        
        this.#indices = indices;
        this.#vao = gl.createVertexArray();
        this.#vbo = gl.createBuffer();
        this.#indexBuffer = gl.createBuffer();

        // 3 x 4bytes for position, 3 x 4bytes for normal, 2 x 4 bytes for textureCoord;
        const bytesPerVertex = 32;

        const buffer = new ArrayBuffer(bytesPerVertex * vertices.length);
        const dataView = new DataView(buffer);

        for(let i = 0; i < vertices.length; i++){
            // console.log(i);
            dataView.setFloat32(bytesPerVertex * i,vertices[i].Position[0], true);
            dataView.setFloat32(bytesPerVertex * i + 4, vertices[i].Position[1], true);
            dataView.setFloat32(bytesPerVertex * i + 8, vertices[i].Position[2], true);

            dataView.setFloat32(bytesPerVertex * i + 12, vertices[i].Normal[0], true);
            dataView.setFloat32(bytesPerVertex * i + 16, vertices[i].Normal[1], true);
            dataView.setFloat32(bytesPerVertex * i + 20, vertices[i].Normal[2], true);

            dataView.setFloat32(bytesPerVertex * i + 24, vertices[i].TexCoord[0], true);
            dataView.setFloat32(bytesPerVertex * i + 28, vertices[i].TexCoord[1], true);
        }

        gl.bindVertexArray(this.#vao);
 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#vbo);
        gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.#indices, gl.STATIC_DRAW);

        // vertex positions
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, bytesPerVertex, 0);

        // vertex normals
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, bytesPerVertex, 12);

        // vertex texture coordinates
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, bytesPerVertex, 24);
        
        gl.bindVertexArray(null);
    }

    draw(){
        gl.bindVertexArray(this.#vao);
        gl.drawElements(gl.TRIANGLES, this.#indices.length, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }

    drawWireframe(){
        gl.bindVertexArray(this.#vao);
        gl.drawElements(gl.LINES, this.#indices.length, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }

}

export {Mesh};