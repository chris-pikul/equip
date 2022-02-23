#!/usr/bin/env node

import { Argument, Command, InvalidOptionArgumentError, Option, OptionValues } from 'commander';

import { getPackage } from '../common';
import { optNumber } from '../options';

// The package.json contents to get the version string
const pkg = getPackage();

/*
 * Construct the main program command, with some global options. 
 */
const program:Command = new Command()
  .version(pkg.version, '-v, --version')
  .description('generates random information');

/**
 * Command to generate random numbers
 */
program.command('number')
  .description(`generates random numbers within a given range.
  
if only one argument is given it is treated as the maximum value, with 0 being the minimum.
if two arguments are given, they are treated as minimum and maximum range.
if no arguments are provided, then the default of 0 & 1 will be used.`)
  .argument('[minimum]', 'minimum value to use', optNumber)
  .argument('[maximum]', 'maximum value to use', optNumber)
  .option('-i, --integer', 'whether to only generate whole integers')
  .option('-r, --repeat <number>', 'repeat the generation a number of times to produce bulk amounts of random numbers', optNumber, 1)
  .addOption( 
    new Option('-f, --format <format>', 'specifies the output format (base)')
      .choices(['binary', 'octal', 'decimal', 'hex', 'base64'])
      .default('decimal')
  )
  .action((argMin:(undefined|number), argMax:(undefined|number), opts:OptionValues):void => {
    // Parse the incoming values to deduce the min/max values
    let optMin = 0, optMax = 1;
    if(typeof argMin !== 'undefined') {
      // Check if we only want to add one argument for max range
      if(typeof argMax !== 'undefined') {
        optMin = argMin;
        optMax = argMax;
      } else
        optMax = argMin;
    }

    let min:number = Math.min(optMin, optMax);
    let max:number = Math.max(optMin, optMax);

    // If we need integers, then convert the range as well.
    if(opts.integer) {
      min = Math.round(min);
      max = Math.round(max);
    }

    const output = (val:number):void => {
      switch(opts.format) {
        case 'binary':
          console.log( val.toString(2) );
          break;
        case 'octal':
          console.log( val.toString(8) );
          break;
        case 'decimal':
          console.log( val.toString(10) );
          break;
        case 'hex':
          console.log( val.toString(16) );
          break;
        case 'base64':
          console.log( Buffer.from(val.toString()).toString('base64') );
          break;
        default:
          console.error(`invalid format option, received "${opts.format}", but expected one of "binary", "hex", "octal", "decimal", "base64"`);
      }
    };

    for(let i=1; i <= opts.repeat; i++) {
      const rand = (Math.random() * (max - min)) + min;
      output( opts.integer ? Math.round(rand) : rand );
    }
  });

// Top-level async IIFE
(async () => {
  // Parse and execute
  await program.parseAsync();
})();
