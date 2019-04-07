module.exports = {
  Songs: {
    // HTTP
    HTTPSong: require('./http/HTTPSong.js'),

    // Mixer
    MixerSong: require('./mixer/MixerSong.js'),

    // SoundCloud
    SoundcloudSong: require('./soundcloud/SoundcloudSong.js'),

    // Twitch
    TwitchSong: require('./twitch/TwitchSong.js'),

    // YouTube
    YoutubePlaylist: require('./youtube/YoutubePlaylist.js'),
    YoutubeSong: require('./youtube/YoutubeSong.js')
  },
  Sources: {
    DeezerSongSource: require('./deezer/DeezerSongSource.js'),
    SpotifySongSource: require('./spotify/SpotifySongSource.js')
  }
}
