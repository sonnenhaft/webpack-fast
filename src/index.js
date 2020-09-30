import z1 from '#/index2';
import z2 from '~/src/index2';
import * as k from '~/src/index2';
// import z3 from '/src/index2';
import {z} from '#/index2';
import {z as z4} from './index2';

import './index.scss'

import abc1 from '#/abc';
import abc2 from '~/src/abc';
import * as abcK from '~/src/abc';
// import z3 from '/src/index2';
import {z as abcZ} from '#/abc';
import {z as abcZ2} from './abc';

import abc1Z from '#/abcZ';
import abc2Z from '~/src/abcZ';
import * as abcKZ from '~/src/abcZ';
import {z as abcZZ} from '#/abcZ';
import {z as abcZ2Z} from './abcZ';

function component() {
    const element = document.createElement('div');

    // Lodash, currently included via a script, is required for this line to work
    element.innerHTML = ['Hello', 'webpack',
        'zsdf' ?? 'r',
        z, z1, z2, z4, JSON.stringify(k),
        abc1, abc2, abcK, abcZ, abcZ2,
        abc1Z, abc2Z, abcKZ, abcZZ, abcZ2Z,
    ].join(' ')

    return element;
}

document.body.appendChild(component());