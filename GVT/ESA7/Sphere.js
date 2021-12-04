class Sphere extends Mesh {

    constructor(resolution, solidColor, lineColor) {
        super(solidColor, lineColor);
        this.vertexData = this.createVertexData(resolution);
        this._vertices = this.vertexData.vertices;
        this._indices = this.vertexData.indices;
        this._lineIndices = this.vertexData.lineIndices;
        this.setupMesh(this._vertices, this._indices, this._lineIndices);
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

                var iVertex = i * (m + 1) + j;

                var x = r * Math.sin(v) * Math.cos(u);
                var y = r * Math.sin(v) * Math.sin(u);
                var z = r * Math.cos(v);

                // Set vertex positions.
                position.push(x);
                position.push(y);
                position.push(z);

                // Calc and set normals.
                var vertexLength = Math.sqrt(x * x + y * y + z * z);
                // normals[iVertex * 3] = x / vertexLength;
                // normals[iVertex * 3 + 1] = y / vertexLength;
                // normals[iVertex * 3 + 2] = z / vertexLength;
                normal.push(x / vertexLength);
                normal.push(y / vertexLength);
                normal.push(z / vertexLength);
                normal.push(1.0);
                
                

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
            lineIndices: indicesLines
        };
    }
}