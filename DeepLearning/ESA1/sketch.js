var mobilenet;

var currentImage;
var dropzone;
var dropzone_bg;
var dropzone;
var canvas;
var resultLabels = [];
var resultConfidences = [];
var aspectRatio;
var canvasWidth;
var canvasHeight;
var body;
var fileUpload;
var barChart;

var fakeWindow = document.getElementById('fakewindow');
var currentImageHack = document.getElementById('currentImage');

function setup(){
    initializeBarChart();

    options = {version: 1, alpha: 1.0, topk:6,};
    mobilenet = ml5.imageClassifier('MobileNet', options, modelReady);

    // Setup Canvas
    canvasWidth = document.getElementById('currentImage').offsetWidth;
    canvasHeight = document.getElementById('currentImage').offsetHeight;
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('#currentImage');
    background(0,0,0,0);

    currentImageDiv = select('#currentImage');
    dropzone_bg = select('.dropzone-bg');
    dropzone = select('#dropzone');
    //body = select('body');
    //body.dragOver(highlight);
    //body.dragLeave(unhighlight);
    canvas.drop(gotImage)

    // Setup file upload
    fileUpload = createFileInput(handleFile);
    fileUpload.addClass('form-control');
    fileUpload.id('customFile');
    fileUpload.parent('#uploadFile');
} 

window.addEventListener('dragenter', function(e) {
    showDropZone();
});

fakeWindow.addEventListener('dragleave', function(e) {
    hideDropZone();
});


function initializeBarChart(){
    var barChartCanvas = document.getElementById('results').getContext('2d');
    barChart = new Chart(barChartCanvas, {
    type: 'bar',
    
    data: {
        labels: [],
        datasets: [{
            label:'Confidence',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        
        legend:{display: false},
        scales: {
            yAxes: [{
                scaleLabel:{
                    display: true,
                    labelString: 'Confidence'
                },
                ticks: {
                    beginAtZero: true,
                    suggestedMax: 1,
                    fontSize: 24
                },
            }],
            xAxes:[{
                ticks:{
                    fontSize: 20
                }
            }]
        }
    }
});

}

function modelReady(){
    console.log('Model is ready!!!');
}

function showDropZone(){
    dropzone.style('display', 'block');
    fakeWindow.style.display = 'block';
    currentImageHack.style.opacity = 0.2;
}

function hideDropZone(){
    if(currentImage != null){
        dropzone.style('display', 'none');
        currentImageHack.style.opacity = 1;
    }
    fakeWindow.style.display = 'none';
}

function handleFile(file){
    if(file.type == 'image'){
        currentImage = createImg(file.data, displayImage);
        currentImage.hide();
    }else{
        alert('Only images are supported!');

    }
}

function selectImage(image){
    currentImage = createImg(image.src, displayImage);
    currentImage.hide();
}

function updateChart(chart, label, data){
    chart.data.labels = label;
    chart.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });
    chart.update();
}

function gotResult(error, result){
    if(error){
        console.error(error);
    }else{
        console.log(result)
        resultLabels = [];
        resultConfidences = [];
        console.log(resultLabels);
        for(var i = 0; i < result.length; i++){
            resultLabels.push(result[i].label.split(',')[0]);
            resultConfidences.push(result[i].confidence);
            console.log(resultConfidences[i]);
        }
        updateChart(barChart, resultLabels, resultConfidences);
    }
}

function displayImage(error, result){
    clear();
    hideDropZone();
    imageMode(CENTER);
    if(currentImage.width >= currentImage.height){
        aspectRatio = currentImage.width/width;
        image(currentImage, 0.5*width, 0.5*height, width, currentImage.height/aspectRatio);
    }else{
        aspectRatio = currentImage.height/height;
        image(currentImage, 0.5*width, 0.5*height, currentImage.width/aspectRatio,height);
    }
    mobilenet.classify(currentImage, gotResult);
}


function highlight(){
    console.log('highlight');
    dropzone_bg.style('background-color', '#2E3238');
}

function unhighlight(){
    console.log('unhighlight');
    dropzone_bg.style('background-color', '#454A54');
}

function gotImage(file){
    console.log(file.type)
    if(file.type != 'image'){
        clear();
        updateChart(barChart, [], []);
        alert('Only images are supported!');
        return;
    }

    currentImage = createImg(file.data, displayImage);
    currentImage.hide();
}



