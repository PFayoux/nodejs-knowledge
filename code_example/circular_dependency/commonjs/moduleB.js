'use strict';

exports.loading = false;

const a = require('./moduleA');

let loading = true;

module.exports = {
  loading,
  a
};