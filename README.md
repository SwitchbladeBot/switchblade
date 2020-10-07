<div align="center">
  <img src="https://i.imgur.com/LID4HYe.png"><br><br>

  <img src="https://i.imgur.com/SVyi88i.png"><br>

  [![support][support-image]][support-invite]
  
  [![crowdin][crowdin-badge]][crowdin-url]
  [![jetbrains][jetbrains-badge]][jetbrains-url]
  [![codeclimate][codeclimate-badge]][codeclimate-url]
  [![ghactions][ghactions-badge]][ghactions-url]
  ![servers-badge]
  ![commands-badge]
  ![languages-badge]
  [![backers][backers-badge]][backers-url]
  [![sponsors][sponsors-badge]][sponsors-url]
  [![hacktober][hacktoberfest-badge]][hacktoberfest-url]
  <br>
  <br>
  <strong><a href="https://invite.switchblade.xyz/">CLICK HERE TO ADD SWITCHBLADE TO YOUR SERVER</a></strong>
</div>

---

<h2 align="center">Switchblade</h2>

Switchblade is a free and open source solution to your server managing problems, built from scratch with code organization and quality in mind. Our goal is to cover as many functionalities and niches as possible, while still maintaining high quality.

<h3>Table of Contents</h3>

- [Commands](#commands)
- [Music](#music)
  - [Playback control commands](#playback-control-commands)
- [Contributing](#contributing)
  - [Ideas and discussion](#ideas-and-discussion)
  - [Writing code](#writing-code)
  - [Reporting bugs](#reporting-bugs)
  - [Triaging bug reports](#triaging-bug-reports)
  - [Translation](#translation)
- [Self-hosting](#self-hosting)
- [Branching, canary and updates](#branching-canary-and-updates)
- [Sponsors](#sponsors)
- [Backers](#backers)
- [Hacktoberfest](#hacktoberfest)

<h2 align="center">Commands</h2>

Switchblade has over 130 commands, and having to update a list here would be unproductive. Instead, we have a commands page on our website that pulls command metadata straight out of the running bot, so you always get the latest information. **[Check it out!](https://switchblade.xyz/commands)**

<h2 align="center">Music</h2>

We've put a lot of effort into our music system, so you always get the best listening experience. Our system accepts URLs from many different services, like **YouTube**, **SoundCloud**, **Spotify**, **Deezer**, **Mixer**, **Twitch**, and many more. In order to provide you ears with delightful lag-free music, we've spread our Lavalink nodes around the globe, so there's always a low latency connection available to the voice server you're in.

To play a song, join a voice channel and type **`s!play <query>`**. The `<query>` can be anything you want, from a song name to a **Spotify playlist URL**, we've got you covered!

### Playback control commands

Command|Description
-|-
**`s!play <song>`**|Plays a song or adds it to the queue
**`s!queue`**|Displays the current queue
**`s!queue remove <number>`**| Removes a specific song from the queue
**`s!queue jump <number>`**| Jumps to a specific song on the queue
**`s!queue clear`**| Removes everything from the queue, except the current song
**`s!queue shuffle`**| Shuffles the queue
**`s!skip`**| Skips the current song
**`s!volume <0-150>`**| Adjusts the volume
**`s!bassboost`**| We'll leave this one for you to try yourself.

<h2 align="center">Contributing</h2>

**We want everyone to be able to help with Switchblade as easily as possible,** so we've created a list with the many ways you can contribute to the project. Take a look, and if you think you can help with any of these, please do! If you have any questions, don't hesitate to [join our community server](http://support.switchblade.xyz) and ask as many questions as you want.

### Ideas and discussion

Have an awesome idea for a new command? We'd love to hear about it, no matter how silly you think it is. For us, no idea is a bad idea, so please [open an issue](https://github.com/SwitchbladeBot/switchblade/issues/new) describing what you have in mind. We'll discuss it and, quite possibly, add it to the bot! You can also help by giving your opinion on [one of the many existing ideas](https://github.com/SwitchbladeBot/switchblade/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3A%22type%3A+idea%22+) we have on our list.

### Writing code

If you know how to code in JavaScript, then feel free to give [one of the existent ideas](https://github.com/SwitchbladeBot/switchblade/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3A%22type%3A+idea%22+) a try. [Fork this repository](https://github.com/SwitchbladeBot/switchblade/fork), make some changes and then open a pull request! We don't really have much documentation on how the bot ecosystem works, but you should be able to get it with a quick look under the hood.

> ⚠ **Please don't open Pull Requests with features that haven't been discussed as issues yet.** We don't want you to waste time writing a feature that might get denied. If you have an idea and want it to be in the bot, check the [Ideas and discussion](#ideas-and-discussion) paragraph above.

### Reporting bugs

Found something crashes the bot? Something isn't working like intended? Please let us know! Whenever you find a bug flying around, [try using one of these](https://gist.githubusercontent.com/pedrofracassi/fa560c3932eb4438e6033203cc8058bc/raw/37440ba7d730a9c539865f72ebc9992eb32d6b7e/bug.jpg). If that doesn't work, don't hesitate to [write a bug report](https://github.com/SwitchbladeBot/switchblade/issues/new?template=Bug_report.md). Please give us as much information as you can, preferably filling all of the fields provided on the template.

### Triaging bug reports

There are probably many [bug reports](https://github.com/SwitchbladeBot/switchblade/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3A%22type%3A+bug%22+) in the issues tab of this repo already. You can help by triaging them and telling us if the, or maybe writing a comment with more information about it. The reports should have a step-by-step guide on how to reproduce the problem, so go ahead! Try to reproduce a bug yourself and tell us what you found.

### Translation

One of our main goals is to make Switchblade avaliable as many people as possible, and that's why we have put together an awesome team consisting of **more than 50 translators** from all around the globe. Do you want to be a part of it? Awesome! We translate our strings through **Crowdin**, a platform made for software localisation. Go to [our Crowdin page](http://translate.switchblade.xyz) and request to join the team. After that, join our [community server](http://support.switchblade.xyz) and ping one of the translation managers so they can accept you and give you your roles. [**Ah, and did we mention that translators get an awesome badge on their profile card?**](https://cdn.discordapp.com/attachments/445203869115351041/587286168308154369/profile.jpg)

<h2 align="center">Self-hosting</h2>

**We ask you to please not host your own instance of Switchblade.** Even though our license allows it, self-hosted instances of the bot have brought us a lot of headache in the past. If you're considering self-hosting, please [try the official instance of the bot first](http://invite.switchblade.xyz/). If you have any concerns about the security of our instance, please contact us. We'd love to talk and answer any questions you have.

> If you're really really really going to self-host the bot, please [read our license](https://github.com/SwitchbladeBot/switchblade/blob/dev/LICENSE) first, and be aware that we don't provide any self-hosting support. **You'll be on your own.**

<h2 align="center">Branching, canary and updates</h2>

We work on the `dev` branch, which is deployed automagically to **Switchblade Canary**, our private testing , whenever commits are pushed. Canary isn't publicly avaliable for everyone to add to their servers, but, if you ask nicely enough, we might open an exception.

Once we feel like the code on `dev` is stable enough, we merge it to the `master` branch, that gets deployed to **Switchblade**, the public instance that everyone can [add to their servers](https://invite.switchblade.xyz/).

We usually do that every two months or so, but we might skip a month if we're not confident enough about the reliability of the current code. To get to know about updates as soon as they happen, follow us on medium or join our community server. We post detailed updates notes as soon as stuff goes live.

<h2 align="center">Sponsors</h2>

Sponsors are organizations and companies that contribute to our projects with money. They get their logo with a link to their website on this page! [Click here and become a sponsor today!][sponsors-url]

<a href="https://opencollective.com/switchblade/sponsor/0/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/0/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/1/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/1/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/2/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/2/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/3/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/3/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/4/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/4/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/5/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/5/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/6/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/6/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/7/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/7/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/8/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/8/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/9/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/9/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/10/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/10/avatar.svg?requireActive=false"></a>

<h2 align="center">Backers</h2>

Backers are the people who contribute to our projects monetarily. They get their image with a link to their website on this page, an awesome badge on their Switchblade profile and a role that grants exclusive access to some channels in our discord server. [Click here and become a backer today!][backers-url]

<a href="https://opencollective.com/switchblade/backer/0/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/0/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/1/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/1/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/2/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/2/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/3/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/3/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/4/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/4/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/5/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/5/avatar.svg?requireActive=false&a=1"></a>
<a href="https://opencollective.com/switchblade/backer/6/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/6/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/7/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/7/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/8/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/8/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/9/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/9/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/10/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/10/avatar.svg?requireActive=false"></a>

<h2 align="center">Hacktoberfest</h2>

We are totally Hacktoberfest friendly, in 2020 we are even giving Switchblade Stickers to those who open 3 or more _valid_ PRs to Switchblade during October, please check our issue tab clicking [here.][hacktoberfest-url]

[support-invite]: https://support.switchblade.xyz
[support-image]: https://invidget.switchblade.xyz/2FB8wDG

[crowdin-url]: https://translate.switchblade.xyz
[crowdin-badge]: https://d322cqt584bo4o.cloudfront.net/switchblade/localized.svg

[jetbrains-url]: https://www.jetbrains.com/?from=switchblade/
[jetbrains-badge]: https://img.shields.io/badge/Powered%20by%20JetBrains-gray.svg?logo=webstorm

[codeclimate-url]: https://codeclimate.com/github/SwitchbladeBot/switchblade/maintainability
[codeclimate-badge]: https://img.shields.io/codeclimate/maintainability/SwitchbladeBot/switchblade.svg

[ghactions-url]: https://github.com/SwitchbladeBot/switchblade/actions?query=workflow%3ACI
[ghactions-badge]: https://github.com/SwitchbladeBot/switchblade/workflows/CI/badge.svg

[backers-url]: https://opencollective.com/switchblade#backer
[backers-badge]: https://opencollective.com/switchblade/tiers/backer/badge.svg?label=backers&color=brightgreen

[sponsors-url]: https://opencollective.com/switchblade#sponsor
[sponsors-badge]: https://opencollective.com/switchblade/tiers/sponsor/badge.svg?label=sponsors&color=brightgreen

[servers-badge]: https://img.shields.io/badge/dynamic/json.svg?label=servers&colorB=7289DA&url=https://prod.switchblade.xyz/api/statistics&query=serverCount

[commands-badge]: https://img.shields.io/badge/dynamic/json.svg?label=commands&colorB=7289DA&url=https://prod.switchblade.xyz/api/statistics&query=commandCount

[languages-badge]: https://img.shields.io/badge/dynamic/json.svg?label=languages&colorB=7289DA&url=https://prod.switchblade.xyz/api/statistics&query=languageCount

[hacktoberfest-badge]: https://img.shields.io/static/v1?label=hacktoberfest&message=friendly&color=success
[hacktoberfest-url]: https://github.com/SwitchbladeBot/switchblade/issues?q=is%3Aopen+is%3Aissue+label%3Ahacktoberfest

<!-- Widgets -->
[discordbots-widget]: https://discordbots.org/api/widget/445277324175474689.svg
[botsfordiscord-widget]: https://botsfordiscord.com/api/bot/445277324175474689/widget
[discordbotlist-widget]: https://discordbotlist.com/bots/445277324175474689/widget
