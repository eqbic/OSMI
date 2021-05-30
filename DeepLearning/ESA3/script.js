function getRandomNumber(range){
    const randomNumber = (Math.random() * range) - (range * 0.5);
    return randomNumber;
}

function calculateFunctionResult(x){
    return (x+0.8)*(x-0.2)*(x-0.3)*(x-0.6);
}

function getData(amount, range){
    let data = [];
    for(var i = 0; i < amount; i++){
        let randomX = getRandomNumber(range);
        let randomY = calculateFunctionResult(randomX);
        data.push({x: randomX, y: randomY});
    }
    
    return data;
}

var amountTrainData = 100;
var rangeTrainData = 2;
var amountLayers = 2;
var data;
var model;
var activationFunction = 'relu';
var amountEpochs = 50;
var optimizer = 'adam';
var learnRate = 0.01;
var xInput = 0;
var tensorData;

function setup(){

  // Create the model
  model = createModel(amountLayers, activationFunction);
  tfvis.show.modelSummary(
    document.getElementById('modelData'), 
    model
  );

  const numberSlider = document.getElementById('numberTrainData');
  const numberLabel = document.getElementById('numberTrainDataLabel');
  const xRangeSlider = document.getElementById('xRange');
  const xRangeLabel = document.getElementById('xRangeLabel');
  const layersSlider = document.getElementById('numberLayers');
  const layersLabel = document.getElementById('numberLayersLabel');
  const activationSelection = document.getElementById('activationFunction');
  const epochSlider = document.getElementById('numberEpochs');
  const epochLabel = document.getElementById('numberEpochsLabel');
  const optimizerSelection = document.getElementById('optimizer');
  const learnRateSlider = document.getElementById('learnRate');
  const learnRateLabel = document.getElementById('learnRateLabel');
 

  activationSelection.value = activationFunction;

  const runButton = document.getElementById('runButton');

  data = getData(amountTrainData, rangeTrainData);
  tensorData = convertToTensor(data);
  renderTrainDataPlot();


  learnRateSlider.value = learnRate;
  learnRateLabel.innerHTML = "Learnrate: " + learnRate;

  epochSlider.value = amountEpochs;
  epochLabel.innerHTML = "Amount of Epochs: " + amountEpochs;

  layersSlider.value = amountLayers;
  layersLabel.innerHTML = "Amount of hidden Layers: " + amountLayers;

  numberSlider.value = amountTrainData;
  numberLabel.innerHTML = "Amount of training data: " + amountTrainData;
  
  xRangeSlider.value = rangeTrainData;
  xRangeLabel.innerHTML = "Range of x values: " + rangeTrainData;

  
  optimizerSelection.value = optimizer;
  optimizerSelection.oninput = function(){
    optimizer = optimizerSelection.value;
  }

  learnRateSlider.oninput = function(){
    learnRate = parseFloat(learnRateSlider.value);
    learnRateLabel.innerHTML = "Learnrate: " + learnRate;
  }

  activationSelection.oninput = function(){
    activationFunction = activationSelection.value;
    model.layers.forEach(layer => {
      layer.dispose()
    });
    model = createModel(amountLayers, activationFunction);
    tfvis.show.modelSummary(
      document.getElementById('modelData'), 
      model
    );
  }


  runButton.onclick = function(){
    run(model, amountEpochs, optimizer, learnRate);
  }

  epochSlider.oninput = function(){
    amountEpochs = parseInt(epochSlider.value);
    epochLabel.innerHTML = "Amount of Epochs: " + amountEpochs;
  }

  layersSlider.oninput = function(){
    amountLayers = parseInt(layersSlider.value);
    layersLabel.innerHTML = "Amount of hidden Layers: " + amountLayers;
    model.layers.forEach(layer => {
      layer.dispose()
    });
    model = createModel(amountLayers, activationFunction);
    tfvis.show.modelSummary(
      document.getElementById('modelData'), 
      model
    );
  }

  numberSlider.oninput = function(){
    amountTrainData = parseInt(numberSlider.value);
    numberLabel.innerHTML = "Amount of training data: " + amountTrainData;
    data = getData(amountTrainData, rangeTrainData);
    tensorData = convertToTensor(data);
    renderTrainDataPlot();
  }

  xRangeSlider.oninput = function(){
    rangeTrainData = parseFloat(xRangeSlider.value);
    xRangeLabel.innerHTML = "Range of x values: " + rangeTrainData;
    data = getData(amountTrainData, rangeTrainData);
    tensorData = convertToTensor(data);
    renderTrainDataPlot();
  }

  

}

