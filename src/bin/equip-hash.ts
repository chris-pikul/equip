#!/usr/bin/env node

import crypto from 'crypto';
import fs from 'fs/promises';

import { Command, InvalidArgumentError, Option, OptionValues, ParseOptionsResult } from 'commander';
import Promptly from 'promptly';
import Bcrypt from 'bcrypt';

import { getPackage } from '../common';

// The package.json contents to get the version string
const pkg = getPackage();

/*
 * Construct the main program command, with some global options. 
 */
const program:Command = new Command()
  .version(pkg.version, '-v, --version')
  .description('performs hashing algorithms on a variety of inputs');

async function getActionData(arg:any, opts?:OptionValues):Promise<string> {
  const options = opts ?? program.optsWithGlobals();

  // Only check other inputs if prompt is not forced
  if(!options.prompt) {
    if(options.file) {
      console.log(`Reading file contents for "${options.file}"...`);
      const data = await fs.readFile(options.file, { encoding: 'utf-8' });
      console.log();
      return data;
    } else if(arg && (arg.length && arg.length > 0)) {
      let argStr:string = '';
      if(typeof arg === 'object' && Array.isArray(arg))
        argStr = arg.join(' ');
      else if(typeof arg === 'string')
        argStr = arg;
      else if(typeof arg.toString === 'function')
        argStr = arg.toString();
      else
        throw new Error(`Unable to parse text argument, could not convert to "string".`);
      
      console.log(`Using text contents "${argStr}"...`);
      console.log();
      return argStr;
    }
  }

  // Perform the prompt anyways if we got this far
  const input = await Promptly.prompt('>', { silent: !!(options.secret) });

  return input;
}

/*
 * Add in the MD5 sub-command. Allows for an output-format switch which defaults to hex.
 */
program.command('md5')
  .argument('[text...]', 'input text to directly hash, if not supplied (and the file option is not used), then a prompt will be supplied for you to enter input text.')
  .option('-f, --file <path>', 'reads the input file and performs the hash function on the contents')
  .option('-s, --secret', 'if the prompt is used, hide the input as a password input')
  .option('--prompt', 'force the command to prompt for input, regardless of arguments')
  .addOption( 
    new Option('-o, --output-format <format>', 'format for the output')
      .choices(['binary', 'hex', 'base64'])
      .default('hex')
  )
  .action(async (arg:string, opts:OptionValues):Promise<void> => {
    try {
      const input = await getActionData(arg, opts);
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

/*
 * Add in the SHA1 sub-command. Allows for an output-format switch which defaults to hex.
 */
program.command('sha1')
  .argument('[text...]', 'input text to directly hash, if not supplied (and the file option is not used), then a prompt will be supplied for you to enter input text.')
  .option('-f, --file <path>', 'reads the input file and performs the hash function on the contents')
  .option('-s, --secret', 'if the prompt is used, hide the input as a password input')
  .option('--prompt', 'force the command to prompt for input, regardless of arguments')
  .addOption( 
    new Option('-o, --output-format <format>', 'format for the output')
      .choices(['binary', 'hex', 'base64'])
      .default('hex')
  )
  .action(async (arg:string, opts:OptionValues):Promise<void> => {
    try {
      const input = await getActionData(arg, opts);
      if(!input)
        throw new Error(`No input was provided!`);
      
      const hash = crypto.createHash('sha1').update(input).digest(opts.outputFormat);
      console.log(hash);  
    } catch(err:any) {
      console.error(`An error occured while trying to process your request!`);
      console.error();
      console.error(err.message ?? err);
    }
  });

/*
 * Add in the SHA256 sub-command. Allows for an output-format switch which defaults to hex.
 */
program.command('sha256')
  .argument('[text...]', 'input text to directly hash, if not supplied (and the file option is not used), then a prompt will be supplied for you to enter input text.')
  .option('-f, --file <path>', 'reads the input file and performs the hash function on the contents')
  .option('-s, --secret', 'if the prompt is used, hide the input as a password input')
  .option('--prompt', 'force the command to prompt for input, regardless of arguments')
  .addOption( 
    new Option('-o, --output-format <format>', 'format for the output')
      .choices(['binary', 'hex', 'base64'])
      .default('hex')
  )
  .action(async (arg:string, opts:OptionValues):Promise<void> => {
    try {
      const input = await getActionData(arg, opts);
      if(!input)
        throw new Error(`No input was provided!`);
      
      const hash = crypto.createHash('sha256').update(input).digest(opts.outputFormat);
      console.log(hash);  
    } catch(err:any) {
      console.error(`An error occured while trying to process your request!`);
      console.error();
      console.error(err.message ?? err);
    }
  });

/*
 * Add in the SHA512 sub-command. Allows for an output-format switch which defaults to hex.
 */
program.command('sha512')
  .argument('[text...]', 'input text to directly hash, if not supplied (and the file option is not used), then a prompt will be supplied for you to enter input text.')
  .option('-f, --file <path>', 'reads the input file and performs the hash function on the contents')
  .option('-s, --secret', 'if the prompt is used, hide the input as a password input')
  .option('--prompt', 'force the command to prompt for input, regardless of arguments')
  .addOption( 
    new Option('-o, --output-format <format>', 'format for the output')
      .choices(['binary', 'hex', 'base64'])
      .default('hex')
  )
  .action(async (arg:string, opts:OptionValues):Promise<void> => {
    try {
      const input = await getActionData(arg, opts);
      if(!input)
        throw new Error(`No input was provided!`);
      
      const hash = crypto.createHash('sha512').update(input).digest(opts.outputFormat);
      console.log(hash);  
    } catch(err:any) {
      console.error(`An error occured while trying to process your request!`);
      console.error();
      console.error(err.message ?? err);
    }
  });

/*
 * Add in the BCRYPT sub-command. Allows for an output-format switch which defaults to hex.
 */
function parseBcryptRounds(value:string) {
  const int = parseInt(value);

  if(isNaN(int) || !isFinite(int))
    throw new InvalidArgumentError(`Bcrypt expects a valid integer number for "rounds".`);
  else if(int < 1)
    throw new InvalidArgumentError(`Bcrypt expects a valid positive number for "rounds".`);
  else if(int > 20)
    throw new InvalidArgumentError(`Bcrypt hashing can only support up to 20 rounds in this implementation, for your own sanity.`);

  return Math.trunc(int);
}

program.command('bcrypt')
  .argument('[text...]', 'input text to directly hash, if not supplied (and the file option is not used), then a prompt will be supplied for you to enter input text.')
  .option('-r, --rounds <number>', 'number of rounds to use when hashing', parseBcryptRounds, 10)
  .option('-f, --file <path>', 'reads the input file and performs the hash function on the contents')
  .option('-s, --secret', 'if the prompt is used, hide the input as a password input')
  .option('--prompt', 'force the command to prompt for input, regardless of arguments')
  .action(async (arg:string, opts:OptionValues):Promise<void> => {
    try {
      const input = await getActionData(arg, opts);
      if(!input)
        throw new Error(`No input was provided!`);
      
      const hash = await Bcrypt.hash(input, 10);
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
