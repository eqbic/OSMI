class LIFNeuron{
    constructor(u_rest = 0, u_threshold = 1, tau_rest = 4.0, r = 1.0, tau = 10.0, duration = 50.0){
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



class Simulation{
    constructor(start_time = 0.0, duration = 50.0, dt = 1, numberInputNeurons = 2, numberLayerNeurons = 3){
        
        this.start_time = start_time;
        this.duration = duration;
        this.dt = dt;
        
        this.ts = [];

        this.spike_times = [];
        this.voltage = 0.0;
        this.I_input = 0.0;


        this.inputNeurons = [];
        this.layerNeurons = [];

        this.time = 0.0;

        for(var i = 0; i < numberInputNeurons; i++){
            var inputNeuron = new LIFNeuron();
            this.inputNeurons.push(inputNeuron);
        }

        for(var i = 0; i < numberLayerNeurons; i++){
            var layerNeuron = new LIFNeuron();
            this.layerNeurons.push(layerNeuron);
        }
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
            this.simulateNeuron(neuron);
            neuron.update();
        });
    }

    simulateNeuron(neuron){
        neuron.i_input = this.setRandomCurrent();
        neuron.dt = this.dt;
        neuron.get_potential_op();
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
    
    randn_bm(min, max, skew) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random()
        let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
        
        num = num / 10.0 + 0.5 // Translate to 0 -> 1
        if (num > 1 || num < 0) 
          num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
        
        else{
          num = Math.pow(num, skew) // Skew
          num *= max - min // Stretch to fill range
          num += min // offset to min
        }
        return num
      }

    setRandomCurrent(){
        var num = this.randn_bm(-1,3,1);
        return num;
    }
}

var simulation = new Simulation();
var neurons = [];

var canvas;
var canvasWidth;
var canvasHeight;

function setup(){
    
    // PLOTS
    var current = [{
        x: simulation.inputNeurons[0].ts,
        y: simulation.inputNeurons[0].as,
        mode: 'lines',
        type: 'scatter'
    }];

    var potential = [{
        x: simulation.inputNeurons[1].ts,
        y: simulation.inputNeurons[1].us,
        mode: 'lines',
        type: 'scatter'
    }];

    var current_layout = {
        xaxis:{
            title: {
                text: 'Time'
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
    
    Plotly.newPlot('CurrentPlotOne', [current],current_layout);
    Plotly.newPlot('PotentialPlotOne', [potential], potential_layout);
    Plotly.newPlot('CurrentPlotTwo', [current],current_layout);
    Plotly.newPlot('PotentialPlotTwo', [potential], potential_layout);

    // CANVAS
     // Setup Canvas
     canvasWidth = document.getElementById('canvas').offsetWidth;
     canvasHeight = document.getElementById('canvas').offsetHeight;
     canvas = createCanvas(canvasWidth, canvasHeight);
     canvas.parent('#canvas');
     background(0,0,0,0);
}

function renderInputNeuron(neuron, index){
    fill(color(240,220,10));
    if(neuron.hasFired){
        fill(color(250,20,20));
    }
    circle(90,index * 200 + 200,80);
}

function renderLayerNeuron(neuron, index){
    fill(color(100,220,50));
    if(neuron.hasFired){
        fill(color(250,20,20));
    }
    circle(300, index * 150 + 150, 80);
}

function draw(){
    clear();
    background(222);
    drawConnections();
    simulation.inputNeurons.forEach(renderInputNeuron);
    simulation.layerNeurons.forEach(renderLayerNeuron);

}

function drawConnections(){
    for(var i = 0; i < simulation.inputNeurons.length; i++){
        for(var j = 0; j < simulation.layerNeurons.length; j++){
            line(90, i * 200 + 200, 300, j * 150 + 150);
        }
    }
}

function updateChart(){
    simulation.update();

    Plotly.restyle('CurrentPlotOne', 'y', [simulation.inputNeurons[0].as]);
    Plotly.restyle('PotentialPlotOne', 'y', [simulation.inputNeurons[0].us]);
    Plotly.restyle('CurrentPlotTwo', 'y', [simulation.inputNeurons[1].as]);
    Plotly.restyle('PotentialPlotTwo', 'y', [simulation.inputNeurons[1].us]);
}

setInterval(updateChart, 100);