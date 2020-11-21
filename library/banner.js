'use strict'
const pack = require('../package.json')

const bannerTxt = `/*! Vue Vocabulary v${pack.version} | MIT License | github.com/creativecommons/vocabulary */\n`

process.stdout.write(bannerTxt)
process.stdin.pipe(process.stdout)
