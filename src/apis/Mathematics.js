const { APIWrapper } = require('..')
const { StaticPool } = require('node-worker-threads-pool')

module.exports = class Mathematics extends APIWrapper {
  constructor () {
    super({
      name: 'mathematics'
    })

    this.pool = new StaticPool({
      size: 4,
      task: (expression) => {
        const { create, all } = require('mathjs')
        const math = create(all)

        math.import({
          import: function () { throw new Error('Function import is disabled') },
          createUnit: function () { throw new Error('Function createUnit is disabled') },
          evaluate: function () { throw new Error('Function evaluate is disabled') },
          parse: function () { throw new Error('Function parse is disabled') },
          simplify: function () { throw new Error('Function simplify is disabled') },
          derivative: function () { throw new Error('Function derivative is disabled') },
          format: function () { throw new Error('Function format is disabled') }
        }, { override: true })

        return math.eval(expression)
      }
    })
  }

  calculate (expression) {
    return this.pool.createExecutor().setTimeout(10000).exec(expression).then((result) => JSON.stringify(result._data || result))
  }
}
