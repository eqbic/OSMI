class Vertex{
    #position;
    #normal;
    #texCoord;
    constructor(position, normal, texCoord){
        this.#position = position;
        this.#normal = normal;
        this.#texCoord = texCoord;
    }

    get Position(){
        return this.#position;
    }

    get Normal(){
        return this.#normal;
    }

    get TexCoord(){
        return this.#texCoord;
    }
}

export {Vertex};