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

const floor = new Grid(gl, 8, floorMat);
scene.addModel(floor);
floor.uniformscale(2);

const cannon = new FileModel(gl, modelPath + 'cannon.obj', cannonMat);
scene.addModel(cannon);

// Create Lights and add to the scene
const light = new DirectionalLight(Colors.SunLight, 1.0);
scene.addLight(light);
light.Position = [-2, 2, -2];


const pointLight = new PointLight(Colors.Red, 3.0);
scene.addLight(pointLight);
pointLight.Position = [0.5, 2, 0.0];

const animator = new Animator();

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

    pointLight.Position = animator.rotateAroundY(pointLight.Position, 1, [0,0,0]);

    scene.draw();
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);



