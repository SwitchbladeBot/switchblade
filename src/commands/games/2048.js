const { Command, CommandError } = require('../../')
const arrows = ['⬅', '⬇', '⬆', '➡']
const numberEmojis = [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:']
module.exports = class Game2048 extends Command {
  constructor (client) {
    super({
      name: '2048',
      aliases: ['2k48'],
      parameters: [{
        type: 'number', min: 3, max: 6, required: false
      }],
      category: 'games'
    }, client)
  }

  async run ({ channel, author, t }, boardSize) {
    const size = boardSize || 4
    let points = 0
    const board = this.createBoard(size)
    let lastPlay = Date.now()
    for (let i = 0; i < 2; i++) {
      const empty = this.getEmptyTile(board)
      board[Math.floor(empty / size)][Math.floor(empty % size)] = 2
    }
    let msg
    try {
      msg = await channel.send(`${this.drawPoints(points)}\n\n${this.drawBoard(board)}`)
    } catch (e) {
      throw new CommandError(e.message)
    }
    for (const arrow of arrows) {
      await msg.react(arrow)
    }
    const collector = msg.createReactionCollector((r, u) => arrows.includes(r.emoji.name) && (u.id === author.id || u.id === author.client.user.id))
    const interval = setInterval(() => {
      if ((Date.now() - lastPlay) / 1000 / 60 >= 2) {
        collector.stop()
        msg.reactions.removeAll().catch(function () {})
        msg.edit(`:skull:${this.drawPoints(points)}\n\n${this.drawBoard(board)}`)
        clearInterval(interval)
      }
    }, 1000 * 60)
    collector.on('collect', (r) => {
      const u = r.users.cache.last()
      if (u.id !== author.id) return
      const old = Array.from(board.reduce((acc, val) => acc.concat(val), []))
      switch (r.emoji.name) {
        case '➡':
          this.rotateBoard(board, true)
          this.rotateBoard(board, true)
          points += this.slideLeft(board)
          this.rotateBoard(board, false)
          this.rotateBoard(board, false)
          break
        case '⬇':
          this.rotateBoard(board, false)
          points += this.slideLeft(board)
          this.rotateBoard(board, true)
          break
        case '⬆':
          this.rotateBoard(board, true)
          points += this.slideLeft(board)
          this.rotateBoard(board, false)
          break
        case '⬅':
          points += this.slideLeft(board)
      }
      if (board.reduce((acc, val) => acc.concat(val), []).some((tile, i) => tile !== old[i])) {
        const empty = this.getEmptyTile(board)
        if (empty !== false) {
          board[Math.floor(empty / size)][Math.floor(empty % size)] = 2
        }
        lastPlay = Date.now()
        msg.edit(`${this.drawPoints(points)}\n\n${this.drawBoard(board)}`)
      }
      r.users.remove(author).catch(function () {})
    })
  }

  slideLeft (board) {
    let points = 0
    for (let i = 0; i < board.length; i++) {
      let s = 0
      for (let j = 1; j < board[i].length; j++) {
        for (let k = j; k > s; k--) {
          if (board[i][k - 1] === 0) {
            board[i][k - 1] = board[i][k]
            board[i][k] = 0
          } else if (board[i][k - 1] === board[i][k]) {
            points += board[i][k] * 2
            board[i][k - 1] += board[i][k]
            board[i][k] = 0
            s = k
            break
          } else {
            break
          }
        }
      }
    }
    return points
  }

  rotateBoard (board, option) {
    const rotatedBoardArray = this.createBoard(board.length)
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (option) {
          rotatedBoardArray[i][j] = board[j][board.length - i - 1]
        } else {
          rotatedBoardArray[i][j] = board[board.length - j - 1][i]
        }
      }
    }
    for (let i = 0; i < board.length; i++) {
      board[i] = rotatedBoardArray[i]
    }
  }

  drawBoard (board) {
    let text = ''
    for (const row of board) {
      for (const tile of row) {
        const stringTile = tile.toString()
        text += this.getEmoji(`2048_${stringTile}`)
      }
      text += '\n'
    }
    return text
  }

  drawPoints (points) {
    return points.toString().split('').map(point => numberEmojis[point]).join('')
  }

  createBoard (size) {
    const board = []
    for (let i = 0; i < size; i++) {
      const row = []
      for (let j = 0; j < size; j++) {
        row.push(0)
      }
      board.push(row)
    }
    return board
  }

  getEmptyTile (board) {
    const empty = []
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] === 0) {
          empty.push(j + (i * board.length))
        }
      }
    }
    return empty.length ? empty[Math.floor(Math.random() * empty.length)] : false
  }
}
