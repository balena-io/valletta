#!/usr/bin/env node

(() => {
    const valletta = require('./valletta')
    module.exports = valletta

    if (!module.parent) {
      valletta.generate(null, true)
      .then((outputPath) => {
        console.log('Done! A new theme file has been  generated:', outputPath)
      })
    }
})()
