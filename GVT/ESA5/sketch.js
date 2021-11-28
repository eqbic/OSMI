const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;
const canvas = document.getElementById('glCanvas');
/** @type {WebGLRenderingContext} */
const gl = canvas.getContext('webgl');

function getShaderSource(url) {
    let req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send();
    return (req.status == 200) ? req.responseText : null;
};


class Mesh {
    constructor() {
        this._vertices = [];
        this._indices = [];
        this._lineIndices = [];
        this._faces = [];
        this._positionBuffer = gl.createBuffer();
        this._indexBuffer = gl.createBuffer();
        this._lineBuffer = gl.createBuffer();
        this._normalBuffer = gl.createBuffer();
    }
    
    draw(shaderProgram, solidColor, lineColor) {
        
    }
    
    setup() { }
}

class Torus extends Mesh {
    constructor(resolution, outerRadius, innerRadius) {
        super();
        this._resolution = resolution;
        this._outerRadius = outerRadius;
        this._innerRadius = innerRadius;
        this.setup();
    }
    
    setup() {
        console.log("TORUS SETUP");
        const step = 10.0 / this._resolution;
        let v = 0.5 * step - 1.0;
        let u, s, pos_x, pos_y, pos_z;
        let positions = [];
        let position = vec3.create();
        for (var i = 0, x = 0, z = 0; i < this._resolution * this._resolution; i++, x++) {
            if (x === this._resolution) {
                x = 0;
                z += 1;
                v = (z + 0.5) * step - 1.0;
            }
            u = (x + 0.5) * step - 1.0;
            s = this._outerRadius + this._innerRadius * Math.cos(Math.PI * v);
            pos_x = s * Math.sin(Math.PI * u) - 1;
            pos_y = this._innerRadius * Math.sin(Math.PI * v) + 0.5;
            pos_z = s * Math.cos(Math.PI * u);
            vec3.set(position, pos_x, pos_y, pos_z);
            this._vertices.push(new Vertex(i, position));
            positions.push(pos_x);
            positions.push(pos_y);
            positions.push(pos_z);
        }
        
        for (var i = 0; i < 2 * (this._resolution - 1) * (this._resolution - 1); i++) {
            if ((i + 1) % this._resolution === 0) continue;
            this._indices.push(i);
            this._indices.push(i + this._resolution);
            this._indices.push(i + this._resolution + 1);
            
            this._indices.push(i);
            this._indices.push(i + 1);
            this._indices.push(i + 1 + this._resolution);
        }
        
        for (var i = 0; i < 2 * (this._resolution - 1) * (this._resolution - 1); i++) {
            if ((i + 1) % this._resolution == 0) {
                this._lineIndices.push(i);
                this._lineIndices.push(i + this._resolution);
                continue;
            };
            this._lineIndices.push(i);
            this._lineIndices.push(i + 1);
            this._lineIndices.push(i);
            this._lineIndices.push(i + this._resolution);
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._lineIndices), gl.STATIC_DRAW);
    }
    
    draw(shaderProgram, solidColor, lineColor) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
        const posAttrib = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posAttrib);
        
        const vertexCount = 3 * 2 * (this._resolution - 1) * (this._resolution - 1);
        const type = gl.UNSIGNED_SHORT;
        const uColor = gl.getUniformLocation(shaderProgram, "color");
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.uniform4fv(uColor, solidColor);
        gl.drawElements(gl.TRIANGLES, vertexCount, type, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.uniform4fv(uColor, lineColor);
        gl.drawElements(gl.LINES, (4 * (this._resolution - 1) * (this._resolution - 1) + 2 * this._resolution), type, 0);
    }
}

class Grid extends Mesh {
    constructor(resolution, width, height) {
        super();
        this._resolution = resolution;
        this._width = width;
        this._height = height;
        this.setup();
    }
    
