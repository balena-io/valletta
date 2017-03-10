const fs = require('fs')
const path = require('path')

const rmdir = function(dir) {
  if (!fs.existsSync(dir)) {
    return
  }
	const list = fs.readdirSync(dir)
	for (let i = 0; i < list.length; i++) {
		const filename = path.join(dir, list[i])
		const stat = fs.statSync(filename)

		if (filename === '.' || filename === '..') {
			// pass these files
		} else if (stat.isDirectory()) {
			// rmdir recursively
			rmdir(filename)
		} else {
			// rm fiilename
			fs.unlinkSync(filename)
		}
	}
	fs.rmdirSync(dir)
}

exports.rmdir = rmdir

exports.fileOptions = {
  stylesheet: {
    default: 'stylesheet.css',
    custom: 'stylesheet-alt',
  },
  header: {
    default: 'header.tpl.html',
    custom: 'header-alt',
  },
  top: {
    default: 'top.tpl.html',
    custom: 'top-alt',
  },
  footer: {
    default: 'footer.tpl.html',
    custom: 'footer-alt',
  },
  head_tag: {
    default: 'head_tag.tpl.html',
    custom: 'head_tag-alt',
  },
  body_tag: {
    default: 'body_tag.tpl.html',
    custom: 'body_tag-alt',
  },
  embedded_css: {
    default: 'embedded_css.css',
    custom: 'embedded_css-alt',
  },
  mobile_stylesheet: {
    default: 'mobile_stylesheet.css',
    custom: 'mobile_stylesheet-alt',
  },
  mobile_header: {
    default: 'mobile_header.tpl.html',
    custom: 'mobile_header-alt',
  },
  mobile_top: {
    default: 'mobile_top.tpl.html',
    custom: 'mobile_top-alt',
  },
  mobile_footer: {
    default: 'mobile_footer.tpl.html',
    custom: 'mobile_footer-alt',
  }
}
