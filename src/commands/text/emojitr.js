const { Command } = require("../../");

const phrases = {
  be: ":bee:",
  bee: ":bee:",
  beer: ":beer:",
  believe: ":bee: :leaves:",
  black: ":black_circle:",
  bullshit: ":ox::poop:",
  cat: ":cat:",
  cloud: ":cloud:",
  crocodile: ":crocodile:",
  croco: ":crocodile:",
  deep: ":diving_mask:",
  dont: ":x:",
  "don't": ":x:",
  dragon: ":dragon:",
  elephant: ":elephant:",
  eye: ":eye:",
  howdy: ":cowboy::wave:",
  hello: ":wave:",
  hey: ":person_raising_hand:",
  hi: ":wave:",
  i: ":eye:",
  info: ":information_source:",
  information: ":information_source:",
  love: ":heart:",
  lol: ":joy:",
  minecraft: ":green_square: :pick:",
  or: ":arrows_counterclockwise:",
  phone: ":telephone:",
  pin:":pushpin:",
  read: ":eyes:",
  reads: ":eyes:",
  sonic: ":blue_circle: :hedgehog:",
  shit: ":shit:",
  tweet: ":bird:",
  twitter: ":bird:",
  watch: ":watch:",
  well: ":whale2:",
  whale:':whale2:',
  you: ":point_right: :bust_in_silhouette:",
};

module.exports = class EmojiTr extends Command {
  constructor(client) {
    super(
      {
        name: "emojitr",
        aliases: ["translate2emoji", "obfuscate-emoji", "emoji-tr"],
        category: "memes",
        parameters: [
          {
            type: "string",
            full: true,
            missingError: "commands:emojify.missingSentence",
          },
        ],
      },
      client
    );
  }

  async run({ t, author, channel }, text) {
    const emojified = text
      .toLowerCase()
      .split("")
      .map((letter) => {
        if (/[a-z]/g.test(letter)) {
          return `:regional_indicator_${letter}: `;
        } else if (phrases[letter]) {
          return `${phrases[letter]} `;
        }
        return letter;
      })
      .join("");
    channel.send(emojified);
  }
};
