var jsfmt = require('jsfmt');
var postcss = require('postcss');
var stylefmt = require('stylefmt');
var beautifier = require('xml-beautifier');
var fs = require('fs');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var async = require('async');


var source = fs.readFileSync("rate.vue", "utf-8");

var ast = new dom().parseFromString(source);
var scriptNode = xpath.select("//script", ast)[0];
var styleNode = xpath.select("//style", ast)[0];
var templateNode = xpath.select("//template/*", ast)[0];

function fmt() {
  async.series({
    outputTemplate: function(callback) {
      if (templateNode) {
        var template = templateNode.toString();
        callback(null, beautifier(template));
      }
    },
    outputScript: function(callback) {
      if (scriptNode) {
        var script = scriptNode.firstChild.data;
        callback(null, jsfmt.format(script));
      }
    },

    outputStyle: function(callback) {

      if (styleNode) {
        var style = styleNode.firstChild.data;
        postcss([
          stylefmt
        ]).process(style)
          .then(function(result) {
            callback(null, result.css);
          });
      }
    }
  }, function(err, results) {
    console.log("<style>");
    console.log(results.outputStyle);
    console.log("</style>");
    console.log("\n");

    console.log("<template>");
    console.log(results.outputTemplate);
    console.log("</template>");
    console.log("\n");

    console.log("<script>");
    console.log(results.outputScript);
    console.log("</script>");
    console.log("\n");

  });
}


fmt();