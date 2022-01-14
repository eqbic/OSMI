import {Canvas} from "./Core/Canvas.js";
import {Shader} from "./Core/Shader.js";
import {Scene} from "./Core/Scene.js";
import {Animator} from "./Animation/Animator.js";
import {Grid} from "./Graphics/Meshes/Grid.js";
import {MeshLoader} from "./Graphics/Meshes/MeshLoader.js";
import {PointLight} from "./Graphics/Lights/PointLight.js";
import {Sphere} from "./Graphics/Meshes/Sphere.js";
import {Torus} from "./Graphics/Meshes/Torus.js";

const canvas = new Canvas("glCanvas", document.body, 1450, 800);
const gl = canvas.GL;
const white = [1.0, 1.0, 1.0, 1.0];

const shaderPath = "Graphics/Shaders/";
const modelPath = "Resources/Models/";

const toonShader = new Shader(gl, shaderPath + "toon.vs", shaderPath + "toon.fs");
const phongShader = new Shader(gl,shaderPath + "PhongPoint.vs", shaderPath + "PhongPoint.fs");

const scene = new Scene(gl, [0.1, 0.2, 0.3]);
const animator = new Animator();

const floor = new Grid(gl, 3, phongShader, white);
scene.addMesh(floor);
floor.uniformscale(10);

const monkey = new MeshLoader(gl, modelPath + "monkey_smooth.obj", phongShader, white);
scene.addMesh(monkey);
monkey.Position = [0,1,0];

const sphere = new Sphere(gl, 64, phongShader, white);
scene.addMesh(sphere);
sphere.Position = [3,2,0]

const torus = new Torus(gl, 64, 64, phongShader, white);
scene.addMesh(torus);
torus.Position = [-3, 2, 0];


const light = new PointLight([0.91, 0.52, 0.46], 0.5);
scene.addLight(light);
light.Position = [0,4,4];

const light2 = new PointLight( [0.92, 0.97, 0.97], 0.2);
scene.addLight(light2);
light2.Position = [4,4,-4];

const light3 = new PointLight([0.37, 0.67, 0.93], 0.1);
scene.addLight(light3);
light3.Position = [-4,4,-4];

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
            scene.Camera.move([0,0.5,0]);
            break;
        case "KeyI":
            scene.Camera.zoom(0.5);
            break;
        case "KeyO":
            scene.Camera.zoom(-0.5);
            break;
        default:
            break;
    }

}
window.addEventListener('keydown', processInput);

function draw(){

    scene.Lights.forEach(light => {
        light.Position = animator.rotateAroundY(light.Position, 0.5, [0,0,0]);
    });

    monkey.rotate([0, -0.2, 0]);
    torus.rotate([0.2, 0, 0]);

    scene.draw();
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);



