#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var tmp = require('tmp');
tmp.setGracefulCleanup();

var vuefmt = require('../index');

function fmtFile(filePath) {
  var source = fs.readFileSync(filePath, "utf-8");
  vuefmt.vuefmt(source, function(err, output) {
    fs.writeFileSync(filePath, output);
  });
}

if (process.argv.length < 3) {
  console.log("Usage: " + __filename + " SOME_FILE");
  process.exit(-1);
}

var filePath = process.argv[2];
var fullPath = path.join(process.cwd(), filePath);

fmtFile(fullPath);

