class Cube extends Mesh {
    constructor(solidColor, lineColor) {
        super(solidColor, lineColor);
        this.vertexData = this.createVertexData();
        this._vertices = this.vertexData.vertices;
        this._indices = this.vertexData.indices;
        this._lineIndices = this.vertexData.lineIndices;
        this.setupMesh(this._vertices, this._indices, this._lineIndices);
    }

    createVertexData() {
        

        const positions = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
        ];
        let vertices = [];

        for (var i = 0; i < positions.length;) {
            let position = [];
            let normal = []
            position.push(positions[i]);
            position.push(positions[i + 1]);
            position.push(positions[i + 2]);

            if(i < 24){
                normal = [0,0,positions[i + 2]];
            }
            else if(i < 48){
                normal = [0, positions[i + 1], 0];
            }
            else if(i < 72){
                normal = [positions[i], 0,0];
            }

            vertices.push(new Vertex(position, normal));
            i += 3;
        }


        let indices = []
        for( var i = 0; i < 24;){
            indices.push(i);
            indices.push(i + 1);
            indices.push(i + 2);
            indices.push(i + 2);
            indices.push(i + 3);
            indices.push(i);
            i += 4;
        }

        let indicesTris = new Uint16Array(indices);

        let lineIndices = [];
        for(var i = 0; i < 48;){
            lineIndices.push(i);
            lineIndices.push(i+1);
            lineIndices.push(i+1);
            lineIndices.push(i+2);
            lineIndices.push(i+2);
            lineIndices.push(i+3);
            lineIndices.push(i+3);
            lineIndices.push(i);
            i += 4;
        }
        let indicesLines = new Uint16Array(lineIndices);

        return{
            vertices: vertices,
            indices: indicesTris,
            lineIndices: indicesLines
        };

    }
}