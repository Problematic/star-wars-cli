#!/usr/bin/env node

import { Command } from 'commander'

const program = new Command()

program
  .name('star-wars-cli')
  .description('Interface to the Valstro Star Wars API')
  .version('0.0.1')

program.parse(process.argv)
