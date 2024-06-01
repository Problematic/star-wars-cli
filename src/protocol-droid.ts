import { Socket } from 'socket.io-client'
import input from '@inquirer/input'

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
  constructor(private readonly socket: Socket) {}

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
      console.error('An error occurred:', result.error)
      return true
    }

    console.log(
      `(${result.page}/${result.resultCount}) ${result.name} - [${result.films}]`,
    )

    return result.page === result.resultCount
  }
}
