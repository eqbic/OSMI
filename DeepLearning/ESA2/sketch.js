class Simulation{
    constructor(start_time = 0.0, duration = 50.0, dt = 1, numberInputNeurons = 2, numberOutputNeuron = 3){
        
        this.start_time = start_time;
        this.duration = duration;
        this.dt = dt;
        
        this.ts = [];

        this.spike_times = [];
        this.voltage = 0.0;
        this.I_input = 0.0;


        this.inputNeurons = [];
        this.outputNeurons = [];

        this.time = 0.0;

        this.inputCount = numberInputNeurons;
        this.outputCount = numberOutputNeuron;

        this.setup();
    }

    setup(){
        this.inputNeurons = [];
        this.outputNeurons = [];
        for(var i = 0; i < this.inputCount; i++){
            var inputNeuron = new LIFNeuron();
            this.inputNeurons.push(inputNeuron);
        }

        for(var i = 0; i < this.outputCount; i++){
            var layerNeuron = new LIFNeuron();
            this.outputNeurons.push(layerNeuron);
        }
    }

    setInputCount(newCount){
        this.inputCount = newCount;
        this.setup();
    }

    setOutputCount(newCount){
        this.outputCount = newCount;
        this.setup();
    }

    update(){
        
        if(this.ts.length > this.duration){
            this.ts.shift();
        }
        this.ts.push(this.time);
        
        this.simulateStep(this.time);
        
        this.time += this.dt;
    }

    simulateStep(){
        this.inputNeurons.forEach(neuron => {
            this.simulateInputNeuron(neuron);
            neuron.update();
        });

        this.outputNeurons.forEach(neuron => {
            this.simulateOutputNeuron(neuron);
            neuron.update();
        })
    }

    simulateInputNeuron(neuron){
        neuron.i_input = this.setRandomCurrent();
        neuron.dt = this.dt;
        neuron.get_potential_op();
    }

    simulateOutputNeuron(outputNeuron){
        var current = 0.0;
        this.inputNeurons.forEach(inputNeuron => {
            if(inputNeuron.hasFired){
                let weight = (inputNeuron.weight + outputNeuron.weight) / 2.0;
                current += weight;
            }
        });
        outputNeuron.i_input = current;
        outputNeuron.dt = this.dt;
        outputNeuron.get_potential_op();
    }

    setCurrent(time){
        // Set input current in mA
        if(time > 10 && time < 30){
            this.I_input = 0.5;
        }else if(time > 50 && time < 100){
            this.I_input = 1.2;
        }else if(time > 120 && time < 180){
            this.I_input = 4;
        }else{
            this.I_input = 0.0;
        }
    }

    setRandomCurrent(){
        var num = getRandomNumber(minCurrent,maxCurrent);
        return num;
    }

    reset(){
        this.time = 0;
        this.ts = [];
        this.inputNeurons.forEach(neuron => {
            neuron.potential = neuron.u_rest;
            this.as = [];
            this.us = [];
            this.hasFired = false;
        });
    }
}

class LIFNeuron{
    constructor(u_rest = 0, u_threshold = 1, tau_rest = 4.0, r = 1.0, tau = 10.0, duration = 50.0, minWeight = 0.8, maxWeight = 1.5){
        // Membrane resting potential in mV
        this.u_rest = u_rest;
        // Membrane threshold potential in mV
        this.u_threshold = u_threshold;
        // Duration of the resting period in ms
        this.tau_rest = tau_rest;
        // Membrane resistance in ohm
        this.r = r;
        // Membrane time constant in ms
        this.tau = tau;

        // The current membrane potential
        this.potential = this.u_rest;
        // The duration left in the resting period (0 most of the time except after a neuron spike)
        this.t_rest = 0.0;
        // Input current
        this.i_input = 0.0;
        // The chosen time interval for the stimulation in ms
        this.dt = 0.0;

        this.duration = duration;

        this.hasFired = false;

        this.as = [];
        this.us = [];

        this.setWeight(minWeight, maxWeight);
    }

