import { Canvas } from "./Core/Canvas.js";
import { Scene } from "./Core/Scene.js";
import {Colors} from "./Utils/Colors.js";
import {ConstantMaterial} from "./Graphics/Materials/ConstantMaterial.js";
import {Sphere} from "./Graphics/Models/Sphere.js";
import {CsvReader} from "./Utils/CsvReader.js";
import {PhongMaterial} from "./Graphics/Materials/PhongMaterial.js";
import {DirectionalLight} from "./Graphics/Lights/DirectionalLight.js";

// init tsne
const opt = {
    epsilon: 10,
    perplexity: 25,
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

let step = 0;
for(let i = 0; i < 110; i++){
    tsne.step();
    step++;
}
currentStep.innerText = step;
const result = tsne.getSolution();

let manual = false;
function CalcStep(){
    if(!manual){
        manual = true;
        step = 0;
        tsne.initDataRaw(tsneData);
    }
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
const scene = new Scene(gl,Colors.DarkPurple);

// Create Materials
const orangeMat = new ConstantMaterial(gl, Colors.LightOrange);
const purpleMat = new ConstantMaterial(gl, Colors.LightPurple);
const greenMat = new ConstantMaterial(gl, Colors.LightGreen);


const seedMats = [orangeMat, purpleMat, greenMat];

result.forEach((position, index) => {
    const category = csvData[index].category;
    const point = new Sphere(gl, 16, seedMats[category - 1]);
    scene.addModel(point);
    point.Position = position;
    point.uniformscale(0.1);
});

const rotationSpeed = 3.0;
const translationSpeed = 0.5;
function processInput(e) {
    if (e.code === "KeyH") {
        scene.Camera.rotate([0, rotationSpeed, 0]);
    }
    if (e.code === "KeyK") {
        scene.Camera.rotate([0, -rotationSpeed, 0]);
    }
    if (e.code === "KeyU") {
        scene.Camera.rotate([rotationSpeed, 0, 0]);
    }
    if (e.code === "KeyJ") {
        scene.Camera.rotate([-rotationSpeed, 0, 0]);
    }
    if (e.code === "KeyW") {
        scene.Camera.translate([0, 0, -translationSpeed]);
    }
    if (e.code === "KeyS") {
        scene.Camera.translate([0, 0, translationSpeed]);
    }
    if (e.code === "KeyA") {
        scene.Camera.translate([-translationSpeed, 0, 0]);
    }
    if (e.code === "KeyD") {
        scene.Camera.translate([translationSpeed, 0, 0]);
    }
    if (e.code === "KeyQ") {
        scene.Camera.translate([0, translationSpeed, 0]);
    }
    if (e.code === "KeyE") {
        scene.Camera.translate([0, -translationSpeed, 0]);
    }
    if (e.code === "KeyR") {
        scene.Camera.reset();
    }
    if (e.code === "KeyT") {
        CalcStep();
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



