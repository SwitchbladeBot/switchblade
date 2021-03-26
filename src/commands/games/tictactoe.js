const { Command, SwitchbladeEmbed, Constants } = require('../../')

const COLLECTOR_TIMEOUT = 30
const CONFIRMATION_EMOJI = '✅'
const BOARDS = {
  default: {
    players: [':regional_indicator_x:', ':regional_indicator_o:'],
    emptySpaces: [
      [':one:', ':two:', ':three:'],
      [':four:', ':five:', ':six:'],
      [':seven:', ':eight:', ':nine:']
    ],
    reactionButtons: ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'],
    horizontalSeparator: '\n'
  },
  text: {
    players: [' X ', ' O '],
    emptySpaces: [
      [' 1 ', ' 2 ', ' 3 '],
      [' 4 ', ' 5 ', ' 6 '],
      [' 7 ', ' 8 ', ' 9 ']
    ],
    reactionButtons: ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'],
    verticalSeparator: '|',
    horizontalSeparator: '\n───┼───┼───\n',
    boardPrefix: '```',
    boardSuffix: '```'
  }
}

const winConditions = [
  [[0, 0], [1, 1], [2, 2]],
  [[2, 0], [1, 1], [0, 2]],
  [[0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[2, 0], [2, 1], [2, 2]],
  [[0, 0], [0, 1], [0, 2]],
  [[0, 1], [1, 1], [2, 1]],
  [[1, 0], [1, 1], [1, 2]]
]
const gridToLinear = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]

module.exports = class TicTacToe extends Command {
  constructor (client) {
    super({
      name: 'tictactoe',
      aliases: ['ttt'],
      category: 'games',
      requirements: { guildOnly: true, botPermissions: ['ADD_REACTIONS'] },
      parameters: [{
        type: 'member', acceptSelf: false, missingError: 'commands:tictactoe.missingUser'
      }, [{
        type: 'booleanFlag', name: 'text'
      }]]
    }, client)
  }

  async run ({ channel, member, author, t, flags }, opponent) {
    const selectedBoard = BOARDS[flags.text ? 'text' : 'default']
    const gameMessage = await channel.send(
      opponent,
      new SwitchbladeEmbed(author)
        .setAuthor(
          t('commands:tictactoe.hasChallenged', { player: member.displayName }),
          author.displayAvatarURL({ format: 'png' })
        )
        .setDescription([
          t('commands:tictactoe.clickTheReaction', { CONFIRMATION_EMOJI }),
          `**(${t('commands:tictactoe.thisTimeoutsIn', { COLLECTOR_TIMEOUT })})**`
        ].join('\n'))
    )
    await gameMessage.react(CONFIRMATION_EMOJI)
    const result = await gameMessage.awaitReactions((r, u) => r.emoji.name === CONFIRMATION_EMOJI && u.id === opponent.id, { time: COLLECTOR_TIMEOUT * 1000, maxEmojis: 1 })

    if (!result.size) {
      gameMessage.edit(
        new SwitchbladeEmbed(author)
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:tictactoe.timeout'))
      )
      gameMessage.reactions.removeAll()
      return
    }

    const gameState = {
      players: [member, opponent],
      currentPlayer: 0,
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ]
    }

    await gameMessage.reactions.removeAll()
    let loadComplete = false
    const collector = gameMessage.createReactionCollector(() => true)
    collector.on('collect', async (reaction) => {
      const selectedCoordinate = gridToLinear[selectedBoard.reactionButtons.findIndex(c => c === reaction.emoji.name)]
      if (loadComplete && selectedBoard.reactionButtons.includes(reaction.emoji.name) && reaction.users.cache.some(u => u.id === gameState.players[gameState.currentPlayer].id) && this.isSpaceEmpty(gameState, selectedCoordinate)) {
        gameState.board[selectedCoordinate[0]][selectedCoordinate[1]] = gameState.currentPlayer
        gameState.currentPlayer = gameState.currentPlayer === 1 ? 0 : 1
        reaction.users.cache.forEach(u => { reaction.remove(u) })
        if (this.getWinner(gameState) !== undefined) {
          gameMessage.edit(
            new SwitchbladeEmbed()
              .setTitle(t('commands:tictactoe.title'))
              .setDescription(
                [
                  this.renderBoard(gameState, selectedBoard),
                  `:crown: **${t('commands:tictactoe.wins', { player: gameState.players[this.getWinner(gameState)].toString() })}**`
                ].join('\n\n')
              )
          )
          gameMessage.reactions.removeAll()
          collector.stop()
        } else if (this.getEmptySpaceCount(gameState) === 0) {
          gameMessage.edit(
            new SwitchbladeEmbed()
              .setTitle(t('commands:tictactoe.title'))
              .setDescription(
                [
                  this.renderBoard(gameState, selectedBoard),
                  `:anger: **${t('commands:tictactoe.itsATie')}**`
                ].join('\n\n')
              )
          )
          gameMessage.reactions.removeAll()
          collector.stop()
        } else {
          this.updateEmbed(gameState, selectedBoard, gameMessage, t, author)
        }
      } else {
        reaction.users.cache.forEach(u => {
          if (u.id !== this.client.user.id) reaction.remove(u)
        })
      }
    })
    await gameMessage.edit(
      new SwitchbladeEmbed(author)
        .setTitle(t('commands:tictactoe.title'))
        .setDescription(t('commands:tictactoe.pleaseWait'))
    )
    const reactionEmoji = selectedBoard.reactionButtons || Array.prototype.concat.apply([], selectedBoard.emptySpaces)
    for (const emoji of reactionEmoji) {
      await gameMessage.react(emoji)
    }
    await this.updateEmbed(gameState, selectedBoard, gameMessage, t, author)
    loadComplete = true
  }

  renderBoard (gameState, boardInfo) {
    return `${boardInfo.boardPrefix || ''}${
      gameState.board.map((line, lineNumber) => {
        return line.map((space, columnNumber) => {
          return space !== null ? boardInfo.players[space] : boardInfo.emptySpaces[lineNumber][columnNumber]
        }).join(`${boardInfo.verticalSeparator || ''}`)
      }).join(boardInfo.horizontalSeparator || '')
    }${boardInfo.boardSuffix || ''}`
  }

  updateEmbed (gameState, boardInfo, gameMessage, t, author) {
    return gameMessage.edit(
      t('commands:tictactoe.itsYourTurn', { player: gameState.players[gameState.currentPlayer].toString() }),
      new SwitchbladeEmbed(author)
        .setTitle(t('commands:tictactoe.title'))
        .setDescription(this.renderBoard(gameState, boardInfo))
        .addField(t('commands:tictactoe.currentPlayer'), `${boardInfo.players[gameState.currentPlayer]} ${gameState.players[gameState.currentPlayer]}`)
    )
  }

  isSpaceEmpty (gameState, spaceCoordinate) {
    return gameState.board[spaceCoordinate[0]][spaceCoordinate[1]] === null
  }

  getWinner (gameState) {
    for (const conditionCoordinates of winConditions) {
      const spaceValues = this.getSpaceValues(gameState, conditionCoordinates)
      if (spaceValues.every((value, index, array) => value === array[0]) && spaceValues[0] !== null) {
        return spaceValues[0]
      }
    }
  }

  getSpaceValues (gameState, coordinateArray) {
    return coordinateArray.map(coordinate => {
      return gameState.board[coordinate[0]][coordinate[1]]
    })
  }

  getEmptySpaceCount (gameState) {
    return Array.prototype.concat.apply([], gameState.board).filter(s => s === null).length
  }
}
