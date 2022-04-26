'use strict';

import * as moduleB from './moduleB.js'

export let loading = false;

const b = moduleB;

loading = true;

export default {
  loading,
  b
};
