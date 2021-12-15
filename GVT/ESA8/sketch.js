const mat2 = glMatrix.mat2;
const mat2d = glMatrix.mat2d;
const mat3 = glMatrix.mat3;
const mat4 = glMatrix.mat4;

const quat = glMatrix.quat;
const quat2 = glMatrix.quat2;

const vec2 = glMatrix.vec2;
const vec3 = glMatrix.vec3;
const vec4 = glMatrix.vec4;

const canvas = document.getElementById('glCanvas');
/** @type {WebGL2RenderingContext} */
const gl = canvas.getContext('webgl2');

// Shader Loading Utils

function getShaderSource(url) {
    let req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send();
    return (req.status == 200) ? req.responseText : null;
};

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

if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
}

const solidVertexShaderSource = getShaderSource('shaders/solid.vs');
const solidFragmentShaderSource = getShaderSource('shaders/solid.fs');

const wireframeVertexShaderSource = getShaderSource('shaders/wireframe.vs');
const wireframeFragmentShaderSource = getShaderSource('shaders/wireframe.fs');

const depthVertexShaderSource = getShaderSource('shaders/depth.vs');
const depthFragmentShaderSource = getShaderSource('shaders/depth.fs');

const diffuseVertexShaderSource = getShaderSource('shaders/diffuse.vs');
const diffuseFragmentShaderSource = getShaderSource('shaders/diffuse.fs');

const toonVertexShaderSource = getShaderSource('shaders/toon.vs');
const toonFragmentShaderSource = getShaderSource('shaders/toon.fs');

const solidShaderProgram = initShaderProgram(gl, solidVertexShaderSource, solidFragmentShaderSource);
const wireframeShaderProgram = initShaderProgram(gl, wireframeVertexShaderSource, wireframeFragmentShaderSource);
const depthShaderProgram = initShaderProgram(gl, depthVertexShaderSource, depthFragmentShaderSource);
const diffuseShaderProgram = initShaderProgram(gl, diffuseVertexShaderSource, diffuseFragmentShaderSource);
const toonShaderProgram = initShaderProgram(gl, toonVertexShaderSource, toonFragmentShaderSource);

const red = [1.0, 0.0, 0.0, 1.0];
const white = [1.0, 1.0, 1.0, 1.0];
const lightGrey = [0.8, 0.8, 0.8, 1.0];
const darkGrey = [0.4, 0.4, 0.4, 1.0];

const scene = new Scene();

const floor = new Grid(20, red, white);
scene.addMesh(floor);
floor.uniformScale(20);

const mesh = new MeshLoader('models/monkey_smooth.obj', lightGrey, darkGrey);
scene.addMesh(mesh);
mesh.setPosition([0,3,0]);

const light = new Light([-5.0,5.0,0], [1.0, 0.3, 0.1], 1.0);
scene.addLight(light);

const light2 = new Light([5.0,5.0,0], [0.1, 0.4, 0.8], 1.0);
scene.addLight(light2);


function moveCamera(e) {
    switch (e.code) {
        case "KeyA":
            scene.camera.moveAlongCircle(-5);
            break;
        case "KeyD":
            scene.camera.moveAlongCircle(5);
            break;
        case "KeyS":
            scene.camera.move([0, -0.5, 0]);
            break;
        case "KeyW":
            scene.camera.move([0,0.5,0]);
            break;
        case "KeyI":
            scene.camera.zoom(0.5);
            break;
        case "KeyO":
            scene.camera.zoom(-0.5);
            break;
        default:
            break;
    }

}
window.addEventListener('keydown', moveCamera);

function draw(){
    scene.lights.forEach(light => {
       light.moveAlongCircle(0.2);
    });
    scene.drawSolid(toonShaderProgram);
    window.requestIdleCallback(draw);
}

window.requestAnimationFrame(draw);



