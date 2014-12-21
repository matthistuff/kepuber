#kepuber

*Kepuber* is a transformation pipeline to make regular epubs play nicely with Kobo readers.

##Motiviation

I buy a lot of tech books in epub format. Trying to read those on my Kobo is pure pain because they aren't rendered using the awesome built in [webkit renderer](http://readium.org/) but display with the styles and fonts included by the publisher. Trying to manually force them into a `kepub.epub` makes them display nicely but the embedded fonts make page turns slow and bookmarks can't be set on a page level. Thus I embarked on creating a friendly and extendable pipeline to do this for me.

Props go out to Daniel Andrei and [his blog post](http://dsandrei.blogspot.de/2012/07/koboish-ebooks.html) on this subject.

##Installation

Kepuber is a [npm](https://www.npmjs.com/) package and should be installed globally. It requires you to have [Node.js](http://nodejs.org/) on your system.

```shell
npm install -g kepuber
```

##CLI usage

When installed globally the `kepuber` command can be used.

```shell
kepuber inputFiles
```

`inputFiles` can be a globbing pattern (if your shell supports it) or multiple files.

###Options

```
-h, --help                       output usage information
-V, --version                    output the version number
-c, --nocss                      strip all CSS
-f, --nofonts                    strip all custom fonts
-d, --destination <destination>  output to file/s to <destination>
```
If omitting the `-d` flag, kepuber will output files to the same directory as its input.

##Cavecats
Currently the pipeline is limited in what it can do. It is very picky about how epubs should be structured. It will fail on epubs that have a different structure than a `mimetype` file, a `META-INF` directory and a `OEBPS` directory. This will change in the future.

Currently the only officially supported operating system is MacOS. *nixes should work but currently I do not test them.

DRM removal will and can't be part of this software.