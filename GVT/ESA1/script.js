var parent = document.getElementById('windmill');

var circle = new Image(512, 512);
circle.src = 'img/rad/rad_0.png';

parent.appendChild(circle);

var files = [];
var fileCount = 90;
var angleDelta = 360 / fileCount;
var imageIndex = 0;
var animationRunning = false;
var intervalId = null;
const image_path = 'img/rad/rad_';



// workaround for flickering bug
// for (var i = 0; i < fileCount; i++){
//     RotateCircle(1);
// }

window.onload = function () {
    for (var i = 0; i < fileCount; i++) {
        let angle = (i * angleDelta).toString();
        let image_name = image_path + angle + '.png';
        let image = new Image(512, 512);
        image.src = image_name;
        files.push(image);
    }

    // workaround for flickering bug
    for (var i = 0; i < fileCount; i++) {
        RotateCircle(1);
    }
};

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
    var child = parent.children[1];
    imageIndex = (fileCount + imageIndex + direction) % fileCount;
    parent.replaceChild(files[imageIndex], child);
}
