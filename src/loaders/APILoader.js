const { Loader, APIWrapper, FileUtils } = require('../')

module.exports = class APILoader extends Loader {
  constructor (client) {
    super(client)

    this.apis = {}
  }

  async load () {
    try {
      await this.initializeAPIs()
      this.client.apis = this.apis
      return true
    } catch (e) {
      this.logError(e)
    }
    return false
  }

  /**
   * Initializes all API Wrappers.
   * @param {string} dirPath - Path to the apis directory
   */
  initializeAPIs (dirPath = 'src/apis') {
    let success = 0
    let failed = 0
    return FileUtils.requireDirectory(dirPath, (NewAPI) => {
      if (Object.getPrototypeOf(NewAPI) !== APIWrapper) return
      this.addAPI(new NewAPI()) ? success++ : failed++
    }, this.logError.bind(this)).then(() => {
      this.log(failed ? `[33m${success} API wrappers loaded, ${failed} failed.` : `[32mAll ${success} API wrappers loaded without errors.`, 'APIs')
    })
  }

  /**
   * Adds a new API Wrapper to the Client.
   * @param {APIWrapper} api - API Wrapper to be added
   */
  addAPI (api) {
    if (!(api instanceof APIWrapper)) {
      this.log(`[31m${api.name} failed to load - Not an APIWrapper`, 'APIs')
      return false
    }

    if (api.canLoad() !== true) {
      this.log(`[31m${api.name} failed to load - ${api.canLoad() || 'canLoad function did not return true.'}`, 'APIs')
      return false
    }

    if (!api.envVars.every(variable => {
      if (!process.env[variable]) this.log(`[31m${api.name} failed to load - Required environment variable "${variable}" is not set.`, 'APIs')
      return !!process.env[variable]
    })) return false

    this.apis[api.name] = api.load()
    return true
  }
}
