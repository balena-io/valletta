#!/usr/bin/env node

(() => {
    const valletta = require('./valletta')
    const program = require('commander')
    module.exports = valletta

    if (!module.parent) {
      program
      .command('init', 'initialise blank Discourse theme files')
      .command('build', 'generate a JSON theme file from files in the current directory')

      program.on('build', () => {
          valletta.generate(null, true)
          .then((outputPath) => {
            console.log('Done! A new theme file has been  generated:', outputPath)
          })
      })

      program.on('init', () => {
        valletta.init(true)
      })

      program.parse(process.argv)
    }
})()
