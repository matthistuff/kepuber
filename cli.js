#!/usr/bin/env node
var fs = require('fs'),
    path = require('path'),
    cli = require('commander'),
    kepuber = require('./index'),
    stripfonts = require('./lib/modifiers/stripfonts'),
    stripcss = require('./lib/modifiers/stripcss'),
    annotator = require('./lib/modifiers/annotator')

function fixExtension (filename) {
    if (filename.indexOf('.kepub') === -1) {
        filename = filename.replace('.epub', '.kepub.epub')
    }

    return filename
}

function isDirectory (filename) {
    return fs.lstatSync(filename).isDirectory()
}

function run (source, dest) {
    if (isDirectory(dest)) {
        var filename = path.basename(source);
        dest = path.join(dest, fixExtension(filename))
    }

    kepuber(source, function (kepub) {
        kepub.use(annotator)

        if (cli.nofonts) {
            kepub.use(stripfonts)
        }
        if (cli.nocss) {
            kepub.use(stripcss)
        }

        kepub.save(dest, function () {
            console.log('converted %s to %s', source, dest)
        })
    });
}

cli
    .version('0.0.8')
    .usage('inputFiles')
    .option('-c, --nocss', 'Strip all CSS')
    .option('-f, --nofonts', 'Strip all custom fonts')
    .option('-d, --destination <destination>', 'Output to file/s to <destination>', process.cwd())
    .parse(process.argv)

if (cli.args.length < 1) {
    console.error('No input file specified! Use -h for help.')
    process.exit(1)
}

var source = cli.args,
    dest = path.resolve(cli.destination)

source.forEach(function (item) {
    run(path.resolve(item), dest)
})