#!/usr/bin/env node

import crypto from 'crypto';
import fs from 'fs/promises';

import { Command, Option, ParseOptionsResult } from 'commander';
import Promptly from 'promptly';

import { getPackage } from '../common';

// The package.json contents to get the version string
const pkg = getPackage();

/*
 * Construct the main program command, with some global options. 
 */
const program:Command = new Command()
  .version(pkg.version, '-v, --version')
  .description('performs hashing algorithms on a variety of inputs')
  .option('-f, --file <path>', 'reads the input file and performs the hash function on the contents')
  .option('-s, --secret', 'if the prompt is used, hide the input as a password input')
  .option('--prompt', 'force the command to prompt for input, regardless of arguments');

async function getActionData(arg:any):Promise<string> {
  const options = program.optsWithGlobals();

  // Only check other inputs if prompt is not forced
  if(!options.prompt) {
    if(options.file) {
      const data = await fs.readFile(options.file, { encoding: 'utf-8' });
      return data;
    } else if(arg)
      return typeof arg === 'string' ? arg : arg.toString();
  }

  // Perform the prompt anyways if we got this far
  const input = await Promptly.prompt('>', { silent: !!(options.secret) });

  return input;
}

/*
 * Add in the MD5 sub-command. Allows for an output-format switch which defaults to hex.
 */
program.command('md5')
  .argument('[text]', 'input text to directly hash')
  .addOption( 
    new Option('-o, --output-format <format>', 'format for the output')
      .choices(['binary', 'hex', 'base64'])
      .default('hex')
  )
  .action(async (arg:string, opts:any):Promise<void> => {
    try {
      const input = await getActionData(arg);
      if(!input)
        throw new Error(`No input was provided!`);
      
      const hash = crypto.createHash('md5').update(input).digest(opts.outputFormat);
      console.log(hash);  
    } catch(err:any) {
      console.error(`An error occured while trying to process your request!`);
      console.error();
      console.error(err.message ?? err);
    }
  });

// Top-level async IIFE
(async () => {
  // Parse and execute
  await program.parseAsync();
})();
