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

program
  .argument('[query...]', 'The search query to send to the server')
  .option('-u, --uri <apiUrl>', 'API server to use', 'http://localhost:3000')

program.action(async (args: string[], opts) => {
  const socket = io(opts.uri)
  const droid = new ProtocolDroid(socket, args.length > 0)

  if (!droid.standalone) {
    process.stdout.write(`Connecting to ${opts.uri}... `)
  }

  socket.on('connect', async () => {
    if (!droid.standalone) {
      process.stdout.write(`connected.\n`)
      droid.query()
    } else {
      socket.emit('search', { query: args.join(' ') })
    }
  })

  socket.on('error', (error) => {
    console.error('An error occurred:', error)
    socket.disconnect()
  })

  socket.on('disconnect', () => {
    if (!droid.standalone) {
      console.log('Disconnected from server')
    }
  })

  socket.on('connect_error', (error) => {
    console.error(
      chalk.bold.red(`\nFailed to connect to server: ${error.message}`),
    )
    socket.disconnect()
  })

  socket.on('search', (result) => {
    if (droid.displayResult(result)) {
      if (!droid.standalone) {
        droid.query()
      } else {
        socket.disconnect()
      }
    }
  })
})
;(async function () {
  await program.parseAsync()
})()
