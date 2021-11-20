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

class Vertex {
    #index
    #position;
    constructor(index, position) {
        this.#index = index;
        this.#position = position;
    }

    get position() {
        return this.#position;
    }

    get index() {
        return this.#index;
    }
}

class Mesh {
    constructor() {
        this._vertices = [];
        this._indices = [];
        this._lineIndices = [];
        this._positionBuffer = gl.createBuffer();
        this._indexBuffer = gl.createBuffer();
        this._lineBuffer = gl.createBuffer();
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

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._lineBuffer);
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

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._lineBuffer);
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

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._lineBuffer);
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
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._lineBuffer);
        gl.drawElements(gl.LINES, (4 * (this._resolution - 1) * (this._resolution - 1) + 2 * this._resolution), type, 0);
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
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0
        ];

        for (var i = 0; i < positions.length; i++) {
            positions[i] *= this._size;
        }

        this._indices = [
            0, 1, 2,
            0, 2, 3,
            2, 3, 6,
            3, 6, 7,
            4, 5, 6,
            4, 6, 7,
            0, 1, 5,
            0, 5, 4,
            5, 1, 2,
            5, 2, 6,
            4, 0, 3,
            4, 3, 7
        ];

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
            1, 5,
            2, 6,
            3, 7
        ];

        gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._lineBuffer);
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

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._lineBuffer);
        gl.uniform4fv(uColor, lineColor);
        gl.drawElements(gl.LINES, 24, gl.UNSIGNED_SHORT, 0);

    }
}

class Camera {
    constructor(FOV, zNear, zFar, radius) {
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

        this.lookAtPosition([0, 0, 0]);
    }

    get projection() {
        return this.projectionMatrix;
    }

    get view() {
        return this.modelViewMatrix;
    }

    move(direction) {
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, direction);
        vec3.add(this.position, this.position, direction);
    }

    moveAlongCircle(angle) {
        let angle_rad = angle * Math.PI / 180;
        let destination = vec3.create();
        vec3.rotateY(destination, this.position, [0.0, 0.0, 0.0], angle_rad);
        let direction = vec3.create();
        vec3.sub(direction, destination, this.position);
        this.move(direction);
    }

    lookAtPosition(target) {
        mat4.lookAt(this.modelViewMatrix, this.position, target, [0.0, 1.0, 0.0]);
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
    gl.uniformMatrix4fv(viewMat, false, scene.camera.view);

    scene.addMesh(new Grid(10, 4, 4));
    scene.addMesh(new Torus(150, 0.5, 0.25));
    scene.addMesh(new Cube(0.2));
    scene.draw(shaderProgram, solidColor, lineColor);

    document.addEventListener('keydown', (e) => {
        if (e.key === "ArrowLeft") {
            scene.camera.moveAlongCircle(-5);
            scene.camera.lookAtPosition([0.0, 0.0, 0.0]);
            gl.uniformMatrix4fv(projMat, false, scene.camera.projection);
            gl.uniformMatrix4fv(viewMat, false, scene.camera.view);
            scene.draw(shaderProgram, solidColor, lineColor);
        }

        if (e.key === "ArrowRight") {
            scene.camera.moveAlongCircle(5);
            scene.camera.lookAtPosition([0.0, 0.0, 0.0]);
            gl.uniformMatrix4fv(projMat, false, scene.camera.projection);
            gl.uniformMatrix4fv(viewMat, false, scene.camera.view);
            scene.draw(shaderProgram, solidColor, lineColor);
        }
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