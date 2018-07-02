const { promises: fs } = require('fs')
const path = require('path')

module.exports = class FileUtils {
  static async requireDirectory (dirPath, success, error, recursive = true) {
    const files = await fs.readdir(dirPath)
    const filesObject = {}
    return await Promise.all(files.map(async file => {
      const fullPath = path.resolve(dirPath, file)
      if (file.match(/\.(js|json)$/)) {
        try {
          const required = require(fullPath)
          if (success) success(required)
          filesObject[file] = required
          return required
        } catch(e) {
          error(e)
        }
      } else if (recursive) {
        const isDirectory = await fs.stat(fullPath).then(f => f.isDirectory())
        if (isDirectory) {
          return FileUtils.requireDirectory(fullPath, success, error)
        }
      }
    })).then(() => filesObject)
  }

  static readdir (path, options) {
    return fs.readdir(path, options)
  }
}