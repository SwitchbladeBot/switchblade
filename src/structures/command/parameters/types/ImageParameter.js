const Parameter = require('./Parameter.js')
const UserParameter = require('./UserParameter.js')
const CommandError = require('../../CommandError.js')

const { URL } = require('url')
const fetch = require('node-fetch')
const AbortController = require('abort-controller')

const isValidURL = (q) => {
  try {
    const url = new URL(q)
    return url
  } catch (e) {
    return false
  }
}

const MAX_SIZE = 20000000
const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml']
const imageResponseCheck = (res) => (
  res.ok && SUPPORTED_TYPES.includes(res.headers.get('content-type')) &&
  res.headers.has('content-length') && Number(res.headers.get('content-length')) <= MAX_SIZE
)

const imageRequest = (url, client, timeout = 3000) => {
  const controller = new AbortController()
  const abortTimeout = client.setTimeout(() => controller.abort(), timeout)
  return fetch(url, { signal: controller.signal })
    .then(res => imageResponseCheck(res) ? res.buffer() : Promise.reject(res))
    .finally(() => client.clearTimeout(abortTimeout))
}

const defVal = (o, k, d) => typeof o[k] === 'undefined' ? d : o[k]

module.exports = class ImageParameter extends Parameter {
  static parseOptions (options = {}) {
    const user = defVal(options, 'user', true)
    return {
      ...super.parseOptions(options),
      user,
      url: defVal(options, 'url', false),
      attachment: defVal(options, 'attachment', true),
      link: defVal(options, 'link', true),
      userOptions: user ? UserParameter.parseOptions(options.userOptions) : null,
      authorAvatar: defVal(options, 'authorAvatar', true),
      avatarFormat: defVal(options, 'avatarFormat', 'jpg'),
      lastMessages: {
        accept: true,
        limit: 10,
        attachment: true,
        embed: true,
        embedImage: true,
        embedThumbnail: true,
        ...(options.lastMessages || {})
      }
    }
  }

  /*
   * Priority order
   *   Attachment
   *   Link
   *   Mention (gets the mentioned user's avatar)
   *   Last attachment from channel's last 10 messages
   *   Author's avatar
   */
  static async parse (arg, context) {
    const { t, author, channel, client, message, parseState } = context

    // Attachment
    if (this.attachment && message.attachments.size) {
      parseState.argIndex--
      const attachment = message.attachments.first()
      try {
        if (this.url) return attachment.url
        const buffer = await imageRequest(attachment.url, client)
        return buffer
      } catch (e) {
        client.logError(e)
        throw new CommandError(t('errors:imageParsingError'))
      }
    }

    if (arg) {
      // Link
      if (this.link && isValidURL(arg)) {
        try {
          if (this.url) return arg
          const buffer = await imageRequest(arg, client)
          return buffer
        } catch (e) {
          client.logError(e)
          throw new CommandError(t('errors:invalidImageLink'), this.showUsage)
        }
      }

      // Mention (gets the mentioned user's avatar)
      if (this.user) {
        try {
          const user = UserParameter._parse(arg, this.userOptions, context)
          if (user) {
            try {
              if (this.url) return user.displayAvatarURL({ format: this.avatarFormat })
              const buffer = await imageRequest(user.displayAvatarURL({ format: this.avatarFormat }), client)
              return buffer
            } catch (e) {
              client.logError(e)
              throw new CommandError(t('errors:imageParsingError'))
            }
          }
        } catch (e) {}
      }
    }

    // Last attachment from channel's last 10 messages
    if (this.lastMessages.accept) {
      const lastMessages = channel.messages.cache.last(this.lastMessages.limit)
      if (lastMessages.length) {
        for (let i = lastMessages.length - 1; i >= 0; i--) {
          const msg = lastMessages[i]
          if (this.lastMessages.attachment && msg.attachments.size) {
            parseState.argIndex--
            const attachment = msg.attachments.first()
            try {
              if (this.url) return attachment.url
              const buffer = await imageRequest(attachment.url, client)
              return buffer
            } catch (e) {
              client.logError(e)
              throw new CommandError(t('errors:imageParsingError'))
            }
          }

          if (this.lastMessages.embed && msg.embeds.length) {
            const url = msg.embeds.map(e => (
              this.lastMessages.embedImage && e.image
                ? e.image.url
                : this.lastMessages.embedThumbnail && e.thumbnail
                  ? e.thumbnail.url
                  : null
            )).find(e => e)
            if (url) {
              parseState.argIndex--
              try {
                if (this.url) return url
                const buffer = await imageRequest(url, client)
                return buffer
              } catch (e) {
                client.logError(e)
                throw new CommandError(t('errors:imageParsingError'))
              }
            }
          }
        }
      }
    }

    // Author's avatar
    if (this.authorAvatar) {
      try {
        parseState.argIndex--
        if (this.url) return author.displayAvatarURL({ format: this.avatarFormat })
        const buffer = await imageRequest(author.displayAvatarURL({ format: this.avatarFormat }), client)
        return buffer
      } catch (e) {
        client.logError(e)
        throw new CommandError(t('errors:imageParsingError'))
      }
    }
  }
}
