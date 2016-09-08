var jsfmt = require('jsfmt');
var postcss = require('postcss');
var stylefmt = require('stylefmt');
var html = require('html');
var fs = require('fs');
var async = require('async');
var cheerio = require('cheerio');

function vuefmt(source, handler, opts) {
  var $ = cheerio.load(source);
  var scriptText = $('script').text();
  var styleText = $('style').text();
  var templateText = $('template').html();

  async.series({
    outputTemplate: function(callback) {
      var output = html.prettyPrint(templateText);
      callback(null, output);
    },
    outputScript: function(callback) {
      callback(null, jsfmt.format(scriptText));
    },

    outputStyle: function(callback) {
      postcss([
        stylefmt
      ]).process(styleText)
        .then(function(result) {
          callback(null, result.css);
        });
    }
  }, function(err, results) {
    if (err) {
      handler(err, "");
      return;
    }
    var output = "";
    output += "<style>\n";
    output += results.outputStyle;
    output += "</style>\n";
    output += "\n";

    output += "<template>\n";
    output += results.outputTemplate;
    output += "\n</template>\n";
    output += "\n";

    output += "<script>";
    output += results.outputScript;
    output += "</script>\n";
    output += "\n";

    handler(err, output);
  });
}


module.exports = {
  vuefmt: vuefmt
}