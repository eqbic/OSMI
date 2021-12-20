class PointLight extends Entity{
    #color;
    #strength;

    constructor(color, strength) {
        super();
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


}