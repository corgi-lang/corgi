# Corgi

Corgi - the HTML Preprocessor built for style and structure, brought to you by [mantle.js](https://github.com/Nektro/mantle.js).

## Installation

on the web:
```html
<script src="path/to/mantle.js"></script>
<script src="path/to/corgi.js"></script>
```

via npm:
```
$ npm install --save corgi-lang
```

via yarn:
```
$ yarn add corgi-lang
```

## Basic Usage

```corgi
// document.corgi
doctype html
html[lang="en"](
    head(
        title("Corgi Example")
        meta[charset="UTF-8"]
        meta[name="viewport",content="width=device-width,initial-scale=1"]
    )
    body(
        h1("Corgi Example")
        hr
        p("This is an example HTML document written in "a[href="https://github.com/corgi-lang/corgi"]("Corgi")".")
        p("Follow Nektro on Twitter @Nektro")
    )
)
```

```js
// web_app.js
fetch('document.corgi')
.then((response) => {
    return response.text();
})
.then((text) => {
    const html = corgi.compile(text);
})
```

```js
// node_app.js
const const = require('corgi-lang');
const fs = require('fs');

fs.readFile('settings.corgi', 'utf8', function(err, data) {
    const html = corgi.compile(data);
})
```

## Full Documentation

Coming Soon!

## Credits
- Made with mantle.js - https://github.com/Nektro/mantle.js
- Inspired by Pug - https://github.com/pugjs/pug

## Contributors
| Name | Github | Twitter | Website |
| --- | --- | --- | --- |
| Sean D | [@Nektro](https://github.com/Nektro) | [@Nektro](https://twitter.com/Nektro) | [dev.nektro.net](https://dev.nektro.net/)


## License

Apache 2, see [LICENSE](LICENSE)
