# valletta

Tool to build and manage [Discourse](https://discourse.org) theme customizations.
Generate `.json` files that you can upload or paste into the Discourse admin
interface, while you can make the most of your existing workflow and source control.

## Usage

You can use valletta from within a node script

```js
const valletta = require('valletta')

valletta.generate({
  name: 'My Theme',
  srcDir: 'theme_files',
  outputDir: 'build'
})
```

or from the command line

```
$ valletta
```

By default valletta will look for the first matching config file called
`valletta.config.js`, if any, in the current directory, nearest ancestor, or 
user's home directory. 
The config file should export an options object that will be used to
generate the discourse theme file.

Here is an example `valletta.config.js` file:

```js
module.exports = {
  srcDir: 'theme',
  outputDir: 'build',
  name: 'My custom theme',
  enabled: false,
  files: {
    // CSS
    stylesheet: 'stylesheet.css',
    // Header
    header: 'header.tpl.html',
    // Top
    top: 'top.tpl.html',
    // Footer
    footer: 'footer.tpl.html',
    // </head>
    head_tag: 'head_tag.tpl.html',
    // </body>
    body_tag: 'body_tag.tpl.html',
    // Embedded CSS
    embedded_css: 'embedded_css.css',
    // CSS in the 📱 section
    mobile_stylesheet: 'mobile_stylesheet.css',
    // Header in the 📱 section
    mobile_header: 'mobile_header.tpl.html',
    // Top in the 📱 section
    mobile_top: 'mobile_top.tpl.html',
    // Footer in the 📱 section
    mobile_footer: 'mobile_footer.tpl.html',
  }
}
```

## API

### valletta.generate(options)

Compiles source files into a JSON theme file that can be imported into
a Discourse forum. Accepts an options object. Returns a promise that is resolved
with the path to the generated theme file.

#### options.name
The name of the generated theme.
Defaults to `custom theme`.

#### options.enabled
If the theme should be enabled. This should be a Boolean value
Defaults to `false`.

#### options.srcDir
The source directory to search for theme files in.  
Defaults to the current directory.

#### options.outputDir
The directory to write the generated theme file to. If the directory
doesn't exist it will be created automatically.  
Defaults to the current directory.

#### options.files
An object containing key / pair values for theme files.
The value can either be a string, where the value
is the path to the theme file, relative to the `srcDir` option.  
Alternatively, the value can be a Promise that will return the contents of
the theme file.

Possible keys for this option are:

* `stylesheet`: corresponds to the **CSS** tab on discourse and defaults to `stylesheet.css`
* `header`: corresponds to the **Header** tab on discourse and defaults to `header.tpl.html`,
* `top`: corresponds to the **Top** tab on discourse and defaults to `top.tpl.html`,
* `footer`: corresponds to the **Footer** tab on discourse and defaults to `footer.tpl.html`,
* `head_tag`: corresponds to the **📄`</head>`** tab on discourse and defaults to `head_tag.tpl.html`,
* `body_tag`: corresponds to the **📄`</body>`** tab on discourse and defaults to `body_tag.tpl.html`,
* `embedded_css`: corresponds to the **Embedded CSS** tab on discourse and defaults to `embedded_css.css`,
* `mobile_stylesheet`: corresponds to the **CSS** tab in the 📱 section on discourse and defaults to `mobile_stylesheet.css`,
* `mobile_header`: corresponds to the **Header** tab in the 📱 section on discourse and defaults to `mobile_header.tpl.html`,
* `mobile_top`: corresponds to the **Top** tab in the 📱 section on discourse and defaults to `mobile_top.tpl.html`,
* `mobile_footer`: corresponds to the **Footer** tab in the 📱 section on discourse and defaults to `mobile_footer.tpl.html`,

