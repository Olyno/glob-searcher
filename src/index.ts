#!/usr/bin/env node

import fdir from 'fdir';
import { isMatch as globMatch } from 'micromatch';
import prompts, { Choice } from 'prompts';
import path from 'path';
import fs from 'fs';
import openDir from 'open-file-explorer';
import { exec } from 'child_process';
import ora from 'ora';

const args = process.argv.slice(2);
const basePathRegex = new RegExp(process.cwd().replace(/\\/g, '\\\\') + '\\\\', 'g');

let time = 0;
const spinner = ora(time.toString()).start();

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
            const choices: Choice[] = [];
            for (const file of filesList) {
                choices.push({
                    title: file,
                    value: file
                })
            }
            spinner.stop();
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
                choices
            })
            .catch(err => {
                throw err;
            })
        } else {
            spinner.stop();
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
    .catch(err => {
        throw err;
    })