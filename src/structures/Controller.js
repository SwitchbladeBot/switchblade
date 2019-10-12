module.exports = class Controller {
  constructor (name, client, parentController) {
    this.name = name
    this.client = client
    this.parentController = parentController
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
