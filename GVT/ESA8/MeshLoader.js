class MeshLoader extends Mesh{
    #objSource
    constructor(path, solidColor, lineColor) {
        super(solidColor, lineColor);
        this.#objSource = this.loadOBJ(path);
        this.createVertexData(this.#objSource);
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
        let indices = [];
        let texCoords = [];
        let lineIndices = [];

        lines.forEach(line => {
            let attrib = line.split(' ')[0];
            if(attrib === 'v'){
               positions.push(line);
            }
            else if(attrib === 'vt'){
                texCoords.push(line);
            }
            else if(attrib === 'vn'){
               normals.push(line);
            }
            else if(attrib === 'f'){
               indices.push(line);
            }
        });
        console.log(positions);
        console.log(normals);
        console.log(texCoords);
    }

}