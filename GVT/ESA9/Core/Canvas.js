class Canvas{
    #id;
    #parent;
    #gl;
    #width;
    #height;
    #canvas;

    constructor(id, parent) {
        this.#id = id;
        this.#parent = parent;
        this.#width = parent.clientWidth;
        this.#height = parent.clientHeight;

        let divWrapper = document.createElement('div');
        this.#canvas = document.createElement('canvas');
        this.#parent.appendChild(divWrapper);
        divWrapper.appendChild(this.#canvas);

        divWrapper.id = this.#id;
        this.#canvas.width = this.#width;
        this.#canvas.height = this.#height;

        /** @type {WebGL2RenderingContext} */
        this.#gl = this.#canvas.getContext('webgl2');
    }

    get GL(){
        return this.#gl;
    }
}

export {Canvas};
