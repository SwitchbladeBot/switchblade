const { Constants } = require('../../')
const gifFrames = require('gif-frames')
const GifEncoder = require('gifencoder')
const { createCanvas: CreateCanvas, loadImage } = require('canvas')
const Util = require('util')
const streamToBuffer = Util.promisify(require('stream-to-buffer'))

class ButtSlap {
  /**
     * create gif
     * @param {String} tom image that will be the face of tom
     * @param {String} kettin image that will be the face of kettin
  */
  static async render (tom, kettin) {
    // image size
    this.x = 500
    this.y = 364
    // picture size of the tom
    this.tom_x = 80
    this.tom_y = 80
    // picture size of the kitten
    this.kettin_x = 50
    this.kettin_y = 50
    // tom position
    let tomX = 200
    let tomY = 100
    // kettin position
    let kettinX = 180
    let kettinY = 270

    const [TOM_AVATAR, KETTIN_AVATAR] = await Promise.all([
      loadImage(tom.replace('.gif', '.png')),
      loadImage(kettin.replace('.gif', '.png'))
    ])

    const frames = await gifFrames({
      url: Constants.BUTTSLAP_GIF,
      frames: 'all',
      outputType: 'png' })
    const canvas = new CreateCanvas(this.x, this.y)
    const encoder = new GifEncoder(this.x, this.y)

    const ctx = canvas.getContext('2d')
    const FILE = await encoder.createReadStream()

    encoder.start()

    encoder.setRepeat(0)
    encoder.setDelay(0)
    encoder.setQuality(10)

    for (const i in frames) {
      const frame = await loadImage(await streamToBuffer(frames[i].getImage()))

      await ctx.drawImage(frame, 0, 0, this.x, this.y);
      await ctx.drawImage(TOM_AVATAR, tomX, tomY, this.tom_x, this.tom_y)
      await ctx.drawImage(KETTIN_AVATAR, kettinX, kettinY, this.kettin_x, this.kettin_y)

      encoder.addFrame(ctx)

      if (i >= 1) {
        tomX -= 5
        tomY -= 5
      }

      if (i >= 2) {
        kettinX -= 5
      }
    }

    encoder.finish()

    return FILE
  }
}

module.exports = ButtSlap
