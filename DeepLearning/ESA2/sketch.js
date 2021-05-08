class LIFNeuron{
    constructor(u_rest = 0.0, u_threshold = 1.0, tau_rest = 4.0, r = 1.0, tau = 10.0){
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
    }
}

class Simulation{
    constructor(start_time = 0.0, duration = 70.0, time_step = 0.01, u_start = -50.0, u_0 = -60.0){
        this.start_time = start_time;
        this.duration = duration;
        this.time_step = time_step;
        this.u_start = u_start;
        this.u_0 = u_0;

        this.us = [];
        this.ts = [];
        this.spike_times = [];
        this.current_u = u_start;
    }

    simulate(){
        while(time < this.duration){
            this.ts.push(time);
            this.us.push(this.current_u);
        }
    }
}

function setup(){
    console.log('start');

    var elem = document.getElementById("testplot");
    var t = 0.0;
    var dt = 1.0 / 200.0;

}