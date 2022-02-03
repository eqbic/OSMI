const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;
const quat = glMatrix.quat;

class Entity{
    _Transformation;
    constructor() {
        this._Transformation = mat4.create();
    }

    translate(direction){
        mat4.translate(this._Transformation, this._Transformation, direction);
    }

    resetTransform(){
        this._Transformation = mat4.create();
    }

    rotate(rotation){
        const quaternion = quat.create();
        const rot = mat4.create();
        quat.fromEuler(quaternion, rotation[0], rotation[1], rotation[2]);
        mat4.fromQuat(rot, quaternion);
        mat4.multiply(this._Transformation, this._Transformation, rot);
    }

    scale(scale){
        mat4.scale(this._Transformation, this._Transformation, scale);
    }

    uniformscale(factor){
        this.scale([factor, factor, factor]);
    }

    transform(scale, rotation, translation){
        this.scale(scale);
        this.rotate(rotation);
        this.translate(translation);
    }

    get Transformation(){
        return this._Transformation;
    }

    set Position(position){
        this._Transformation[12] = position[0];
        this._Transformation[13] = position[1];
        this._Transformation[14] = position[2];
    }

    get Position(){
        let position = vec3.create();
        mat4.getTranslation(position, this._Transformation);
        return position;
    }

    get Rotation(){
        let rotation = quat.create();
        mat4.getRotation(rotation, this._Transformation);
        return rotation;
    }

    get Scale(){
        let scale = vec3.create();
        mat4.getScaling(scale, this._Transformation);
        return scale;
    }

}

export {Entity};