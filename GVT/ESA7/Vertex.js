class Vertex{
    constructor(position, normal){
        this._position = position;
        this._normal = normal;
    }

    get position(){
        return this._position;
    }

    get normal(){
        return this._normal;
    }
}
