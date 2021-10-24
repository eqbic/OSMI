var parent = document.getElementById('windmill');

var circle = new Image(512,512);
circle.src = 'img/rad/rad_0.png';

parent.appendChild(circle);

var files = [];
var fileCount = 90;
var angleDelta = 360 / fileCount;
var imageIndex = 0;
var animationRunning = false;
var intervalId = null;
const image_path = 'img/rad/rad_';

for (var i = 0; i < fileCount; i++) {
    var angle = (i * angleDelta).toString();
    var image_name = image_path + angle + '.png';
    var image = new Image();
    image.src = image_name;
    files.push(image);
}

// workaround for flickering bug
for (var i = 0; i < fileCount; i++){
    RotateCircle(1);
}



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
                }, 8);

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
    let child = parent.children[1];
    imageIndex = (fileCount + imageIndex + direction) % fileCount;
    parent.replaceChild(files[imageIndex], child);
}
