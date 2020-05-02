module.exports = [
  // Server
  {
    name: 'server',
    description: 'Server\'s name',
    replace: ({ guild }) => guild.name
  },
  // User
  {
    name: 'username',
    description: 'User\'s username',
    replace: ({ user }) => user.username
  },
  {
    name: 'user',
    description: 'User\'s mention',
    replace: ({ user }) => user.toString()
  },
  {
    name: 'userId',
    description: 'User\'s ID',
    replace: ({ user }) => user.id
  },
  // Channel
  {
    name: 'channel',
    description: 'Channel\'s mention',
    replace: ({ channel }) => channel.toString()
  },
  {
    name: 'channelName',
    description: 'Channels\'s name',
    replace: ({ channel }) => channel.name
  }
]
