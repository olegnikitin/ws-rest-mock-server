import fs from "fs";

class Utils {
    static readFile(file) {
        let json;
        try {
            if (fs.existsSync(process.env['HOME'] + '/' + file)) {//local
                json = fs.readFileSync(process.env['HOME'] + '/' + file, {encoding: 'utf8'});
            } else if (fs.existsSync("/data/" + file)) {//docker
                json = fs.readFileSync("/data/" + file, {encoding: 'utf8'});
            } else {
                console.error("There are no such file with endpoints like it's required: " + file);
                process.exit(1);
            }
            return JSON.parse(json);
        } catch(err) {
            console.error(err)
        }
    }
}

export default Utils;
