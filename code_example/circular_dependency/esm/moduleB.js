'use strict';

import * as moduleA from './moduleA.js'

export let loading = false;

const a = moduleA;

loading = true;

export default {
  loading,
  a
};
