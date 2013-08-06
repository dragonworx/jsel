var fs = require("fs");
var csvText = fs.readFileSync("input.csv").toString();
var jsel = require("./jsel");
var dom = jsel(csvText);
dom.schema({
	onPreProcess: function (value) {
		return value.replace(/\r/g, '');
	},
	nodeName: function (node) {
		if (jsel.isNode(node)) {
			return node.nodeName;
		}
	},
	childNodes: function (node) {
		if (node === this.root()) {
			var lines = this.root().split('\n');
			for (var i = 0; i < lines.length; i++) {
				lines[i] = jsel.Node('line', lines[i]);
			}
			return lines;
		}
		if (jsel.isNode(node, 'line')) {
			var fields = node.value.split(",");
			for (var i = 0; i < fields.length; i++) {
				fields[i] = jsel.Node('field', fields[i]);
			}
			return fields;
		}
	}
})
.map({
	'data': 'line|field'
});
console.log(dom.selectAll("count(//data)"));