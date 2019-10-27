const { Command, SwitchbladeEmbed } = require("../../");

const types = [
  "filmslist",
  "films",
  "characterlist",
  "character",
  "locationslist",
  "location",
  "specieslist",
  "species",
  "vehicleslist",
  "vehicle"
];

module.exports = class StudioGhibli extends Command {
  constructor(client) {
    super(client, {
      name: "studioghibli",
      aliases: ["ghibli"],
      category: "anime",
      parameters: [
        {
          type: "string",
          full: true,
          whitelist: types,
          missingError: ({ t, prefix }) => {
            return new SwitchbladeEmbed()
              .setTitle(t("commons:search.noType"))
              .setDescription(
                [
                  this.usage(t, prefix),
                  "",
                  `__**${t("commons:search.types")}:**__`,
                  `\`${types.join("`, `")}\``
                ].join("\n")
              );
          }
        }
      ]
    });
  }
};
