import { Canvas } from "./Core/Canvas.js";
import { Shader } from "./Core/Shader.js";
import { Scene } from "./Core/Scene.js";
import { Animator } from "./Animation/Animator.js";
import { GridMesh } from "./Graphics/Meshes/GridMesh.js";
import { ObjMesh } from "./Graphics/Meshes/ObjMesh.js";
import { PointLight } from "./Graphics/Lights/PointLight.js";
import { SphereMesh } from "./Graphics/Meshes/SphereMesh.js";
import { TorusMesh } from "./Graphics/Meshes/TorusMesh.js";
import {Colors} from "./Utils/Colors.js";
import {ModelBase} from "./Graphics/Models/ModelBase.js";
import {Material} from "./Graphics/Materials/Material.js";
import {Cube} from "./Graphics/Models/Cube.js";
import {FileModel} from "./Graphics/Models/FileModel.js";
import {Grid} from "./Graphics/Models/Grid.js";
import {Torus} from "./Graphics/Models/Torus.js";
import {Sphere} from "./Graphics/Models/Sphere.js";

const container = document.getElementById('renderer');
let canvas = new Canvas("glCanvas", container);
let gl = canvas.GL;


const shaderPath = "Graphics/Shaders/";
const modelPath = "Resources/Models/";

const toonShader = new Shader(gl, shaderPath + "toon.vs", shaderPath + "toon.fs");
const phongPoint = new Shader(gl, shaderPath + "Phong.vs", shaderPath + "PhongPoint.fs");
const phongDirectional = new Shader(gl, shaderPath + "Phong.vs", shaderPath + "PhongDirectional.fs");

const scene = new Scene(gl,[0.1, 0.2, 0.3]);
const animator = new Animator();

const wood = new Material(gl, phongPoint, Colors.White, "Resources/Textures/wood.jpg");
const uv_pattern = new Material(gl, phongPoint, Colors.White, "Resources/Textures/uv_grid.jpg");

const monkey = new FileModel(gl, modelPath + 'monkey_smooth.obj', uv_pattern);
scene.addModel(monkey);
monkey.Position = [0, 1, 0];
monkey.uniformscale(0.5);

const floor = new Grid(gl, 16, wood);
scene.addModel(floor);
floor.uniformscale(5);

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

    monkey.rotate([0,0,1]);
    scene.draw();
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);



