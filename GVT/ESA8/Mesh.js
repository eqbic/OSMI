class Mesh{
    _vao;
    _vaoLines;
    _vbo;
    _indexBuffer;
    _lineBuffer;

    _indices;
    _lineIndices;
    

    _solidColor;
    _lineColor;
    _transformation;

    constructor(solidColor, lineColor){
        this._solidColor = solidColor;
        this._lineColor = lineColor;
        this._transformation = mat4.create();
    }

    get transformation(){
        return this._transformation;
    }

    translate(direction){
        mat4.translate(this._transformation, this._transformation, direction);
    }

    resetTransform(){
        this._transformation = mat4.create();
    }

    rotate(rotation){
        let quaternion = quat.create();
        let rot = mat4.create();
        quat.fromEuler(quaternion, rotation[0], rotation[1], rotation[2]);
        mat4.fromQuat(rot, quaternion);
        mat4.multiply(this._transformation, this._transformation, rot);
    }

    scale(scale){
        mat4.scale(this._transformation, this._transformation, scale);
    }
    
    uniformScale(uniformScale){
       this.scale([uniformScale, uniformScale, uniformScale]);
    }

    transform(scale, rotation, translation){
        this.scale(scale);
        this.rotate(rotation);
        this.translate(translation);
    }

    setPosition(position){
        let translation = mat4.create();
        translation[12] = position[0];
        translation[13] = position[1];
        translation[14] = position[2];
        mat4.multiply(this._transformation, this._transformation, translation);
    }

    setupMesh(vertices, indices, lineIndices){
        
        this._indices = indices;
        this._lineIndices = lineIndices;

        this._vao = gl.createVertexArray();
        this._vaoLines = gl.createVertexArray();
        this._vbo = gl.createBuffer();
        this._indexBuffer = gl.createBuffer();
        this._lineBuffer = gl.createBuffer();


        // 3 x 4bytes for position, 4 x 4bytes for normal
        const bytesPerVertex = 28;

        const buffer = new ArrayBuffer(bytesPerVertex * vertices.length);
        const dataView = new DataView(buffer);

        for(let i = 0; i < this._vertices.length; i++){
            dataView.setFloat32(bytesPerVertex * i,vertices[i].position[0], true);
            dataView.setFloat32(bytesPerVertex * i + 4, vertices[i].position[1], true);
            dataView.setFloat32(bytesPerVertex * i + 8, vertices[i].position[2], true);


            dataView.setFloat32(bytesPerVertex * i + 12, vertices[i].normal[0], true);
            dataView.setFloat32(bytesPerVertex * i + 16, vertices[i].normal[1], true);
            dataView.setFloat32(bytesPerVertex * i + 20, vertices[i].normal[2], true);
            dataView.setFloat32(bytesPerVertex * i + 24, vertices[i].normal[3], true);

        }

        // Solid
        gl.bindVertexArray(this._vao);
 
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
        gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indices, gl.STATIC_DRAW);

        // vertex positions
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, bytesPerVertex, 0);
        gl.enableVertexAttribArray(0);
        
        // vertex normals
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, bytesPerVertex, 12);
        

        gl.bindVertexArray(null);
        
        // Wireframe
        gl.bindVertexArray(this._vaoLines);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
        gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._lineBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._lineIndices, gl.STATIC_DRAW);

        // vertex positions
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, bytesPerVertex, 0);

        // vertex normals
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, bytesPerVertex, 12);

        gl.bindVertexArray(null);
    }

    draw(shaderProgram){
        const uColor = gl.getUniformLocation(shaderProgram, "color");
        gl.uniform4fv(uColor, this._solidColor);
        gl.bindVertexArray(this._vao);
        gl.drawElements(gl.TRIANGLES, this._indices.length, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }

    drawWireframe(shaderProgram){
        gl.useProgram(shaderProgram);
        const uColor = gl.getUniformLocation(shaderProgram, "color");
        gl.uniform4fv(uColor, this._lineColor);
        gl.bindVertexArray(this._vaoLines);
        gl.drawElements(gl.LINES, this._lineIndices.length, gl.UNSIGNED_SHORT,0);
        gl.bindVertexArray(null);
    }
}