#!/usr/bin/env node

import {values, keys} from 'lodash';
import program from 'commander';
import replace from 'replace';
import {find} from 'find-in-files';
import {prompt} from 'prompt-sync';
import {writeFile} from 'fs';
import {js_beautify as beautify} from 'js-beautify';

import S from 'string';

import {init as initSkeleton} from 'init-skeleton';
const defaultSkeleton = 'https://github.com/bare-bones/scalp-simple';
//console.log(defaultSkeleton)


function findMatchesIn(rootPath) {
    return find('scalp_([\\w_-]+)', rootPath).then(results => {
        let matches = {};
        values(results).forEach(result => {
            result.matches.forEach(match => {
                let key = match.replace('scalp_', '');
                matches[key] = {prompt: S(key).humanize().s}
            })
        });
        return matches;
    })
}

program
    .version(require('../package.json').version);



program
    .command('new [path]')
    // .option('-s, --skeleton [name]', 'skeleton name or URL from brunch.io/skeletons')
    .action((rootPath, options) => {

        const skeleton = options.skeleton || process.env.BRUNCH_INIT_SKELETON || defaultSkeleton;
        initSkeleton(skeleton, {rootPath}, err => {

                findMatchesIn(rootPath).then(matches => {
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

program
    .command('init [path]')
    .action((rootPath) => {
        findMatchesIn(rootPath).then(matches => {
            writeFile(`${rootPath || "."}/scalp.config.js`, `module.exports = ${beautify(JSON.stringify(matches))};`, err => {
                if(err) {
                    console.error(err);
                    return;
                }
                console.log('scalp.config.js');
            });
        });
    });




program.parse(process.argv);