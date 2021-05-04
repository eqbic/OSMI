async function learnLinear(){
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));

    model.compile({
        loss: 'meanSquaredError',
        optimizer: 'sgd'
    });

    // Training data
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

    await model.fit(xs, ys, {epochs: 2000});
    tf.print(model.predict(tf.tensor2d([5], [1, 1])));
}

var elem = document.getElementById("testplot");
    let t = 0.0;
    let dt = 1.0 / 200.00
    let v = -50.0;
    let V_0 = -60.0;
    let tau = 2.0;
    let vs = [];
    let ts = [];
    let V_treshold = 20.0;
    let spike_times = [];

    while(t < 70.0){
        vs.push(v);
        ts.push(t);
        let dv = - (v - V_0) / tau;
        if(t > 20.0 && t < 45.0){
            dv += 50.0;
        }
        v += dv * dt;

        if(v >= V_treshold){
            //SPIKE
            spike_times.push(t);
            v = V_0;
        }

        t += dt;
    }

    var trace1 = {
        x: ts,
        y: vs,
        type: 'scatter'
      };
      
      
      
      var data = [trace1];
      

      Plotly.newPlot(elem, data);