function renderTrainDataPlot(){
  const values = data.map(d => ({
    x: d.x,
    y: d.y,
}));

tfvis.render.scatterplot(
    document.getElementById('inputDataPlot'),
    {values},
    {
        xLabel: 'x',
        yLabel: 'y',
        height: 600
    }
);
}

async function run(currentModel, numberEpochs, currentOptimizer, currentLearnRate){
  // Convert the data to a form we can use for training.
  
  const {inputs, labels} = tensorData;

  // Train the model
  await trainModel(currentModel, inputs, labels, numberEpochs, currentOptimizer, currentLearnRate);
  console.log('Done Training');

  // Make some predictions using the model and compare them to the
  // original data
  testModel(currentModel, data, tensorData);
}

function createModel(amountLayer, activationFunction) {
    // Create a sequential model
    const model = tf.sequential();

    // // Add a single input layer
    model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
    for(let i = 0; i < amountLayer; i++){
      model.add(tf.layers.dense({units: 50, activation: activationFunction}));
    }

    // Add an output layer
    model.add(tf.layers.dense({units: 1}));
  
    return model;
  }

  /**
 * Convert the input data to tensors that we can use for machine
 * learning. We will also do the important best practices of _shuffling_
 * the data and _normalizing_ the data
 * MPG on the y-axis.
 */
function convertToTensor(data) {
    // Wrapping these calculations in a tidy will dispose any
    // intermediate tensors.
  
    return tf.tidy(() => {
      // Step 1. Shuffle the data
      tf.util.shuffle(data);
  
      // Step 2. Convert data to Tensor
      const inputs = data.map(d => d.x)
      const labels = data.map(d => d.y);
  
      const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
      const labelTensor = tf.tensor2d(labels, [labels.length, 1]);
  
      //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
      const inputMax = inputTensor.max();
      const inputMin = inputTensor.min();
      const labelMax = labelTensor.max();
      const labelMin = labelTensor.min();
  
      const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
      const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));
  
      return {
        inputs: normalizedInputs,
        labels: normalizedLabels,
        // Return the min/max bounds so we can use them later.
        inputMax,
        inputMin,
        labelMax,
        labelMin,
      }
    });
  }

async function trainModel(currentModel, inputs, labels, numberEpochs, currentOptimizer, currentLearnRate) {
    // Prepare the model for training.

    let opti;
    switch(currentOptimizer){
      case 'sgd':
        opti = tf.train.sgd(currentLearnRate);
        break;
      case 'adam':
        opti = tf.train.adam(currentLearnRate);
        break;
      case 'momentum':
        opti = tf.train.momentum(currentLearnRate);
        break;
      case 'adagrad':
        opti = tf.train.adagrad(currentLearnRate);
        break;
      case 'adadelta':
        opti = tf.train.adadelta(currentLearnRate);
        break;
      case 'adamax':
        opti = tf.train.adamax(currentLearnRate);
        break;
      default:
        opti = tf.train.adam(currentLearnRate);

    }
    console.log(opti);
    currentModel.compile({
        optimizer: opti,
        loss: tf.losses.meanSquaredError,
        metrics: ['mse'],
    });
    const batchSize = 32;
    const epochs = numberEpochs;


    return await currentModel.fit(inputs, labels, {
        batchSize,
        epochs,
        shuffle: true,
        callbacks: tfvis.show.fitCallbacks(
        document.getElementById('trainDataPlot'),
        ['loss', 'mse'],
        { height: 200, callbacks: ['onEpochEnd'] }
        )
    });
}

function testModel(currentModel, inputData, normalizationData) {
    const {inputMax, inputMin, labelMin, labelMax} = normalizationData;
  
    // Generate predictions for a uniform range of numbers between 0 and 1;
    // We un-normalize the data by doing the inverse of the min-max scaling
    // that we did earlier.
    const [xs, preds] = tf.tidy(() => {
  
      const xs = tf.linspace(0, 1, 100);
      const preds = currentModel.predict(xs.reshape([100, 1]));
  
      const unNormXs = xs
        .mul(inputMax.sub(inputMin))
        .add(inputMin);
  
      const unNormPreds = preds
        .mul(labelMax.sub(labelMin))
        .add(labelMin);
  
      // Un-normalize the data
      return [unNormXs.dataSync(), unNormPreds.dataSync()];
    });
  
  
    const predictedPoints = Array.from(xs).map((val, i) => {
      return {x: val, y: preds[i]}
    });
  
    const originalPoints = inputData.map(d => ({
      x: d.x, y: d.y,
    }));
  
  
    tfvis.render.scatterplot(
      document.getElementById('resultPlot'),
      {values: [originalPoints, predictedPoints], series: ['original', 'predicted']},
      {
        xLabel: 'x',
        yLabel: 'y',
        height: 500
      }
    );
  }

// document.addEventListener('DOMContentLoaded', run);