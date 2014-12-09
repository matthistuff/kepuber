#kepuber

Kepuber is a transformation pipeline to make regular epubs play nicely with Kobo readers.

##Motiviation

I buy a lot of tech books in epub format. Trying to read those epubs on my Kobo is pure pain because they aren't rendered using the built in [webkit renderer](http://readium.org/) but display with the styles and fonts included by the publisher. Trying to manually force them into a `kepub.epub` makes them display nicely but the embedded fonts make page turns slow and bookmarks can't be set on a page level.

Props go out to Daniel Andrei and [his blog post](http://dsandrei.blogspot.de/2012/07/koboish-ebooks.html) on this subject.

##Installation

Kepuber is a npm package and should be installed globally.

```shell
npm install -g kepuber
```

##CLI usage

When installed globally the `kepuber` command can be used.

```shell
kepuber inputFile outputFile
```

###Options

```
-h, --help     output usage information
-V, --version  output the version number
-c, --nocss    Strip all CSS
-f, --nofonts  Strip all custom fonts
```

##Pipeline
