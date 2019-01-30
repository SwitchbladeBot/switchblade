module.exports = class BotList {
  constructor () {
    this.name = ''
    this.envVars = []
    this.apis = []
  }

  canLoad () {
    return true
  }

  async postStatistics () {
    return Promise.reject(new Error('postStatistics function not defined'))
  }
}
