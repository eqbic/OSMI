class LIFNeuron{
    constructor(u_rest = 0.0, u_threshold = 1.0, tau_rest = 1.0, r = 1.0, tau = 10.0){
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
    }

    get_integrating_op(){
        var du_op = (this.r * this.i_input - this.potential) / this.tau;
        this.potential = this.potential + (du_op * this.dt);
        this.t_rest = 0.0;
    }

    get_firing_op(){
        this.potential = this.u_rest;
        this.t_rest = this.tau_rest;
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
                console.log("RESTING!");
                this.get_resting_op();
            }
            if(this.potential > this.u_threshold)
            {
                console.log("FIRE!");
                this.get_firing_op();
            }
        }else{
            console.log("INTEGRATING");
            this.get_integrating_op();
        }
    }
    
}

class Simulation{
    constructor(start_time = 0.0, duration = 200.0, time_step = 1){
        
        this.start_time = start_time;
        this.duration = duration;
        this.time_step = time_step;
        

        this.us = [];
        this.ts = [];
        this.as = [];
        this.threshold = []

        this.spike_times = [];
        this.voltage = 0.0;
        this.I_input = 0.0;
        
    }

    simulate(){
        let time = 0.0;
        var neuron = new LIFNeuron();

        while(time < this.duration){
            this.ts.push(time);
            this.as.push(this.I_input);
            this.us.push(this.voltage);
            this.threshold.push(neuron.u_threshold);

            this.setRandomCurrent(time);
            this.simulateNeuron(neuron, this.time_step, this.I_input);

            time += this.time_step;
        }

    }

    simulateNeuron(neuron, timestep, current){
        neuron.i_input = current;
        neuron.dt = timestep;
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

    setRandomCurrent(time){
        if(time > 10 && time < 180){
            this.I_input = this.randn_bm(-1,3,1);
        }else{
            this.I_input = 0.0;
        }
    }
}

function setup(){
    console.log('start');

    var currentPlot = document.getElementById("CurrentPlot");
    var potentialPlot = document.getElementById("PotentialPlot");

    var simulation = new Simulation();
    simulation.simulate();
    //simulation.setCurrent();
    var trace_potential = {
        x: simulation.ts,
        y: simulation.us,
        type: 'scatter',
        name: 'Membrane Potential'
    };

    var trace_current = {
        x: simulation.ts,
        y: simulation.as,
        type: 'scatter'
    };

    var trace_threshold = {
        x: simulation.ts,
        y: simulation.threshold,
        type: 'scatter',
        name: 'Membrane Threshold'
    };

    var layout_potential = {
        xaxis:{
            title: { text: 'Time (in ms)' }
        },
        yaxis: 
            { title:{ text: 'Membrane Potential (in mV)'}
        }
    }

    var layout_current = {
        xaxis:{
            title: { text: 'Time (in ms)' }
        },
        yaxis: 
            { title:{ text: 'Current (mA)'}
        }
    }

    var data_current = [trace_current];
    var data_potential = [trace_potential, trace_threshold];


    Plotly.newPlot(currentPlot, data_current, layout_current);
    Plotly.newPlot(potentialPlot, data_potential, layout_potential);

}