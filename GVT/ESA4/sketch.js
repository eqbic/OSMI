var cubeRotation = 0.0;

function getShaderSource(url) {
    let req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send();
    return (req.status == 200) ? req.responseText : null;
};

function main() {
    const canvas = document.getElementById('glCanvas');
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext('webgl');
    const vertexShaderSource = getShaderSource('shaders/vertex.shader');
    const fragmentShaderSource = getShaderSource('shaders/fragment.shader');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }


    var shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
    gl.bindAttribLocation(shaderProgram, 0, "aVertexPosition");
    gl.bindAttribLocation(shaderProgram, 1, "aVertexColor");
    gl.useProgram(shaderProgram);
    
    drawScene(gl, shaderProgram);
}

function drawScene(gl, shaderProgram) {

    const mat4 = glMatrix.mat4;
    gl.clearColor(0.0, 0.3, 0.4, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Camera
    const FOV = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, FOV, aspect, zNear, zFar);

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -3.0]);

    mat4.rotate(modelViewMatrix,  // destination matrix
        modelViewMatrix,  // matrix to rotate
        45 * Math.PI / 180,     // amount to rotate in radians
        [1, 0, 0]);       // axis to rotate around (Z)
    
    var resolution = 150;
    var buffers = generateTorus(gl, resolution);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    var posAttrib = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.vertexAttribPointer(posAttrib,3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);
    
    gl.useProgram(shaderProgram);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    var colAttrib = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.vertexAttribPointer(colAttrib, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colAttrib);
    // gl.vertexAttrib4f(colAttrib, 1.0, 0.0, 1.0,1.0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);


    var projMat = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    gl.uniformMatrix4fv(projMat, false, projectionMatrix);
    
    var viewMat = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    gl.uniformMatrix4fv(viewMat, false, modelViewMatrix);

    
    var numberQuads = (resolution - 1 ) * (resolution - 1); 
    var numberTrisPerQuad = 2;
    var numberVerticesPerTri = 3;
    var offset = 0;
    var vertexCount = numberVerticesPerTri * numberTrisPerQuad * numberQuads;
    var type = gl.UNSIGNED_SHORT;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    
    gl.disableVertexAttribArray(colAttrib);
    gl.vertexAttrib4f(colAttrib, 1.0, 1.0, 1.0, 1.0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.lineIndices);
    gl.drawElements(gl.LINES, (4 * (resolution -1) * (resolution -1 ) + 2 * resolution), type, offset);



    resolution = 50;
    buffers = generateWave(gl, resolution);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    var posAttrib = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.vertexAttribPointer(posAttrib,3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);
    
    gl.useProgram(shaderProgram);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    var colAttrib = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.vertexAttribPointer(colAttrib, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colAttrib);
    // gl.vertexAttrib4f(colAttrib, 1.0, 0.0, 1.0,1.0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);


    var projMat = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    gl.uniformMatrix4fv(projMat, false, projectionMatrix);
    
    var viewMat = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    gl.uniformMatrix4fv(viewMat, false, modelViewMatrix);

    
    numberQuads = (resolution - 1 ) * (resolution - 1); 
    numberTrisPerQuad = 2;
    numberVerticesPerTri = 3;
    offset = 0;
    vertexCount = numberVerticesPerTri * numberTrisPerQuad * numberQuads;
    type = gl.UNSIGNED_SHORT;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    
    gl.disableVertexAttribArray(colAttrib);
    gl.vertexAttrib4f(colAttrib, 1.0, 1.0, 1.0, 1.0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.lineIndices);
    gl.drawElements(gl.LINES, (4 * (resolution -1) * (resolution -1 ) + 2 * resolution), type, offset);
}

function generateTorus(gl, resolution) {

    const step = 10.0 / resolution;

    let positions = [];
    var v = 0.5 * step - 1.0;

    let r1 = Math.random() * 0.5 + 0.5;
    let r2 = Math.random() * 0.25 + 0.1;
    for (var i = 0, x = 0, z = 0; i < resolution * resolution; i++, x++) {
        if (x == resolution) {
            x = 0;
            z += 1
            v = (z + 0.5) * step - 1.0;
        }
        let u = (x + 0.5) * step - 1.0;
        
        let s = r1 + r2 * Math.cos(Math.PI * v);

        let pos_x = s * Math.sin(Math.PI * u) - 1.2;
        let pos_y = r2 * Math.sin(Math.PI * v);
        let pos_z = s * Math.cos(Math.PI * u);
        
        positions.push(pos_x);
        positions.push(pos_y);
        positions.push(pos_z);
    }
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const colors = [];
    for (var i = 0; i < positions.length / 3; i++) {
        colors.push(positions[3 * i]);
        colors.push(positions[3 * i + 1]);
        colors.push(positions[3 * i + 2]);
        colors.push(1.0);
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    let indices = [];
    for (var i = 0; i < 2 * (resolution - 1) * (resolution - 1); i++) {
        if ((i + 1) % resolution == 0) continue;
        indices.push(i);
        indices.push(i + resolution);
        indices.push(i + resolution + 1);

        indices.push(i);
        indices.push(i + 1);
        indices.push(i + 1 + resolution);
    }

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    let lineIndices = [];

    for (var i = 0; i < 2 * (resolution - 1) * (resolution - 1); i++) {
        if ((i + 1) % resolution == 0) 
        {
            lineIndices.push(i);
            lineIndices.push(i + resolution);
            continue
        };
        lineIndices.push(i);
        lineIndices.push(i+1);
        lineIndices.push(i);
        lineIndices.push(i+resolution);
    }
    const lineBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,lineBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lineIndices), gl.STATIC_DRAW);


    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
        lineIndices: lineBuffer
    };
}

function generateWave(gl, resolution) {

    const step = 2.0 / resolution;

    let positions = [];
    let t = 4 * Math.random();
    for (var i = 0, x = 0, z = 0; i < resolution * resolution; i++, x++) {
        if (x == resolution) {
            x = 0;
            z += 1
        }

        let pos_x = (x + 0.5) * step - 1.0 + 1.0;
        let pos_z = (z + 0.5) * step - 1.0;
        let pos_y = Math.sin(Math.PI * (pos_x + 0.5 * t));
        pos_y += 0.5 * Math.sin(2.0 * Math.PI * (pos_z + t));
        pos_y *= 0.3;
        
        positions.push(pos_x);
        positions.push(pos_y);
        positions.push(pos_z);
    }
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const colors = [];
    for (var i = 0; i < positions.length / 3; i++) {
        colors.push(positions[3 * i]);
        colors.push(positions[3 * i + 1]);
        colors.push(positions[3 * i + 2]);
        colors.push(1.0);
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    let indices = [];
    for (var i = 0; i < 2 * (resolution - 1) * (resolution - 1); i++) {
        if ((i + 1) % resolution == 0) continue;
        
        indices.push(i);
        indices.push(i + resolution);
        indices.push(i + resolution + 1);

        indices.push(i);
        indices.push(i + 1);
        indices.push(i + 1 + resolution);
    }

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    let lineIndices = [];

    for (var i = 0; i < 2 * (resolution - 1) * (resolution - 1); i++) {
        if ((i + 1) % resolution == 0) 
        {
            lineIndices.push(i);
            lineIndices.push(i + resolution);
            continue
        };
        lineIndices.push(i);
        lineIndices.push(i+1);
        lineIndices.push(i);
        lineIndices.push(i+resolution);
    }
    const lineBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,lineBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lineIndices), gl.STATIC_DRAW);


    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
        lineIndices: lineBuffer
    };
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

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

function loadShader(gl, type, source) {
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

window.onload = main;