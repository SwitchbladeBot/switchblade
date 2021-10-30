const Sentry = require('@sentry/node')
const bunyan = require('bunyan')
const PrettyStream = require('./PrettyStream')

const findSentryException = (arg) => arg instanceof Error || typeof arg === 'string'

module.exports = class Logger {
  constructor () {
    const streams = []
    const level = process.env.DEBUG === 'true' ? 'trace' : 'info'

    if (process.env.NODE_ENV !== 'production') {
      streams.push({
        type: 'raw',
        stream: new PrettyStream(),
        level
      })
    }

    this.bunyan = bunyan.createLogger({
      name: 'switchblade',
      level,
      streams
    })
  }

  fatal (...args) {
    Sentry.captureException(args.find(findSentryException))
    this.bunyan.fatal(...args)
  }

  error (...args) {
    Sentry.captureException(args.find(findSentryException))
    this.bunyan.error(...args)
  }

  warn (...args) {
    this.bunyan.warn(...args)
  }

  info (...args) {
    this.bunyan.info(...args)
  }

  debug (...args) {
    this.bunyan.debug(...args)
  }

  trace (...args) {
    this.bunyan.trace(...args)
  }
}
