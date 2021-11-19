const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

function getShaderSource(url) {
    let req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send();
    return (req.status == 200) ? req.responseText : null;
};

class Camera{
    constructor(gl, FOV, zNear, zFar, radius){
        this.aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this.FOV = FOV * Math.PI / 180.0;
        this.zNear = zNear;
        this.zFar = zFar;
        this.radius = radius;
        this.position = vec3.create();
        this.projectionMatrix = mat4.create();
        mat4.perspective(this.projectionMatrix, this.FOV, this.aspectRatio, this.zNear, this.zFar);

        this.modelViewMatrix = mat4.create();
        this.move([0, 2, radius]);

        this.lookAtPosition([0,0,0]);
    }

    get projection() {
        return this.projectionMatrix;
    }

    get view() {
        return this.modelViewMatrix;
    }

    move(direction){
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, direction);
        vec3.add(this.position, this.position, direction);
    }

    moveAlongCircle(angle){
        let angle_rad = angle * Math.PI / 180;
        let destination = vec3.create();
        vec3.rotateY(destination, this.position, [0.0, 0.0, 0.0], angle_rad);
        let direction = vec3.create();
        vec3.sub(direction, destination, this.position);
        this.move(direction);
    }

    lookAtPosition(target){
        mat4.lookAt(this.modelViewMatrix, this.position, target, [0.0, 1.0, 0.0]);
    }
}

function main() {
    const canvas = document.getElementById('glCanvas');
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext('webgl');
    const vertexShaderSource = getShaderSource('shaders/vertex.shader');
    const fragmentShaderSource = getShaderSource('shaders/fragment.shader');

    const camera = new Camera(gl, 45, 0.1, 100, 3);

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }


    var shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
    gl.bindAttribLocation(shaderProgram, 0, "aVertexPosition");
    gl.bindAttribLocation(shaderProgram, 1, "aVertexColor");
    gl.useProgram(shaderProgram);
    
    drawScene(gl, camera, shaderProgram);
    document.addEventListener('keydown', (e) => {
        if(e.key === "ArrowLeft"){
            camera.moveAlongCircle(-5);
            camera.lookAtPosition([0.0, 0.0, 0.0]);
            drawScene(gl, camera, shaderProgram);
        }

        if(e.key === "ArrowRight"){
            camera.moveAlongCircle(5);
            camera.lookAtPosition([0.0, 0.0, 0.0]);
            drawScene(gl,camera,shaderProgram);
        }
    });
}

function drawScene(gl, camera, shaderProgram) {

    
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var projMat = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    gl.uniformMatrix4fv(projMat, false, camera.projection);
    
    var viewMat = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    gl.uniformMatrix4fv(viewMat, false, camera.view);
    gl.useProgram(shaderProgram);
    

    renderTorus(gl, 200, shaderProgram);
    renderGrid(gl, 20, shaderProgram);
}


function renderTorus(gl, resolution, shaderProgram){
    const buffers = generateTorus(gl, resolution);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    const posAttrib = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.vertexAttribPointer(posAttrib,3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);
    
    
    const numberQuads = (resolution - 1 ) * (resolution - 1); 
    const numberTrisPerQuad = 2;
    const numberVerticesPerTri = 3;
    const offset = 0;
    const vertexCount = numberVerticesPerTri * numberTrisPerQuad * numberQuads;
    const type = gl.UNSIGNED_SHORT;
    
    let color = gl.getUniformLocation(shaderProgram, "color");
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.uniform4fv(color, [0.8, 0.8, 0.8, 1.0]);
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.lineIndices);
    gl.uniform4fv(color, [0.4, 0.4, 0.4, 1.0]);
    gl.drawElements(gl.LINES, (4 * (resolution -1) * (resolution -1 ) + 2 * resolution), type, offset);
}

function renderGrid(gl, resolution, shaderProgram){
    const buffers = generateGrid(gl, resolution, 5, 5);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    const posAttrib = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.vertexAttribPointer(posAttrib,3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);
    
    gl.useProgram(shaderProgram);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    const numberQuads = (resolution - 1 ) * (resolution - 1); 
    const numberTrisPerQuad = 2;
    const numberVerticesPerTri = 3;
    const offset = 0;
    const vertexCount = numberVerticesPerTri * numberTrisPerQuad * numberQuads;
    const type = gl.UNSIGNED_SHORT;
    
    const color = gl.getUniformLocation(shaderProgram, "color");

    gl.uniform4fv(color, [0.9,0.9,0.9,1.0]);
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    
    gl.uniform4fv(color, [0.5,0.5,0.5,1.0]);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.lineIndices);
    gl.drawElements(gl.LINES, (4 * (resolution -1) * (resolution -1 ) + 2 * resolution), type, offset);
}

function generateTorus(gl, resolution) {

    const step = 10.0 / resolution;

    let positions = [];
    var v = 0.5 * step - 1.0;

    let r1 = 0.75;
    let r2 = 0.25;
    for (var i = 0, x = 0, z = 0; i < resolution * resolution; i++, x++) {
        if (x == resolution) {
            x = 0;
            z += 1
            v = (z + 0.5) * step - 1.0;
        }
        let u = (x + 0.5) * step - 1.0;
        
        let s = r1 + r2 * Math.cos(Math.PI * v);

        let pos_x = s * Math.sin(Math.PI * u);
        let pos_y = r2 * Math.sin(Math.PI * v) + 0.5;
        let pos_z = s * Math.cos(Math.PI * u);
        
        positions.push(pos_x);
        positions.push(pos_y);
        positions.push(pos_z);
    }
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

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
        indices: indexBuffer,
        lineIndices: lineBuffer
    };
}

function generateGrid(gl, resolution, width, height) {

    const step = 2.0 / resolution;

    let positions = [];
    for (var i = 0, x = 0, z = 0; i < resolution * resolution; i++, x++) {
        if (x == resolution) {
            x = 0;
            z += 1
        }

        let pos_x = width * ((x + 0.5) * step - 1.0);
        let pos_z = height * ((z + 0.5) * step - 1.0);
        let pos_y = 0.0;
        
        positions.push(pos_x);
        positions.push(pos_y);
        positions.push(pos_z);
    }
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

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