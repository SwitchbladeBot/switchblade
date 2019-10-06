module.exports = class Controller {
  constructor (name, client, parentModule) {
    this.name = name
    this.client = client
    this.parentModule = parentModule
    this.subcontrollers = []
  }

  canLoad () {
    return true
  }

  load () {
    this.subcontrollers.forEach(subcontroller => {
      Object.defineProperty(this, subcontroller.name, { get: () => subcontroller })
    })

    return this
  }
}
