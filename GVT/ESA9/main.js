import { Canvas } from "./Core/Canvas.js";
import { Shader } from "./Core/Shader.js";
import { Scene } from "./Core/Scene.js";
import { PointLight } from "./Graphics/Lights/PointLight.js";
import {Colors} from "./Utils/Colors.js";
import {Material} from "./Graphics/Materials/Material.js";
import {FileModel} from "./Graphics/Models/FileModel.js";
import {DirectionalLight} from "./Graphics/Lights/DirectionalLight.js";

// Shortcuts to Assets
const shaderPath = "Graphics/Shaders/";
const modelPath = "Resources/Models/";

const container = document.getElementById('renderer');
const canvas = new Canvas("glCanvas", container);
const gl = canvas.GL;

// Create Scene.
const scene = new Scene(gl,Colors.SkyBlue);

// Shaders
const phong = new Shader(gl, shaderPath + "Phong.vs", shaderPath + "Phong.fs");

// Materials
const wood = new Material(gl, phong, Colors.White, "Resources/Textures/wood.jpg");
const uv_pattern = new Material(gl, phong, Colors.White, "Resources/Textures/uv_grid.jpg");

// Create Models and add to the scene
const monkey = new FileModel(gl, modelPath + 'monkey_smooth.obj', uv_pattern);
scene.addModel(monkey);
monkey.Position = [0, 1, 0];
monkey.uniformscale(0.5);

const floor = new FileModel(gl, modelPath + 'floor.obj', wood);
scene.addModel(floor);

const walls = new FileModel(gl, modelPath + 'walls.obj', wood);
scene.addModel(walls);

// Create Lights and add to the scene
const sun = new DirectionalLight(Colors.SunLight, 1.0);
scene.addLight(sun);
sun.Position = [3, 1, 0];

const pointLight = new PointLight(Colors.Red, 1.0);
scene.addLight(pointLight);
pointLight.Position = [-0.9, 1.0, -0.9];

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

    monkey.rotate([0,0,1]);
    scene.draw();
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);



