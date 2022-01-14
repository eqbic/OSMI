import {Light} from "./Light.js";

class SunLight extends Light{
    constructor(color, strength) {
        super(color, strength);
    }
}

export {SunLight};