'use strict'

exports.loading = false;

const b = require('./moduleB');

let loading = true;

module.exports = {
  loading,
  b
};