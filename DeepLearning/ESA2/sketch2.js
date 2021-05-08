function setup(){
    
    let I_in = [];
    let v_out = [];
    let T = 1000;
    let dt = 0.5;
    let range = n => [...Array(n).keys()];
    let steps = range(int(T/dt));
    let neurons = new SimpleNeurons(1);
    let i_in;
    let feed = {};
    steps.forEach(step => {
        let t = step * dt;
        if(t > 200 && t < 700){
            i_in = 7.0;
        }else{
            i_in = 0.0;
        }

        feed[neurons.I] = new Array(1).fill(i_in);
        feed[neurons.dt] = [dt];

        
        
    });
}

// A class representing a population of simple neurons

class SimpleNeurons{

    constructor(n=1, A = null, B = null, C = null, D = null){
        //////////////////////
        // Model parameters //
        //////////////////////

        // The number of neurons
        this.n = n;

        // Scale of the membrane recovery (lower values lead to slow recovery)
        if(A == null){
            this.A = new Array(n).fill(0.02);
        }else{
            this.A = A;
        }

        // Sensitivity of recovery towards membrane potential (higher values lead to higher firing rate)
        if(B == null){
            this.B = new Array(n).fill(0.2);
        }else{
            this.B = B;
        }

        // Membrane voltage reset Value
        if(C == null){
            this.C = new Array(n).fill(-65.0);
        }else{
            this.C = C;
        }

        // Membrane recovery boost after a spike
        if(D == null){
            this.D = new Array(n).fill(8.0);
        }else{
            this.D = D;
        }

        // Spiking threshold
        this.SPIKING_THRESHOLD = 35.0;
        // Resting potential
        this.RESTING_POTENTIAL = -70.0;

        // Instantiate a specific tensorflow graph for the Neuron Model
        this.graph = tf.sequential();

        //////////////////////////////////
        // Build the neuron model graph //
        //////////////////////////////////

        this.get_vars_and_ph();
        let response_result = this.get_response_ops();
        this.potential = response_result[0];
        this.recovery = response_result[1];
    
    }

    // Define the graph variables and placeholders
    get_vars_and_ph(){

        // Membrane potential
        // All neurons start at the resting potential
        this.v = tf.variable(tf.tensor(this.RESTING_POTENTIAL, [this.n]), 'v');

        // Membrane recovery
        // all neurons start with a value of B * C
        this.u = tf.variable(tf.tensor([this.B * this.C]), 'u');

        // We need a placeholder to pass the input current
        this.I = tf.tensor([0],[this.n]);

        // We also need a placeholder to pass the length of the time interval
        this.dt = tf.scalar(0);
    }

    get_response_ops(){
        let reset_result = this.get_reset_ops();
        let has_fired_op = reset_result[0];
        let v_reset_op = reset_result[1];
        let u_reset_op = reset_result[2];

        let i_op = this.get_input_ops(has_fired_op, v_reset_op);

        let update_result = this.get_update_ops(has_fired_op, v_reset_op, u_reset_op, i_op);
        return update_result;
    }

    get_reset_ops(){
        
        // evaluate which neurons have reached the spiking threshold
        let has_fired_op = tf.greaterEqual(this.v, tf.tensor([this.SPIKING_THRESHOLD], [this.n]));

        // Neurons that have spiked must be reset, others simply evolve from their initial value
        
        // Membrane potential is reset to C
        let v_reset_op = tf.where(has_fired_op, this.C, this.v);
        
        // Membrane recovery is incresed by D
        let u_reset_op = tf.where(has_fired_op, tf.add(this.u, this.D), this.u);

        return [has_fired_op, v_reset_op, u_reset_op];
    }

    get_input_ops(has_fired_op, v__op){
        return tf.add(this.I, 0.0);
    }

    get_update_ops(has_fired_op, v_reset_op, u_reset_op, i_op){
        // Evaluate membrane potential increment for the considered time interval
        // dv = 0 if the neuron fired, dv = 0.04v*v + 5v + 140 + I - u otherwise

        let dv_op = tf.where(has_fired_op, tf.zeros([this.n]), tf.sub(tf.addN([tf.mul(tf.square(v_reset_op), 0.04), tf.mul(v_reset_op, 5.0), tf.tensor([140.0], [this.n]), i_op]), this.u));

        // Evaluate membrane recovery decrement for the considered time interval
        // du = 0 if the neuron fired, du = a*(b*v-u) otherwise

        let du_op = tf.where(has_fired_op, tf.zeros([this.n]), tf.mul(this.A, tf.sub(tf.mul(this.B, v_reset_op), u_reset_op)));

        // Increment membrane potential and clamp it to the spiking threshold
        // v += dv * dt
        
        let v_op = this.v.assign(tf.minimum(tf.tensor([this.SPIKING_THRESHOLD], [this.n]), tf.add(v_reset_op, tf.mul(dv_op, this.dt))));

        // Decrease membrane recovery
        let u_op = this.u.assign(tf.add(u_reset_op, tf.mul(du_op, this.dt)));
        return [v_op, u_op];
    }

}