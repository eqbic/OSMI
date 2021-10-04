var circle = document.getElementById("circle");


var files_array = [];
var number_files = 24;
var angle_delta = 15;
var image_index = 0;
var run_animation = false;
var intervalId = null;

for (var i = 0; i < number_files; i++) {
    var angle = (i * angle_delta).toString();
    var image_name = 'img/circle_' + angle + '.png';
    files_array.push(image_name);
}

circle.src = files_array[image_index];

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
            run_animation = !run_animation;
            if (run_animation) {
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
    image_index = (number_files + image_index + direction) % number_files;
    circle.src = files_array[image_index];
}
