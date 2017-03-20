const _ = require('lodash')
const findConfig = require('find-config')
const fs = require('fs')
const path = require('path')
const sanitize = require('sanitize-filename')
const mkdirp = require('mkdirp')
const Promise = require('bluebird')

exports.generate = (options, cli = false) => {
  // Default to the directory of the calling module
  const callingDir = cli ?
    process.cwd() :
    path.dirname(module.parent.filename)
  let defaultConfig = {
    name: 'custom theme',
    srcDir: callingDir,
    outputDir: callingDir,
    enabled: false,
  }

  let defaultConfigFiles = {
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

  let config

  if (options) {
    config = _.defaultsDeep(options, defaultConfig)
  } else {
    let configPath = findConfig('valletta.config.js')
    if (configPath) {
      config = _.defaultsDeep(require(configPath), defaultConfig)
    } else {
      config = defaultConfig
    }
  }

  // Unless the outputDir is absolute, join it to the calling directory
  config.srcDir = config.srcDir.charAt(0) === '/' ?
    path.normalize(config.srcDir) :
    path.normalize(path.join(callingDir, config.srcDir))

  return Promise.map(_.keys(defaultConfigFiles), (key) => {
    if (config.files && config.files[key] === '') {
      return
    }
    const defaultLoad = !config.files || config.files && !config.files[key]
    const value = defaultLoad ? defaultConfigFiles[key] : config.files[key]
    let file

    if (_.isString(value)) {
      let filePath = path.join(config.srcDir, value)
      try {
        file = fs.readFileSync(filePath, 'utf-8')
      } catch (err) {
        // Only warn users if they are explicitly trying to load a file
        if (!defaultLoad) {
          console.error('Couldn\'t load ' + key + ' at ' + filePath + ' - skipping')
        }
        file = ''
      }
      return { key, file }
    } else if (_.isFunction(value)) {
      return value()
      .then((file) => {
        return { key, file }
      })
    }
  }).then((themeData) => {
    let output = {}

    themeData.forEach((item) => {
      output[item.key] = item.file
    })

    output.name = config.name
    output.enabled = config.enabled

    const outputFileName = sanitize(config.name).replace(/ /g, '_').toLowerCase() + '.dcstyle.json'

    // Unless the outputDir is absolute, join it to the calling directory
    const outputDir = config.outputDir.charAt(0) === '/' ?
      path.normalize(config.outputDir) :
      path.normalize(path.join(callingDir, config.outputDir))

    const finalPath = path.join(outputDir, outputFileName)

    mkdirp.sync(outputDir)

    const themeJSON = { site_customization: output }

    fs.writeFileSync(finalPath, JSON.stringify(themeJSON))

    return finalPath
  })
}
