'use strict';

import * as moduleA from './moduleA.js'

export let loading = false;

export const a = moduleA;

loading = true;