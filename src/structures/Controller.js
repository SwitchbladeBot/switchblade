module.exports = class Controller {
  constructor (name, client, parentModule) {
    this.client = client
    this.parentModule = parentModule
    this.subcontrollers = []
  }

  canLoad () {
    return true
  }

  load () {
    this.subcontrollers.forEach(submodule => {
      Object.defineProperty(this, submodule.name, { get: () => submodule })
    })

    return this
  }
}
