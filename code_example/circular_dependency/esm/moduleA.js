'use strict';

import * as moduleB from './moduleB.js'

export let loading = false;

export const b = moduleB;

loading = true;
