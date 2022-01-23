import {Light, LightType} from "./Light.js";

class PointLight extends Light{
    constructor(color, strength) {
        super(LightType.Point, color, strength);
    }
}
export {PointLight};