    setup() {
        console.log("GRID SETUP");
        const step = 2.0 / this._resolution;
        let pos_x, pos_y, pos_z;
        let position = vec3.create();
        let positions = [];
        for (var i = 0, x = 0, z = 0; i < this._resolution * this._resolution; i++, x++) {
            if (x === this._resolution) {
                x = 0;
                z += 1;
            }
            
            pos_x = this._width * ((x + 0.5) * step - 1.0);
            pos_y = 0.0;
            pos_z = this._height * ((z + 0.5) * step - 1.0);
            
            vec3.set(position, pos_x, pos_y, pos_z);
            this._vertices.push(new Vertex(i, position));
            positions.push(pos_x);
            positions.push(pos_y);
            positions.push(pos_z);
        }
        
        for (var i = 0; i < 2 * (this._resolution - 1) * (this._resolution - 1); i++) {
            if ((i + 1) % this._resolution === 0) {
                this._lineIndices.push(i);
                this._lineIndices.push(i + this._resolution);
                continue;
            }
            
            this._indices.push(i);
            this._indices.push(i + this._resolution);
            this._indices.push(i + this._resolution + 1);
            
            this._indices.push(i);
            this._indices.push(i + 1);
            this._indices.push(i + 1 + this._resolution);
            
            this._lineIndices.push(i);
            this._lineIndices.push(i + 1);
            this._lineIndices.push(i);
            this._lineIndices.push(i + this._resolution);
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._lineIndices), gl.STATIC_DRAW);
    }
    
    draw(shaderProgram, solidColor, lineColor) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
        const posAttrib = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posAttrib);
        
        const vertexCount = 3 * 2 * (this._resolution - 1) * (this._resolution - 1);
        const type = gl.UNSIGNED_SHORT;
        const uColor = gl.getUniformLocation(shaderProgram, "color");
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.uniform4fv(uColor, solidColor);
        gl.drawElements(gl.TRIANGLES, vertexCount, type, 0);
        
        gl.uniform4fv(uColor, lineColor);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.drawElements(gl.LINES, (4 * (this._resolution - 1) * (this._resolution - 1) + 2 * this._resolution), type, 0);
    }
}
class Vertex {
    constructor(index, position) {
        this._index = index;
        this._position = position;
        this._normal = vec3.create();
    }

    get position() {
        return this._position;
    }

    get index() {
        return this._index;
    }

    set normal(normal){
        this._normal = normal;
    }
    
    get normal(){
        return this._normal;
    }
}

class Face {
    constructor(index, v0,v1,v2){
        this._index = index;
        this._v0 = v0;
        this._v1 = v1;
        this._v2 = v2;
        this._normal = this.calculateNormal();
    }

    calculateNormal(){
        let normal = vec3.create();
        let edge1 = vec3.create();
        vec3.subtract(edge1, this._v1.position, this._v0.position);
        let edge2 = vec3.create();
        vec3.subtract(edge2, this._v2.position, this._v0.position);
        vec3.cross(normal, edge1, edge2);
        vec3.normalize(normal, normal);
        return normal;
    }

    
}
class Cube extends Mesh {
    constructor(size) {
        super();
        this._size = size;
        this.setup();
    }
    
    setup() {
        console.log("CUBE SETUP");
        

        let positions = [
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
          
            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,
          
            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,
          
            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
          
            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,
          
            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
          ];
          

        for (var i = 0; i < positions.length; i++) {
            positions[i] *= this._size;

            if(i % 3 === 1) positions[i] += 1;
            if(i %3 === 0) positions[i] += 1;
        }

        this._indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
          ];

        for(var i = 0; i < this._indices.length; i+=3){
            let p0 = new Vertex(i, [positions[this._indices[i]], positions[this._indices[i] + 1], positions[this._indices[i] + 2]]);
            let p1 = new Vertex(i + 1, [positions[this._indices[i + 1]], positions[this._indices[i + 1] + 1], positions[this._indices[i + 1] + 2]]);
            let p2 = new Vertex(i + 2, [positions[this._indices[i + 2]], positions[this._indices[i + 2] + 1], positions[this._indices[i + 2] + 2]]);
            let index = i / 3;
            let face = new Face(index, p0, p1, p2);
            this._faces.push(face);
        }

        this._lineIndices = [
            0, 1,
            1, 2,
            2, 3,
            3, 0,
            4, 5,
            5, 6,
            6, 7,
            7, 4,
            0, 4,
            1, 7,
            2, 6,
            3, 5
        ];

        gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._lineIndices), gl.STATIC_DRAW);
    }

    draw(shaderProgram, solidColor, lineColor) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
        const posAttrib = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posAttrib);

        const uColor = gl.getUniformLocation(shaderProgram, "color");

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.uniform4fv(uColor, solidColor);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.uniform4fv(uColor, lineColor);
        gl.drawElements(gl.LINES, 24, gl.UNSIGNED_SHORT, 0);

    }
}

class Camera {
    constructor(FOV, zNear, zFar, radius) {
        this._aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this._FOV = FOV * Math.PI / 180.0;
        this._zNear = zNear;
        this._zFar = zFar;
        this._radius = radius;

        this._position = vec3.create();

        this._projectionMatrix = mat4.create();
        mat4.perspective(this._projectionMatrix, this._FOV, this._aspectRatio, this._zNear, this._zFar);

        this._modelViewMatrix = mat4.create();
        this._inverseModelViewMatrix = mat4.create();
        this.move([0, 3, radius]);
        this.lookAtPosition([0.0,0.0,0.0]);

    }

    set radius(radius){
        this._radius = Math.max(0.1, radius);
    }

    get radius(){
        return this._radius;
    }

    get projection() {
        return this._projectionMatrix;
    }

    get view() {
        return this._modelViewMatrix;
    }

