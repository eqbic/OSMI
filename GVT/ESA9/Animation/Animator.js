const vec3 = glMatrix.vec3;

class Animator{
    rotateAroundY(position, angle, point){
        let angle_rad = angle * Math.PI / 180.0;
        let newPos = vec3.create();
        vec3.rotateY(newPos, position, point, angle_rad);
        return newPos;
    }
}

export {Animator};