    setWeight(min, max){
        this.weight = getRandomNumber(min,max);
    }

    get_integrating_op(){
        var du_op = (this.r * this.i_input - this.potential) / this.tau;
        this.potential = this.potential + (du_op * this.dt);
        this.t_rest = 0.0;
        this.hasFired = false;
    }

    get_firing_op(){
        this.potential = this.u_rest;
        this.t_rest = this.tau_rest;
        this.hasFired = true;
    }

    get_resting_op(){
        this.potential = this.u_rest;
        this.t_rest -= this.dt;
    }

    get_potential_op(){
        
        if((this.t_rest > 0.0) || (this.potential > this.u_threshold))
        {
            if(this.t_rest > 0.0)
            {
                this.get_resting_op();
            }
            if(this.potential > this.u_threshold)
            {
                this.get_firing_op();
            }
        }else{
            this.get_integrating_op();
        }
    }

    update(){
        if(this.as.length > this.duration){
            this.as.shift();
        }
        this.as.push(this.i_input);

        if(this.us.length > this.duration){
            this.us.shift();
        }
        this.us.push(this.potential);
    }
    
}


// GLOBALS

var simulation = new Simulation();
var inputRatio;
var outputRatio;
var neurons = [];

var canvas;
var canvasWidth;
var canvasHeight;

var isRunning = false;
var runInterval;
var timeStep = 100;

var minCurrent = 0;
var maxCurrent = 3;

var minWeight = 0.8;
var maxWeight = 1.5;


function getRandomNumber(min, max) {
    let num = Math.random();
    num = num * max + min;
    num = Math.max(min, Math.min(num, max));
    return num;
  }

function setupInputPlots(){

    var inputCurrentData = [];
    for(var i = 0; i < simulation.inputCount; i++){
        var data = {
            x: simulation.inputNeurons[i].ts,
            y: simulation.inputNeurons[i].as,
            name: 'Input ' + i,
            type: 'scatter'
        };
        inputCurrentData.push(data);
    }


    var inputPotentialData = [];
    for(var i = 0; i < simulation.inputCount; i++){
        var data = {
            x: simulation.inputNeurons[i].ts,
            y: simulation.inputNeurons[i].us,
            name: 'Input ' + i,
            type: 'scatter'
        };
        inputPotentialData.push(data);
    }

    var current_layout = {
        xaxis:{
            title: {
                text: 'Time',
            }
        },
        yaxis:{
            title:{
                text: 'Input Current'
            }
        }
    };

    var potential_layout = {
        title:{
            text: 'Threshold = 1'
        },
        xaxis:{
            title: {
                text: 'Time'
            }
        },
        yaxis:{
            title:{
                text: 'Membrane Potential',
            },
            range: [0, 1.2]
        }
    };

    Plotly.newPlot('InputCurrentPlot', inputCurrentData, current_layout);
    Plotly.newPlot('InputPotentialPlot', inputPotentialData, potential_layout);
}

function setupOutputPlot(){
    var outputPotentialData = [];
    for(var i = 0; i < simulation.outputCount; i++){
        var data = {
            x: simulation.outputNeurons[i].ts,
            y: simulation.outputNeurons[i].us,
            name: 'Output' + i,
            type: 'scatter'
        };
        outputPotentialData.push(data);
    }

    var outputLayout = {
        title:{
            text: 'Threshold = 1'
        },
        yaxis:{
            title:{
                text: 'Membrane Potential',
            },
            range: [0, 1.2]
        }
    };
    
    Plotly.newPlot('OutputPlot', outputPotentialData, outputLayout);
}

