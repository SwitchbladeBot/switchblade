module.exports = class Module {
  constructor (client, parentModule) {
    this.client = client
    this.parentModule = parentModule
    this.submodules = []
  }

  canLoad () {
    return true
  }

  load () {
    this.submodules.forEach(submodule => {
      Object.defineProperty(this, submodule.name, {
        get: () => submodule
      })
    })

    return this
  }
}
