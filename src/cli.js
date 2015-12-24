#!/usr/bin/env node


import program from 'commander';
import replace from 'replace';
import {find} from 'find-in-files';

import {init as initSkeleton} from 'init-skeleton';
const defaultSkeleton = 'https://github.com/bare-bones/scalp-simple';
//console.log(defaultSkeleton)
program
    .version(require('../package.json').version)
    .command('new [path]')
   // .option('-s, --skeleton [name]', 'skeleton name or URL from brunch.io/skeletons')
    .action((rootPath, options) => {

        const skeleton = options.skeleton || process.env.BRUNCH_INIT_SKELETON || defaultSkeleton;
        initSkeleton(skeleton, {rootPath}, err => {
            find('scalp-(\\w+)', rootPath).then(results => {
                console.log(results);
            });

        });
        //

    });

program.parse(process.argv);