function setup(){
    
    // PLOTS
    
    setupInputPlots();
    setupOutputPlot();
    
    runInterval = setInterval(updateChart, timeStep);
    clearInterval(runInterval);

    // CANVAS
    // Setup Canvas
    canvasWidth = document.getElementById('canvas').offsetWidth;
    canvasHeight = document.getElementById('canvas').offsetHeight;
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('#canvas');
    canvas.style('position: absolute');
    background(0,0,0,0);
    inputRatio = canvasHeight / (simulation.inputCount + 1);
    outputRatio = canvasHeight / (simulation.outputCount + 1);

    var inputSlider = document.getElementById("inputRange");
    var outputSlider = document.getElementById('outputRange');
    var inputLabel = document.getElementById("inputLabel");
    var outputLabel = document.getElementById("outputLabel");
    var speedSlider = document.getElementById("speedRange");
    var speedLabel = document.getElementById("speedLabel");
    var startButton = document.getElementById("startButton");
    var minCurrentSlider = document.getElementById("minCurrentRange");
    var minCurrentLabel = document.getElementById("minCurrentLabel");
    var maxCurrentSlider = document.getElementById("maxCurrentRange");
    var maxCurrentLabel = document.getElementById("maxCurrentLabel");
    var weightButton = document.getElementById("weightButton");
    var minWeightSlider = document.getElementById("minWeightRange");
    var minWeightLabel = document.getElementById("minWeightLabel");
    var maxWeightSlider = document.getElementById("maxWeightRange");
    var maxWeightLabel = document.getElementById("maxWeightLabel");
    var resetButton = document.getElementById("resetButton");

    inputSlider.value = simulation.inputCount;
    outputSlider.value = simulation.outputCount;
    speedSlider.value = timeStep;

    minCurrentSlider.value = minCurrent;
    maxCurrentSlider.value = maxCurrent;

    minWeightSlider.value = minWeight;
    maxWeightSlider.value = maxWeight;

    inputLabel.innerHTML = 'Input Neurons: ' + simulation.inputCount;
    outputLabel.innerHTML = 'Output Neurons: ' + simulation.outputCount;
    speedLabel.innerHTML = 'Timestep: ' + timeStep + 'ms';

    minCurrentLabel.innerHTML = 'Min. Input Current: ' + minCurrent;
    maxCurrentLabel.innerHTML = 'Max. Input Current: ' + maxCurrent;

    minWeightLabel.innerHTML = 'Min. Weight: ' + minWeight;
    maxWeightLabel.innerHTML = 'Max. Weight: ' + maxWeight;

    inputSlider.oninput = function(){
        simulation.setInputCount(parseInt(this.value,10));
        inputLabel.innerHTML = 'Input Neurons:  ' + simulation.inputCount;
        inputRatio = canvasHeight / (simulation.inputCount + 1);
        setupInputPlots();
    }

    outputSlider.oninput = function(){
        simulation.setOutputCount(parseInt(this.value));
        outputLabel.innerHTML = 'Output Neurons: ' + simulation.outputCount;
        outputRatio = canvasHeight / (simulation.outputCount + 1);
        setupOutputPlot();
    }

    speedSlider.oninput = function(){
        timeStep = parseInt(this.value);
        speedLabel.innerHTML = 'Timestep: ' + timeStep + 'ms';
        if(isRunning){
            clearInterval(runInterval)
            runInterval = setInterval(updateChart, timeStep);
        }
    }

    minCurrentSlider.oninput = function(){
        minCurrent = parseInt(this.value);
        minCurrentLabel.innerHTML = 'Min. Input Current: ' + minCurrent;
    }

    maxCurrentSlider.oninput = function(){
        maxCurrent = parseInt(this.value);
        maxCurrentLabel.innerHTML = 'Max. Input Current: ' + maxCurrent;
    }

    minWeightSlider.oninput = function(){
        minWeight = parseFloat(this.value);
        minWeightLabel.innerHTML = 'Min. Weight: ' + minWeight;
        simulation.inputNeurons.forEach(neuron => {
            neuron.setWeight(minWeight, maxWeight);
        });
        simulation.outputNeurons.forEach(neuron => {
            neuron.setWeight(minWeight,maxWeight);
        });
    }

    maxWeightSlider.oninput = function(){
        maxWeight = parseFloat(this.value);
        maxWeightLabel.innerHTML = 'Max. Weight: ' + maxWeight;
        simulation.inputNeurons.forEach(neuron => {
            neuron.setWeight(minWeight, maxWeight);
        });
        simulation.outputNeurons.forEach(neuron => {
            neuron.setWeight(minWeight,maxWeight);
        });

    }

    startButton.onclick = function(){
        isRunning = !isRunning;
        if(isRunning){
            runInterval = setInterval(updateChart, timeStep);
            startButton.innerHTML = 'Stop';
            startButton.className = 'btn btn-danger btn-lg'
        }else{
            clearInterval(runInterval);
            startButton.innerHTML = 'Start';
            startButton.className = 'btn btn-success btn-lg';
        }
    }

    weightButton.onclick = function(){
        simulation.inputNeurons.forEach(neuron => {
            neuron.setWeight(minWeight, maxWeight);
        });
        simulation.outputNeurons.forEach(neuron => {
            neuron.setWeight(minWeight,maxWeight);
        });
    }

    resetButton.onclick = function(){
        location.reload();
    }

}

