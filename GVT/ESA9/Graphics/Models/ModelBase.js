import {Entity} from "../../Core/Entity.js";
let gl;
class ModelBase extends Entity{
    #material;
    #mesh;
    constructor(glContext, mesh, material) {
        super();
        gl = glContext;
        this.#mesh = mesh;
        this.#material = material;
    }

    draw(scene){
        const shader = this.#material.Shader;
        const camera = scene.Camera;
        shader.use();
        gl.bindTexture(gl.TEXTURE_2D, this.#material.ColorTexture);

        scene.Lights.forEach((light, index) => {
            shader.setInt(`lights[${index}].type`, light.Type);
            shader.setVec3(`lights[${index}].position`, light.Position);
            shader.setVec3(`lights[${index}].color`, light.Color);
            shader.setFloat(`lights[${index}].strength`, light.Strength);
        });

        shader.setMat4("uProjection", camera.Projection);
        shader.setMat4("uView", camera.InverseView);
        shader.setVec3("objectColor", this.#material.BaseColor);
        shader.setVec3("ambientColor", scene.AmbientColor);
        shader.setInt("numberLights", scene.Lights.length);
        shader.setMat4("uWorld", this.Transformation);
        shader.setVec3("viewPosition", camera.Position);

        this.#mesh.draw();
    }
}

export {ModelBase};