import { Canvas } from "./Core/Canvas.js";
import { Scene } from "./Core/Scene.js";
import { PointLight } from "./Graphics/Lights/PointLight.js";
import {Colors} from "./Utils/Colors.js";
import {FileModel} from "./Graphics/Models/FileModel.js";
import {PBRMaterial} from "./Graphics/Materials/PBRMaterial.js";
import {PhongMaterial} from "./Graphics/Materials/PhongMaterial.js";
import {DirectionalLight} from "./Graphics/Lights/DirectionalLight.js";
import {Animator} from "./Animation/Animator.js";
import {Grid} from "./Graphics/Models/Grid.js";
import {NoiseMaterial} from "./Graphics/Materials/NoiseMaterial.js";

// Shortcuts to Assets
const modelPath = "Resources/Models/";
const cannonTex = "Resources/Textures/Cannon/";
const floorTex = "Resources/Textures/Floor/";

const container = document.getElementById('renderer');
const canvas = new Canvas("glCanvas", container);
const gl = canvas.GL;

// Create Scene.
const scene = new Scene(gl,Colors.DarkBlue);

// Create Materials
const cannonMat = new PBRMaterial(gl, Colors.White, cannonTex + "Cannon_Albedo.png", cannonTex + "Cannon_Metalness.png", cannonTex + "Cannon_Roughness.png", cannonTex + "Cannon_Normal.png");
const floorMat = new PBRMaterial(gl, Colors.White, floorTex + "floor_albedo.jpg", floorTex + "floor_metal.jpg", floorTex + "floor_roughness.jpg", floorTex + "floor_normal.jpg");
const uv_pattern = new PhongMaterial(gl, Colors.White, "Resources/Textures/uv_test.jpg");
const noiseMat = new NoiseMaterial(gl, Colors.White);


// Create Models
const floor = new Grid(gl, 8, floorMat);
scene.addModel(floor);
floor.uniformscale(2);

const cannon = new FileModel(gl, modelPath + 'cannon.obj', cannonMat);
scene.addModel(cannon);

const torus = new FileModel(gl, modelPath + 'torus.obj', noiseMat);
scene.addModel(torus);
torus.rotate([90, 0, 0]);
torus.Position = [0,0.8,1.3];
torus.uniformscale(0.3);


// Create Lights and add to the scene
const light = new DirectionalLight(Colors.SunLight, 1.0);
scene.addLight(light);
light.Position = [-2, 5, -2];

const skylight = new DirectionalLight(Colors.SkyBlue, 0.8);
scene.addLight(skylight);
skylight.Position = [2, -5, 2];


const pointLight = new PointLight(Colors.Red, 1.0);
scene.addLight(pointLight);
pointLight.Position = [0.5, 2, 0.0];


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
let time = 0.0;
function draw() {
    scene.draw(time);
    time += 0.01;
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);



