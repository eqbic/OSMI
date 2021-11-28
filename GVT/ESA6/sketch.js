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

const solidShaderProgram = initShaderProgram(gl, solidVertexShaderSource, solidFragmentShaderSource);
const wireframeShaderProgram = initShaderProgram(gl, wireframeVertexShaderSource, wireframeFragmentShaderSource);


const red = [1.0, 0.0, 0.0, 1.0];
const white = [1.0, 1.0, 1.0, 1.0];
const lightGrey = [0.8, 0.8, 0.8, 1.0];
const darkGrey = [0.4, 0.4, 0.4, 1.0];

const scene = new Scene();

const floor = new Grid(20, red, white);
scene.addMesh(floor);

const ring = new Torus(16,32, lightGrey, darkGrey);
scene.addMesh(ring);

const ball = new Sphere(16, lightGrey, darkGrey);
scene.addMesh(ball);

const ball2 = new Sphere(16, lightGrey, darkGrey);
scene.addMesh(ball2);

const ball3 = new Sphere(16, lightGrey, darkGrey);
scene.addMesh(ball3);

const ball4 = new Sphere(16, lightGrey, darkGrey);
scene.addMesh(ball4);


let xy = 3;
let radius = 4.5;
let scale = 0.5;
let animationRun = true;
let totalTime = 0;
let speed = 10.0;

function toggleAnimation(e){
    if(e.code === "Space"){
        animationRun = !animationRun;
       if(animationRun) window.requestAnimationFrame(draw);
    }

    if(e.code === "ArrowUp") speed += 1;
    if(e.code === "ArrowDown") speed -= 1;
}

function moveCamera(e) {
    switch (e.code) {
        case "KeyA":
            scene.camera.moveAlongCircle(-1);
            break;
        case "KeyD":
            scene.camera.moveAlongCircle(1);
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

function draw(timestamp){

    totalTime += speed;
    let rotation = totalTime * 0.1;
    floor.uniformScale(40);
    
    
    ball.setPosition([xy,3,xy]);
    ball.rotate([0, rotation, 0]);
    ball.setPosition([radius,0,0]);
    ball.uniformScale(scale);

    ball2.setPosition([-xy,3,xy]);
    ball2.rotate([0, -rotation + 270, 0]);
    ball2.setPosition([radius,0,0]);
    ball2.uniformScale(scale);

    ball3.setPosition([-xy,3,-xy]);
    ball3.rotate([0, rotation, 0]);
    ball3.setPosition([radius,0,0]);
    ball3.uniformScale(scale);

    ball4.setPosition([xy,3,-xy]);
    ball4.rotate([0, -rotation + 270, 0]);
    ball4.setPosition([radius,0,0]);
    ball4.uniformScale(scale);


    ring.setPosition([0,3,0]);
    ring.uniformScale(4);
    ring.rotate([0,rotation,0]);


    scene.drawSolid(solidShaderProgram);
    scene.drawWireframe(wireframeShaderProgram);
    if(animationRun){
        window.requestAnimationFrame(draw);
    }
}

window.requestAnimationFrame(draw);
window.addEventListener('keydown', toggleAnimation);
window.addEventListener('keydown', moveCamera);