    get inverseView(){
        return this._inverseModelViewMatrix;
    }

    get position(){
        return this._position;
    }

    zoom(amount){
        this.move([0.0, 0.0, -amount]);
    }

    move(direction) {
        mat4.translate(this._modelViewMatrix, this._modelViewMatrix, direction);
        mat4.getTranslation(this._position, this._modelViewMatrix);
        mat4.invert(this._inverseModelViewMatrix, this._modelViewMatrix);
    }

    moveWorld(direction){
        this._modelViewMatrix[12] += direction[0];
        this._modelViewMatrix[14] += direction[2];
        mat4.getTranslation(this._position, this._modelViewMatrix);
        this.lookAtPosition([0,0,0]);
        mat4.invert(this._inverseModelViewMatrix, this._modelViewMatrix);
    }
    
    lookAtPosition(target) {
        mat4.targetTo(this._modelViewMatrix, this._position, target, [0.0, 1.0, 0.0]);
        mat4.invert(this._inverseModelViewMatrix, this._modelViewMatrix);
    }

    moveAlongCircle(angle) {
        let angle_rad = angle * Math.PI / 180;
        let destination = vec3.create();
        vec3.rotateY(destination, this._position, [0.0, 0.0, 0.0], angle_rad);
        
        let direction = vec3.create();
        vec3.sub(direction, destination, this._position);
        
        this._modelViewMatrix[12] += direction[0];
        this._modelViewMatrix[13] += direction[1];
        this._modelViewMatrix[14] += direction[2];
        mat4.getTranslation(this._position, this._modelViewMatrix);
        this.lookAtPosition([0,0,0]);
        mat4.invert(this._inverseModelViewMatrix, this._modelViewMatrix);
    }

    changeHeight(amount){
        this._modelViewMatrix[13] += amount;
        mat4.getTranslation(this._position, this._modelViewMatrix);
        this.lookAtPosition([0,0,0]);
        mat4.invert(this._inverseModelViewMatrix, this._modelViewMatrix);
    }    

}

class Scene {
    constructor() {
        this._camera = new Camera(45, 0.1, 100, 3);
        this._meshes = [];
    }

    set camera(camera) {
        this._camera = camera;
    }

    get camera() {
        return this._camera;
    }

    addMesh(mesh) {
        this._meshes.push(mesh);
    }

    draw(shaderProgram, solidColor, lineColor) {
        this.clear();
        this._meshes.forEach(mesh => {
            mesh.draw(shaderProgram, solidColor, lineColor);
        });
    }

    clear() {
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

function main() {

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    const vertexShaderSource = getShaderSource('shaders/vertex.shader');
    const fragmentShaderSource = getShaderSource('shaders/fragment.shader');

    var shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
    gl.bindAttribLocation(shaderProgram, 0, "aVertexPosition");
    gl.bindAttribLocation(shaderProgram, 1, "aVertexColor");
    gl.useProgram(shaderProgram);

    const solidColor = [0.9, 0.9, 0.9, 1.0];
    const lineColor = [0.5, 0.5, 0.5, 1.0];

    const projMat = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    const viewMat = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");

    const scene = new Scene();

    gl.uniformMatrix4fv(projMat, false, scene.camera.projection);
    gl.uniformMatrix4fv(viewMat, false, scene.camera.inverseView);

    scene.addMesh(new Grid(10, 4, 4));
    scene.addMesh(new Torus(150, 0.5, 0.25));
    scene.addMesh(new Cube(0.5));
    scene.draw(shaderProgram, solidColor, lineColor);

    console.log(scene.camera.forward);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === "ArrowLeft") {
            scene.camera.moveAlongCircle(-5);
        }

        if (e.key === "ArrowRight") {
            scene.camera.moveAlongCircle(5);
        }

        if(e.key === 'i' && vec3.distance([0,0,0], scene.camera.position) > 1){
            scene.camera.zoom(0.5);
        }

        if(e.key === 'o'){
            scene.camera.zoom(-0.5);
        }

        if(e.key === 'ArrowUp'){
            scene.camera.changeHeight(0.1);
        }

        if(e.key === 'ArrowDown'){
            scene.camera.changeHeight(-0.1);
        }

        if(e.key === 'w'){
            scene.camera.moveWorld([0,0,-0.1])
        }

        if(e.key === 's'){
            scene.camera.moveWorld([0,0,0.1]);
        }

        if(e.key === 'a'){
            scene.camera.moveWorld([-0.1, 0,0]);
        }

        if(e.key === 'd'){
            scene.camera.moveWorld([0.1,0,0]);
        }
        gl.uniformMatrix4fv(projMat, false, scene.camera.projection);
        
        gl.uniformMatrix4fv(viewMat, false, scene.camera.inverseView);
        scene.draw(shaderProgram, solidColor, lineColor);
    });
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