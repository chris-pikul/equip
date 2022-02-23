#!/usr/bin/env node

import path from 'path';

import { Command } from 'commander';

import { printHeader, getPackage } from '../common';

const pkg = getPackage();

/**
 * Constructs the primary (global) equip command.
 * 
 * Add in new commands here and they will be found using standalone-executable
 * mode.
 */
const program = new Command()
  .name('equip')
  .version(pkg.version, '-v, --version')
  .executableDir(path.resolve(__dirname))
  .command('hash', 'performs hashing algorithms on a variety of inputs')
  .command('rand', 'generates random information')
  .hook('preAction', () => printHeader());

program.parse();
