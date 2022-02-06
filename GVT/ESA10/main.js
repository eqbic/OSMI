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
import {ConstantMaterial} from "./Graphics/Materials/ConstantMaterial.js";
import {Sphere} from "./Graphics/Models/Sphere.js";
import {CsvReader} from "./Utils/CsvReader.js";

// init tsne
var opt = {
    epsilon: 10,
    perplexity: 15,
    dim: 3
};

let currentStep = document.getElementById("currentStep");


const tsne = new tsnejs.tSNE(opt);
const csvData = CsvReader.Read("Resources/Data/seeds.csv");
const tsneData = [];
csvData.forEach(data => {
    tsneData.push(data.data);
})
tsne.initDataRaw(tsneData);
const result = tsne.getSolution();

let step = 0;
function CalcStep(){
    tsne.step();
    step += 1;
    currentStep.innerText = step;
    const newPositions = tsne.getSolution();
    for(let i = 0; i < scene.Models.length; i++){
        scene.Models[i].Position = newPositions[i];
    }
}



const container = document.getElementById('renderer');
const canvas = new Canvas("glCanvas", container);
const gl = canvas.GL;

// Create Scene.
const scene = new Scene(gl,Colors.DarkBlue);

// Create Materials
const redMat = new ConstantMaterial(gl, Colors.Red);
const blueMat = new ConstantMaterial(gl, Colors.Blue);
const greenMat = new ConstantMaterial(gl, Colors.Green);

const seedMats = [redMat, blueMat, greenMat];

result.forEach((position, index) => {
    const category = csvData[index].category;
    const point = new Sphere(gl, 16, seedMats[category - 1]);
    scene.addModel(point);
    point.Position = position;
    point.uniformscale(0.1);
});

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
        case "KeyT":
            CalcStep();
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



