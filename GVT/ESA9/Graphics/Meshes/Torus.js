import {Vertex} from "../../Core/Vertex.js";
import {Mesh} from "./Mesh.js";

let gl;
class Torus extends Mesh {
    #vertices;
    #indices;
    #vertexData;
    constructor(glContext, resolution_n, resolution_m, shader, color) {
        super(glContext, shader, color);
        gl = glContext;
        this.#vertexData = this.createVertexData(resolution_n, resolution_m);
        this.#vertices = this.#vertexData.vertices;
        this.#indices = this.#vertexData.indices;
        this.setupMesh(this.#vertices, this.#indices);
    }

    createVertexData(resolution_n, resolution_m) {
        var n = resolution_n;
        var m = resolution_m;

        // Positions.
        this.positions = new Float32Array(3 * (n + 1) * (m + 1));
        var positions = this.positions;
        // Normals.
        this.normals = new Float32Array(3 * (n + 1) * (m + 1));
        var normals = this.normals;
        // Index data.
        this.indicesLines = new Uint16Array(2 * 2 * n * m);
        var indicesLines = this.indicesLines;
        this.indicesTris = new Uint16Array(3 * 2 * n * m);
        var indicesTris = this.indicesTris;

        var du = 2 * Math.PI / n;
        var dv = 2 * Math.PI / m;
        var r = 0.15;
        var R = 0.5;
        // Counter for entries in index array.
        var iLines = 0;
        var iTris = 0;

        let vertices = [];
        // Loop angle u.
        for (var i = 0, u = 0; i <= n; i++, u += du) {
            // Loop angle v.
            for (var j = 0, v = 0; j <= m; j++, v += dv) {

                var iVertex = i * (m + 1) + j;
                let position = [];
                let normal = [];

                var x = (R + r * Math.cos(u)) * Math.cos(v);
                var y = (R + r * Math.cos(u)) * Math.sin(v);
                var z = r * Math.sin(u);

                // Set vertex positions.
                positions[iVertex * 3] = x;
                positions[iVertex * 3 + 1] = y;
                positions[iVertex * 3 + 2] = z;

                position.push(x);
                position.push(y);
                position.push(z);

                // Calc and set normals.
                var nx = Math.cos(u) * Math.cos(v);
                var ny = Math.cos(u) * Math.sin(v);
                var nz = Math.sin(u);

                normal.push(nx);
                normal.push(ny);
                normal.push(nz);
                normal.push(1.0);
                normals[iVertex * 3] = nx;
                normals[iVertex * 3 + 1] = ny;
                normals[iVertex * 3 + 2] = nz;

                // if(i>14){
                // continue;
                // }

                // Set index.
                // Line on beam.
                if (j > 0 && i > 0) {
                    indicesLines[iLines++] = iVertex - 1;
                    indicesLines[iLines++] = iVertex;
                }
                // Line on ring.
                if (j > 0 && i > 0) {
                    indicesLines[iLines++] = iVertex - (m + 1);
                    indicesLines[iLines++] = iVertex;
                }

                // Set index.
                // Two Triangles.
                if (j > 0 && i > 0) {
                    indicesTris[iTris++] = iVertex;
                    indicesTris[iTris++] = iVertex - 1;
                    indicesTris[iTris++] = iVertex - (m + 1);
                    //
                    indicesTris[iTris++] = iVertex - 1;
                    indicesTris[iTris++] = iVertex - (m + 1) - 1;
                    indicesTris[iTris++] = iVertex - (m + 1);
                }
                vertices.push(new Vertex(position, normal));
            }
        }
        return {
            vertices: vertices,
            indices: indicesTris,
        };
    }
}

export {Torus};