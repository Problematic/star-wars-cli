#!/usr/bin/env node

import { Command } from 'commander'
import { io } from 'socket.io-client'
import chalk from 'chalk'

import ProtocolDroid from './protocol-droid'

const program = new Command()

program
  .name('star-wars-cli')
  .description('Interface to the Valstro Star Wars API')
  .version('0.0.1')

program.option(
  '-u, --uri <apiUrl>',
  'API server to use',
  'http://localhost:3000',
)

program.action(async (args) => {
  process.stdout.write(`Connecting to ${args.uri}... `)

  const socket = io(args.uri)
  const droid = new ProtocolDroid(socket)

  socket.on('connect', async () => {
    process.stdout.write(`connected.\n`)
    droid.query()
  })

  socket.on('error', (error) => {
    console.error('An error occurred:', error)
    socket.disconnect()
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from server')
  })

  socket.on('connect_error', (error) => {
    console.error(
      chalk.bold.red(`\nFailed to connect to server: ${error.message}`),
    )
    socket.disconnect()
  })

  socket.on('search', (result) => {
    if (droid.displayResult(result)) {
      droid.query()
    }
  })
})
;(async () => {
  await program.parseAsync()
})()
