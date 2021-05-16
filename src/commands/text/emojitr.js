const { Command } = require("../../");

const phrases = {
  be: ":bee:",
  bee: ":bee:",
  beer: ":beer:",
  believe: ":bee: :leaves:",
  black: ":black_circle:",
  bullshit: ":ox::poop:",
  cat: ":cat:",
  clean: ":sponge:",
  cloud: ":cloud:",
  cool: ":sunglasses: ",
  cookie: ":cookie: ",
  crocodile: ":crocodile:",
  croco: ":crocodile:",
  deep: ":diving_mask:",
  dont: ":x:",
  "don't": ":x:",
  down: ":arrow_down: ",
  dragon: ":dragon:",
  elephant: ":elephant:",
  eye: ":eye:",
  fly: ":fly: ",
  good: ":thumbsup:",
  howdy: ":cowboy::wave:",
  hello: ":wave:",
  hey: ":person_raising_hand:",
  hi: ":wave:",
  how: ":question:",
  i: ":eye:",
  info: ":information_source:",
  information: ":information_source:",
  left: " :arrow_left: ",
  love: ":heart:",
  lol: ":joy:",
  mcdonalds: ":part_alternation_mark:",
  minecraft: ":green_square: :pick:",
  mister: ":man_bald:",
  misses: ":woman_bald:",
  mr: ":man_bald:",
  ms: ":woman_bald:",
  no: ":x:",
  night: ":night_with_stars:",
  or: ":arrows_counterclockwise:",
  phone: ":telephone:",
  pin: ":pushpin:",
  pig: ":pig:",
  plane: ":airplane_small: ",
  read: ":eyes:",
  reads: ":eyes:",
  right: ":arrow_right: ",
  sad: ":sob:",
  screw: ":nut_and_bolt:",
  sonic: ":blue_circle: :hedgehog:",
  sorry: ":sob: ",
  shit: ":shit:",
  true: ":ballot_box_with_check: ",
  tweet: ":bird:",
  twitter: ":bird:",
  up: ":arrow_up: ",
  watch: ":watch:",
  well: ":whale2:",
  whale: ":whale2:",
  yes: ":ballot_box_with_check: ",
  you: ":point_right: :bust_in_silhouette:",
  youtube: ":arrow_forward: :pause_button:",
};
const separators = /([.,!?;])/;
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
            missingError: "commands:emojitr.missingSentence",
          },
        ],
      },
      client
    );
  }

  async run({ t, author, channel }, text) {
    const emojified = text
      .split(" ")
      .map((word) => {
        let suffix = separators.test(word) ? separators.exec(word)[1] : "";
        word = word.replace(separators, "");
        if (phrases[word.toLowerCase()]) {
          return phrases[word.toLowerCase()] + " " + suffix;
        }
        return word + suffix;
      })
      .join(" ");
    channel.send(emojified);
  }
};
