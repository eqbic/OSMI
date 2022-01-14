class Canvas{
    #id;
    #parent;
    #gl;
    #width;
    #height;
    constructor(id, parent, width, height) {

        this.#id = id;
        this.#parent = parent;
        this.#width = width;
        this.#height = height;

        let divWrapper = document.createElement('div');
        let canvasElem = document.createElement('canvas');
        this.#parent.appendChild(divWrapper);
        divWrapper.appendChild(canvasElem);

        divWrapper.id = this.#id;
        canvasElem.width = this.#width;
        canvasElem.height = this.#height;

        /** @type {WebGL2RenderingContext} */
        this.#gl = canvasElem.getContext('webgl2');
    }

    get Height(){
        return this.#height;
    }

    get Width(){
        return this.#width;
    }

    get GL(){
        return this.#gl;
    }
}

export {Canvas};