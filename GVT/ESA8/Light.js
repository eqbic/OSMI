class Light {
    constructor(position, color, strength) {
        this._position = position;
        this._color = color;
        this._strength = strength;
    }

    set Position(position){
        this._position = position;
    }

    get Position(){
        return this._position;
    }

    set Color(color){
        this._color = color;
    }

    get Color(){
        return this._color;
    }

    set Strength(strength){
        this._strength;
    }

    get Strength(){
        return this._strength;
    }

    moveAlongCircle(angle) {
        let angle_rad = angle * Math.PI / 180;
        vec3.rotateY(this._position, this._position, [0.0, 0.0, 0.0], angle_rad);
    }
}