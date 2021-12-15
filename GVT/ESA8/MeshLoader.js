class MeshLoader extends Mesh{
    #objSource
    constructor(path, solidColor, lineColor) {
        super(solidColor, lineColor);
        this.#objSource = this.loadOBJ(path);
        this.vertexData = this.createVertexData(this.#objSource);
        this._vertices = this.vertexData.vertices;
        this._indices = this.vertexData.lineIndices;
        this._lineIndices = this.vertexData.lineIndices;
        this.setupMesh(this._vertices, this._indices, this._lineIndices);
    }

    loadOBJ(path){
        const req = new XMLHttpRequest();
        req.open("GET", path, false);
        req.send();
        return(req.status == 200) ? req.responseText : null;
    }

    createVertexData(objSource) {
        let lines = objSource.split(/\r?\n/);
        let positions = [];
        let normals = [];
        let faces = [];
        let texCoords = [];
        let lineIndices = [];

        let vertices = [];

        lines.forEach(line => {
            let attrib = line.split(' ')[0];
            let p = line.split(' ');
            if(attrib === 'v'){
                let position =
                    [
                    parseFloat(p[1]),
                    parseFloat(p[2]),
                    parseFloat(p[3])
                    ];
                positions.push(position);
            }
            else if(attrib === 'vt'){
                let texCoord =
                    [
                        parseFloat(p[1]),
                        parseFloat(p[2]),
                    ];
                texCoords.push(texCoord);
            }
            else if(attrib === 'vn'){
                let normal =
                    [
                        parseFloat(p[1]),
                        parseFloat(p[2]),
                        parseFloat(p[3])
                    ];
               normals.push(normal);
            }
            else if(attrib === 'f'){

               faces.push(p[1]);
               faces.push(p[2]);
               faces.push(p[3]);
            }
        });
        let indices = [];

        faces.forEach((face, index) => {
            let content = face.split('/');
            let positionIndex = parseInt(content[0]) - 1;
            let texCoordIndex = parseInt(content[1]) - 1;
            let normalIndex = parseInt(content[2]) - 1;
            let vertex = new Vertex(positions[positionIndex], normals[normalIndex]);
            vertices.push(vertex);
            indices.push(index);
        });

        let indicesTris = new Uint16Array(indices);

        return{
            vertices : vertices,
            indices : indicesTris,
            lineIndices : indicesTris
        };
    }

}