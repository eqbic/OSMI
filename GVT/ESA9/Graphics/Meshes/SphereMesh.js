import {Vertex} from "../../Core/Vertex.js";
import {MeshBase} from "./MeshBase.js";

let gl;
class SphereMesh extends MeshBase {
    #vertices;
    #indices;
    #vertexData;
    constructor(glContext,resolution) {
        super(glContext);
        gl = glContext;
        this.#vertexData = this.createVertexData(resolution);
        this.#vertices = this.#vertexData.vertices;
        this.#indices = this.#vertexData.indices;
        this.setupMesh(this.#vertices, this.#indices);
    }

    createVertexData(resolution) {
        var n = resolution;
        var m = resolution;

        // Index data.
        var indicesLines = new Uint16Array(2 * 2 * n * m);
        var indicesTris = new Uint16Array(3 * 2 * n * m);

        var du = 2 * Math.PI / n;
        var dv = Math.PI / m;
        var r = 1;
        // Counter for entries in index array.
        var iLines = 0;
        var iTris = 0;

        let vertices = [];
        // Loop angle u.
        for (var i = 0, u = 0; i <= n; i++, u += du) {
            // Loop angle v.
            for (var j = 0, v = 0; j <= m; j++, v += dv) {

                let position =[];
                let normal = [];
                let uv = [];

                uv.push(u);
                uv.push(v);

                let iVertex = i * (m + 1) + j;

                let x = r * Math.sin(v) * Math.cos(u);
                let y = r * Math.sin(v) * Math.sin(u);
                let z = r * Math.cos(v);

                // Set vertex positions.
                position.push(x);
                position.push(y);
                position.push(z);

                // Calc and set normals.
                let vertexLength = Math.sqrt(x * x + y * y + z * z);
                normal.push(x / vertexLength);
                normal.push(y / vertexLength);
                normal.push(z / vertexLength);
                normal.push(1.0);
                
                // Set index.
                // Line on beam.
                if (j > 0 && i > 0) {
                    indicesLines[iLines++] = iVertex - 1;
                    indicesLines[iLines++] = iVertex;
                    // Line on ring.
                    indicesLines[iLines++] = iVertex - (m + 1);
                    indicesLines[iLines++] = iVertex;
                    // Set index.
                    // Two Triangles.
                    indicesTris[iTris++] = iVertex;
                    indicesTris[iTris++] = iVertex - 1;
                    indicesTris[iTris++] = iVertex - (m + 1);
                    indicesTris[iTris++] = iVertex - 1;
                    indicesTris[iTris++] = iVertex - (m + 1) - 1;
                    indicesTris[iTris++] = iVertex - (m + 1);

                }
                vertices.push(new Vertex(position, normal, uv));
            }
        }
        return {
            vertices: vertices,
            indices: indicesTris,
        };
    }
}

export {SphereMesh};