import {Light, LightType} from "./Light.js";

class DirectionalLight extends Light{
    constructor(color, strength) {
        super(LightType.Directional, color, strength);
    }
}

export {DirectionalLight};