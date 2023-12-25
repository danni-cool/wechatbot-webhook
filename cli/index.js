#!/usr/bin/env node
const path = require('path')
require(`${path.join(__dirname, './preStart.js')}`)
require(path.join(__dirname, '../main.js'))
