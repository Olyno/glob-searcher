#!/usr/bin/env node

import fdir from 'fdir';
import { isMatch as globMatch } from 'micromatch';
import prompts from 'prompts';
import path from 'path';
import fs from 'fs';
import openDir from 'open-file-explorer';
import { exec } from 'child_process';

const args = process.argv.slice(2);
const basePathRegex = new RegExp(process.cwd().replace(/\\/g, '\\\\') + '\\\\', 'g');

new fdir()
    .withErrors()
    .withBasePath()
    .withDirs()
    .crawl(process.cwd())
    .withPromise()
    .then(files => {
        const filesList = (files as string[])
            .map(p => path.normalize(p).replace(basePathRegex, ''))
        if (args.length === 0) {
            return prompts({
                type: 'autocomplete',
                name: 'found',
                message: 'Searching: ',
                suggest: (glob, choices) => new Promise((resolve) => {
                    if (glob.replace(/\s/g, '') !== '') {
                        resolve(choices.filter(choice => globMatch(choice.value, glob)));
                    }
                    resolve(choices);
                }),
                choices: filesList.map(file => {
                    return {
                        title: file,
                        value: file
                    }
                })
            })
        } else {
            console.log(filesList.filter(p => globMatch(p, args[0])).join('\n'))
        }
    })
    .then(value => {
        if (value && value.found) {
            const file = value.found;
            if (fs.statSync(file).isDirectory()) {
                openDir(file);
            } else {
                const p = exec('code ' + file);
                p.on('error', (err) => {
                    p.kill();
                    throw err;
                });
            }
        }
    })