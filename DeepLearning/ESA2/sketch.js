class LIFNeuron{
    constructor(u_rest = 0, u_threshold = 1, tau_rest = 4.0, r = 1.0, tau = 10.0){
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

        this.hasFired = false;
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
    
}



class Simulation{
    constructor(start_time = 0.0, duration = 200.0, dt = 1, numberNeurons = 2){
        
        this.start_time = start_time;
        this.duration = duration;
        this.dt = dt;
        

        this.us = [];
        this.ts = [];
        this.as = [];
        this.threshold = []

        this.spike_times = [];
        this.voltage = 0.0;
        this.I_input = 0.0;
        this.inputNeurons = [];
        this.time = 0.0;

        for(var i = 0; i < numberNeurons; i++){
            var neuron = new LIFNeuron();
            this.inputNeurons.push(neuron);
        }
    }

    update(){
        
        if(this.ts.length > this.duration){
            this.ts.shift();
            this.as.shift();
            this.us.shift();
        }
        this.ts.push(this.time);
        
        this.simulateStep(this.time);
        
        this.time += this.dt;
    }

    simulateStep(time){
        this.as.push(this.I_input);
        this.us.push(this.voltage);
        this.setRandomCurrent(time);
        this.inputNeurons.forEach(neuron => {
            this.simulateNeuron(neuron);
        });
    }

    simulateNeuron(neuron){
        neuron.i_input = this.I_input;
        neuron.dt = this.dt;
        neuron.get_potential_op();
        this.voltage = neuron.potential;
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
        this.I_input = this.randn_bm(-1,3,1);
    }
}

var simulation = new Simulation();;
var neurons = [];

var canvas;
var canvasWidth;
var canvasHeight;

function setup(){
    
    // PLOTS
    var current = [{
        x: simulation.ts,
        y: simulation.as,
        type: 'scatter'
    }];

    var potential = [{
        x: simulation.ts,
        y: simulation.us,
        type: 'scatter'
    }];

    var layout = {
        autosize: false,
        width: 300,
        height: 300
    };
    
    Plotly.newPlot('CurrentPlotOne', [current], layout);
    Plotly.newPlot('PotentialPlotOne', [potential], layout);
    Plotly.newPlot('CurrentPlotTwo', [current], layout);
    Plotly.newPlot('PotentialPlotTwo', [potential], layout);

    // CANVAS
     // Setup Canvas
     canvasWidth = document.getElementById('canvas').offsetWidth;
     canvasHeight = document.getElementById('canvas').offsetHeight;
     canvas = createCanvas(canvasWidth, canvasHeight);
     canvas.parent('#canvas');
     background(0,0,0,0);
     console.log(neurons);
}

function animateInputNeurons(neuron, index){
    circle(90,index * 400 + 90,80);
    fill(color(240,220,10));
    if(neuron.hasFired){
        fill(color(250,20,20));
    }
}

function draw(){
    clear();
    background(222);
    simulation.inputNeurons.forEach(animateInputNeurons);
}


function updateChart(){
    simulation.update();

    Plotly.restyle('CurrentPlotOne', 'y', [simulation.as]);
    Plotly.restyle('PotentialPlotOne', 'y', [simulation.us]);
    Plotly.restyle('CurrentPlotTwo', 'y', [simulation.as]);
    Plotly.restyle('PotentialPlotTwo', 'y', [simulation.us]);
}
//setInterval(updateChart, 100);