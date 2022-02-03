import {Entity} from "../../Core/Entity.js";

class LightType{
    constructor() {
    }

    static Point = 0;
    static Directional = 1;
}

class Light extends Entity{
    #type;
    #color;
    #strength;

    constructor(type,color, strength) {
        super();
        this.#type = type;
        this.#color = color;
        this.#strength = strength;
    }

    set Color(color){
        this.#color = color;
    }

    get Color(){
        return this.#color;
    }

    set Strength(strength){
        this.#strength = strength;
    }

    get Strength(){
        return this.#strength;
    }

    get Type(){
        return this.#type;
    }
}

export {Light};
export {LightType};