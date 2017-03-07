#!/usr/bin/env node

(() => {
    const valletta = require('./valletta')
    module.exports = valletta

    if (!module.parent) {
      valletta.generate()
    }
})()
