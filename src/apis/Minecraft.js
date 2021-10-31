const { APIWrapper } = require('../')
const axios = require('axios')

module.exports = class Minecraft extends APIWrapper {
  constructor () {
    super({
      name: 'minecraft'
    })
  }

  async nameToUUID (name) {
    const { data } = await axios(`https://api.mojang.com/users/profiles/minecraft/${name}`)
    return data.id ? { uuid: data.id, name: data.name } : null
  }

  async uuidToName (uuid) {
    const { data } = await axios(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)
    return data.id ? { uuid: data.id, name: data.name } : null
  }

  async getPreviousNames (uuid) {
    const { data } = await axios(`https://api.mojang.com/user/profiles/${uuid}/names`)
    return data
  }

  async getServer (host, port) {
    const { data } = await axios(`https://mcapi.us/server/status?ip=${host}&port=${port}`)
    return data
  }
}
