import { Socket } from 'socket.io-client'
import input from '@inquirer/input'
import chalk from 'chalk'

export type ApiResult = {
  page: number
  resultCount: number
  name: string
  films: string
}

export type ApiError = {
  page: -1
  resultCount: -1
  error: string
}

export type ApiResponse = ApiError | ApiResult

export default class ProtocolDroid {
  constructor(
    private readonly socket: Socket,
    public readonly standalone = false,
  ) {}

  async query() {
    const query = await input({
      message: 'What is your bidding, my master?',
    })

    this.socket.emit('search', { query })
  }

  /**
   * @param result - The result to display
   * @returns boolean - true if the result is the last page
   */
  displayResult(result: ApiResponse): boolean {
    if ('error' in result && result.page === -1) {
      console.error(chalk.bold.red(result.error))
      return true
    }

    console.log(
      chalk.dim.gray(`(${result.page}/${result.resultCount})`),
      `${chalk.blue(result.name)} - ${chalk.greenBright(`[${result.films}]`)}`,
    )

    return result.page === result.resultCount
  }
}
