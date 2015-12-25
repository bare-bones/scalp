#!/usr/bin/env node

import {values, keys} from 'lodash';
import program from 'commander';
import replace from 'replace';
import {find} from 'find-in-files';
import prompt from 'prompt';
import {writeFile} from 'fs';
import {js_beautify as beautify} from 'js-beautify';
import {resolve} from 'path';
import S from 'string';
import rimraf from 'rimraf';

import {init as initSkeleton} from 'init-skeleton';
const defaultSkeleton = 'https://github.com/bare-bones/scalp-simple';

function findMatchesIn(rootPath) {
    return find('scalp_([\\w_-]+)', rootPath).then(results => {
        let matches = {};
        values(results).forEach(result => {
            result.matches.forEach(match => {
                let key = match.replace('scalp_', '');
                matches[key] = {description: S(key).humanize().s}
            })
        });
        return matches;
    }).then(matches => {
        var configPath = `${rootPath}/scalp.config.js`;
        let config = {};

        try {
            config = require(resolve(configPath));
        } catch (e) {
        }

        return {...matches, ...config};
    });
}

program
    .version(require('../package.json').version);

program
    .command('new [path]')
    .option('-s, --skeleton [name]', 'skeleton name or URL from brunch.io/skeletons')
    .action((rootPath = ".", options) => {
        console.log(options);
        const skeleton = options.skeleton || process.env.BRUNCH_INIT_SKELETON || defaultSkeleton;
        initSkeleton(skeleton, {rootPath}, err => {

            findMatchesIn(rootPath).then(matches => {



                let schema = {message: 'asdf',properties:matches};
                prompt.message = "";
                prompt.delimiter = "";
                prompt.start();
                prompt.get(schema, (err, result) => {
                    for (let key in matches) {
                        let variableInfo = matches[key];
                        replace({
                            regex: `scalp_${key}`,
                            replacement: result[key],
                            paths: [rootPath],
                            recursive: true,
                            silent: true
                        });
                    }
                    rimraf(resolve(`${rootPath}/scalp.config.js`), {},err => {
                        if(err) {
                            console.error(err);
                            return;
                        }
                    });
                });


            });

        });
        //

    });

program
    .command('init [path]')
    .action((rootPath = ".") => {
        findMatchesIn(rootPath).then(matches => {
            writeFile(`${rootPath}/scalp.config.js`, `module.exports = ${beautify(JSON.stringify(matches))};`, err => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('scalp.config.js');
            });
        });
    });

program.parse(process.argv);