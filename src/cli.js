#!/usr/bin/env node

import {values, keys} from 'lodash';
import program from 'commander';
import replace from 'replace';
import {find} from 'find-in-files';
import {prompt} from 'prompt-sync';
import S from 'string';

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
            let matches = {};
            find('scalp_(\\w+)', rootPath).then(results => {
                values(results).forEach(result => {
                    result.matches.forEach(match => {
                        let key = match.replace('scalp_', '');
                        matches[key] = {prompt: S(key).humanize().s}
                    })
                });
                console.log(matches);

                for(let key in matches) {
                    let variableInfo = matches[key];
                    console.log(variableInfo.prompt);
                    matches[key].value = prompt();
                    replace({
                        regex:`scalp_${key}`,
                        replacement:matches[key].value,
                        paths:[rootPath],
                        recursive:true,
                        silent:true
                    });
                }


            });

        });
        //

    });

program.parse(process.argv);