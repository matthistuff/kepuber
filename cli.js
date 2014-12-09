var cli = require('commander'),
    kepuber = require('./index'),
    stripfonts = require('./lib/modifiers/stripfonts'),
    stripcss = require('./lib/modifiers/stripcss'),
    annotator = require('./lib/modifiers/annotator')

cli
    .version('0.0.1')
    .usage('inputFile outputFile')
    .option('-c, --nocss', 'Strip all CSS')
    .option('-f, --nofonts', 'Strip all custom fonts')
    .parse(process.argv)

if (cli.args.length < 2) {
    console.error('No input/output file specified! Use -h for help.')
    process.exit(1)
}

kepuber(cli.args[0], function (kepub) {
    kepub.use(annotator)

    if (cli.nofonts) {
        kepub.use(stripfonts)
    }
    if (cli.nocss) {
        kepub.use(stripcss)
    }

    kepub.save(cli.args[1])
});