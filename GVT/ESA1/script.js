var circle = document.getElementById("circle");


var files = [];
var fileCount = 24;
var angleDelta = 15;
var imageIndex = 0;
var animationRunning = false;
var intervalId = null;
const image_path = 'img/circle/circle_';

for (var i = 0; i < fileCount; i++) {
    var angle = (i * angleDelta).toString();
    var image_name = image_path + angle + '.png';
    files.push(image_name);
}

circle.src = files[imageIndex];

document.addEventListener('keyup', (event) => {
    var name = event.key;

    switch (name) {
        case 'r':
            RotateCircle(1);
            break;
        case 'l':
            RotateCircle(-1);
            break;
        case 'a':
            animationRunning = !animationRunning;
            if (animationRunning) {
                console.log("start animation")
                intervalId = window.setInterval(function () {
                    RotateCircle(1);
                }, 100);

            }
            else {
                console.log("stop animation");
                clearInterval(intervalId);
            }
            break;
        default:
            break;
    }
}, false);

function RotateCircle(direction) {
    imageIndex = (fileCount + imageIndex + direction) % fileCount;
    circle.src = files[imageIndex];
}
