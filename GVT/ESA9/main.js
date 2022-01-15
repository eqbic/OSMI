import { Canvas } from "./Core/Canvas.js";
import { Shader } from "./Core/Shader.js";
import { Scene } from "./Core/Scene.js";
import { Animator } from "./Animation/Animator.js";
import { Grid } from "./Graphics/Meshes/Grid.js";
import { MeshLoader } from "./Graphics/Meshes/MeshLoader.js";
import { PointLight } from "./Graphics/Lights/PointLight.js";
import { Sphere } from "./Graphics/Meshes/Sphere.js";
import { Torus } from "./Graphics/Meshes/Torus.js";
import {Colors} from "./Utils/Colors.js";

const container = document.getElementById('renderer');
let canvas = new Canvas("glCanvas", container);
let gl = canvas.GL;


const shaderPath = "Graphics/Shaders/";
const modelPath = "Resources/Models/";

const toonShader = new Shader(gl, shaderPath + "toon.vs", shaderPath + "toon.fs");
const phongShader = new Shader(gl, shaderPath + "PhongPoint.vs", shaderPath + "PhongPoint.fs");

const scene = new Scene(gl,[0.1, 0.2, 0.3]);
const animator = new Animator();

// const floor = new Grid(gl, 3, phongShader, Colors.White);
// scene.addMesh(floor);
// floor.uniformscale(10);

// const torus1 = new Torus(gl, 32, 32, phongShader, Colors.White);
// scene.addMesh(torus1);
// torus1.Position = [-1.5, 1, 0];
//
// const torus2 = new Torus(gl, 32, 32, phongShader, Colors.White);
// scene.addMesh(torus2);
// torus2.Position = [-0, 1, 0];
//
// const torus3 = new Torus(gl, 32, 32, phongShader, Colors.White);
// scene.addMesh(torus3);
// torus3.Position = [1.5, 1, 0];

const cube = new MeshLoader(gl, modelPath + 'monkey_smooth.obj', phongShader, Colors.Red);
scene.addMesh(cube);

cube.Position = [0, 1, 0];
cube.uniformscale(0.5);


const light = new PointLight(Colors.White, 0.5);
scene.addLight(light);
light.Position = [0, 2, 1];


function processInput(e) {
    switch (e.code) {
        case "KeyA":
            scene.Camera.moveAlongCircle(-5);
            break;
        case "KeyD":
            scene.Camera.moveAlongCircle(5);
            break;
        case "KeyS":
            scene.Camera.move([0, -0.5, 0]);
            break;
        case "KeyW":
            scene.Camera.move([0, 0.5, 0]);
            break;
        case "KeyI":
            scene.Camera.zoom(0.5);
            break;
        case "KeyO":
            scene.Camera.zoom(-0.5);
            break;
        case "KeyR":
            scene.Camera.reset();
            break;
        default:
            break;
    }

}
window.addEventListener('keydown', processInput);

function draw() {

    // scene.Lights.forEach(light => {
    //     light.Position = animator.rotateAroundY(light.Position, 0.5, [0, 0, 0]);
    // });
    //
    // torus1.rotate([0.5, 0, 0]);
    // torus2.rotate([0, 0.5, 0]);
    // torus3.rotate([0, 0.5, 0.5]);

    cube.rotate([0,0,1]);
    scene.draw();
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);



