class CsvReader{
    static Read(url){
        let req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.send();
        let csvText =  (req.status === 200) ? req.responseText : null;
        if(csvText != null){
            let result = [];

            let lines = csvText.split(/\r?\n/);
            lines.forEach(line => {
                let data = line.split(',');
                let category = parseInt(data[data.length - 1]);
                data = data.slice(0, data.length - 1);
                data = data.map(Number);
                result.push({category: category, data: data});
            });
            return result;
        }else{
            return null;
        }
    }
}

export {CsvReader};