var size = 70;
var inputPosition = 50;
var outputPosition = 350;

function renderInputNeuron(neuron, index){
    fill(color('#f6d55c'));
    noStroke();
    if(neuron.hasFired){
        fill(color(220,53,69));
    }
    circle(inputPosition,index * inputRatio + inputRatio,size);
    
    // NeuronText 
    fill(64);
    textSize(32);
    textAlign(CENTER, CENTER);
    text('I ' + index, inputPosition, index * inputRatio + inputRatio);

}

function renderLayerNeuron(neuron, index){
    fill(color('#3caea3'));
    if(neuron.hasFired){
        fill(color(220,53,69));
    }
    circle(outputPosition, index * outputRatio + outputRatio, size);

    // NeuronText 
    fill(64);
    textSize(32);
    textAlign(CENTER, CENTER);
    text('O ' + index, outputPosition, index * outputRatio + outputRatio);
}



function draw(){
    clear();
    background(255);
    drawConnections();
    drawWeights();
    simulation.inputNeurons.forEach(renderInputNeuron);
    simulation.outputNeurons.forEach(renderLayerNeuron);

}

function drawConnections(){
    for(var i = 0; i < simulation.inputCount; i++){
        for(var j = 0; j < simulation.outputCount; j++){
            stroke(180);
            strokeWeight(4);
            line(inputPosition, i * inputRatio + inputRatio, outputPosition, j * outputRatio + outputRatio);
            
        }
    }
}

function drawWeights(){
    for(var i = 0; i < simulation.inputCount; i++){
        for(var j = 0; j < simulation.outputCount; j++){
            let v1 = createVector(inputPosition, i * inputRatio + inputRatio);
            let v2 = createVector(outputPosition, j * outputRatio + outputRatio);
            let position;
            if(i % 2 == 0){
                position = v1.add((v2.sub(v1).mult(0.2)));
            }else{
                position = v1.add((v2.sub(v1).mult(0.8)));
            }
            position = position.add(createVector(0, 10));
            noStroke();
            textSize(22);
            textStyle(BOLD);
            fill(64);
            let weight = ((simulation.outputNeurons[j].weight + simulation.inputNeurons[i].weight)/2).toFixed(2);
            text(weight, position.x, position.y);
        }
    }
}

function updateChart(){
    simulation.update();

    var inputCurrentUpdate = [];
    var inputPotentialUpdate = [];
    for(var i = 0; i < simulation.inputCount; i++){
        var as = simulation.inputNeurons[i].as;
        var us = simulation.inputNeurons[i].us;
        inputCurrentUpdate.push(as);
        inputPotentialUpdate.push(us);
    }

    var asUpdate = {
        'y': inputCurrentUpdate
    };

    var usUpdate = {
        'y': inputPotentialUpdate
    };

    Plotly.restyle('InputCurrentPlot', asUpdate);
    Plotly.restyle('InputPotentialPlot', usUpdate);

    var us_update = [];
    for(var i = 0; i < simulation.outputCount; i++){
        var us = simulation.outputNeurons[i].us;
        us_update.push(us);
    }
    var update = {
        'y': us_update
    };

    Plotly.restyle('OutputPlot', update);
}