const _ = require('lodash')
const chai = require('chai')
const fs = require('fs')
const path = require('path')
chai.use(require('chai-fs'))
const { fileOptions, rmdir } = require('./util')
const { generate } = require('../valletta')
const { expect } = chai

const outputDir = 'build'

describe('valletta', function() {
  before(function() {
    rmdir(path.join(__dirname, 'build'))
  })

  afterEach(function() {
    rmdir(path.join(__dirname, 'build'))
  })

  describe('config', function() {
    it('should use default configuration if config is not provided', function(done) {
      generate({})
      .then((themePath) => {
        expect(themePath).to.be.a.path()
        fs.unlinkSync(themePath)
        done()
      })
    })

    it('correctly generate an output directory', function(done) {
      generate({ outputDir })
      .then((themePath) => {
        expect(themePath).to.be.a.path()
        expect(themePath).to.contain(outputDir)
        done()
      })
    })

    it('correctly use name attribute', function(done) {
      generate({
        outputDir,
        srcDir: 'testsrc',
        name: 'Test theme'
      })
      .then((themePath) => {
        expect(themePath).to.be.a.path()
        expect(themePath).to.contain(outputDir)
        const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'))
        expect(theme).to.have.property('site_customization')
        expect(theme.site_customization).to.have.property('name').that.is.a('string')
        expect(theme.site_customization.name).to.equal('Test theme')
        done()
      })
    })

    it('correctly use enabled attribute', function(done) {
      generate({
        outputDir,
        srcDir: 'testsrc',
        enabled: true
      })
      .then((themePath) => {
        expect(themePath).to.be.a.path()
        expect(themePath).to.contain(outputDir)
        const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'))
        expect(theme).to.have.property('site_customization')
        expect(theme.site_customization).to.have.property('enabled').that.is.a('boolean')
        expect(theme.site_customization.enabled).to.equal(true)
        done()
      })
    })

    _.forIn(fileOptions, (value, key) => {
      it(`correctly load the files.${key} default value`, function(done) {
        generate({
          outputDir,
          srcDir: 'testsrc'
        })
        .then((themePath) => {
          expect(themePath).to.be.a.path()
          expect(themePath).to.contain(outputDir)
          const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'))
          expect(theme).to.have.property('site_customization')
          expect(theme.site_customization).to.have.property(key).that.is.a('string')
          const sourceValue = fs.readFileSync(path.join(__dirname, `testsrc/${value.default}`), 'utf8')
          expect(theme.site_customization[key]).to.equal(sourceValue)
          done()
        })
      })

      it(`correctly load a custom files.${key} value`, function(done) {
        const config = {
          outputDir,
          srcDir: 'testsrc',
          files: {}
        }
        config.files[key] = value.custom
        generate(config)
        .then((themePath) => {
          expect(themePath).to.be.a.path()
          expect(themePath).to.contain(outputDir)
          const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'))
          expect(theme).to.have.property('site_customization')
          expect(theme.site_customization).to.have.property(key).that.is.a('string')
          const sourceValue = fs.readFileSync(path.join(__dirname, `testsrc/${value.custom}`), 'utf8')
          expect(theme.site_customization[key]).to.equal(sourceValue)
          done()
        })
      })

    })

  })
})
