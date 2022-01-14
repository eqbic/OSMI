import {Light} from "./Light.js";

class PointLight extends Light{
    constructor(color, strength) {
        super(color, strength);
    }
}
export {PointLight};