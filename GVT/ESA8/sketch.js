// include all glMatrix classes
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
if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
}
const red = [1.0, 0.0, 0.0, 1.0];
const white = [1.0, 1.0, 1.0, 1.0];
const lightGrey = [0.8, 0.8, 0.8, 1.0];
const darkGrey = [0.4, 0.4, 0.4, 1.0];

const toonShader = new Shader("shaders/toon.vs", "shaders/toon.fs");
const diffuseShader = new Shader('shaders/diffuse.vs', 'shaders/diffuse.fs');

const scene = new Scene();

const floor = new Grid(20, toonShader, white);
scene.addMesh(floor);
floor.uniformscale(20);

const monkey = new MeshLoader('models/monkey_smooth.obj', toonShader, white);
scene.addMesh(monkey);
monkey.Position = [0,2,0];

const teapot = new MeshLoader('models/teapot.obj', toonShader, white);
scene.addMesh(teapot);
teapot.Position = [-2,0,0];
teapot.uniformscale(0.5);
teapot.rotate([0,-30,0]);

const spot = new MeshLoader('models/spot.obj', toonShader, white);
scene.addMesh(spot);
spot.Position = [2,0,0];

const torus = new Torus(32, 32, toonShader, white);
scene.addMesh(torus);
torus.rotate([90,0,0]);
torus.Position = [0,3.5,0];
torus.uniformscale(2);

const light = new PointLight([1.0, 0.0, 0.0], 1.0);
scene.addLight(light);
light.Position = [0,4,4];

const light2 = new PointLight( [0.0, 1.0, 0.0], 1.0);
scene.addLight(light2);
light2.Position = [4,4,-4];

const light3 = new PointLight([0.0, 0.0, 1.0], 1.0);
scene.addLight(light3);
light3.Position = [-4,4,-4];

const animator = new Animator();

let isToon = true;
let lightsRotating = true;
function processInput(e) {
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
        case "KeyG":
            if(isToon){
                scene.Meshes.forEach(mesh => {
                    mesh.Shader = diffuseShader;
                });
                isToon = false;
            }else{
                scene.Meshes.forEach(mesh => {
                    mesh.Shader = toonShader;
                });
                isToon = true;
            }
            break;
        case "KeyL":
            lightsRotating = !lightsRotating;
            break;
        default:
            break;
    }

}
window.addEventListener('keydown', processInput);

function draw(){
    if(lightsRotating){
        scene.lights.forEach(light => {
           light.Position = animator.rotateAroundY(light.Position, 0.2, [0,0,0]);
        });
    }

    scene.draw();
    window.requestIdleCallback(draw);
}

window.requestAnimationFrame(draw);



