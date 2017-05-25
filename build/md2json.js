fs = require('fs')

function md_trim(str) {
    return str.replace(/(^\s+)|(\s+$)/g, "");
}

function handle(filename, anchor) {
    fs.readFile(filename, 'utf8', function (err,text) {
      if (err) {
        return console.log(err);
      }
    var lines = text.split("\n");
    var cur_line = 0;
    var line = ""
    var table_name = "";
    var col_num = 0;
    var cols = [];
    var rows = [];

    function read_line() {
        return lines[cur_line++];
    }
    var root = {};
    while (true) {
        var cols = [];
        var rows = [];
        while (line.indexOf(anchor) == -1 && cur_line != lines.length) {
            line = read_line();
        }
        if (cur_line == lines.length) {
            break;
        }
        table_name = line.split(anchor)[1];
        table_name = md_trim(table_name)

        line = read_line()

        if (line) {
            line = line.split("|")
            for (var j in line) {

                line[j] = md_trim(line[j])
                if ((j == 0 || j == line.length - 1) && line[j] === "") {

                } else {
                    cols.push(line[j]);
                }
            }
            if (line.length) {
                cols = line;
                rows.push(cols)
            } else {
                console.error("markdown expect column title")
                break;
            }
        } else {
            console.error("markdown expect table content")
            break;
        }

        line = read_line()

        if (line) {

        } else {
            console.error("markdown expect table spliter")
            break;
        }
        line = read_line()
        while (line.indexOf("|") != -1 && cur_line != lines.length) {

            var line_this = line.split("|")
            var row = []
            for (var j in line_this) {
                line_this[j] = md_trim(line_this[j])
                if ((j == 0 || j == line_this.length - 1) && line_this[j] === "") {

                } else {
                    row.push(line_this[j]);
                }

            }
            rows.push(row);
            line = read_line()
        }

        var data=[];
        for (var j in rows) {
            if (j != 0) {
                var ele = {};
                for (var k in rows[j]) {
                    ele[rows[0][k]] = rows[j][k];
                }
                data.push(ele);
            }
        }
        root[table_name] = data;
    }
    console.log(JSON.stringify(root));
  });
}

if (process.argv.length < 3) {
    console.log("No .md file passed!");
    return;
}
if (process.argv.length < 4) {
  anchorText = "###";
} else {
  anchorText = process.argv[3];
}
handle(process.argv[2].toString(), anchorText);
