const commando = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { play } = require("../../util/Music/Support_Play_Export");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader").default;
const {
	YOUTUBE_API_KEY,
	SOUNDCLOUD_CLIENT_ID,
	MAX_PLAYLIST_SIZE,
} = require("../../util/Music/Music_defaults");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "song-playlist",
			aliases: ["playlist"],
			group: "music",
			memberName: "music-comwefmand-023",
			description: "..",
			userPermissions: ["CONNECT", "VIEW_CHANNEL"],
			clientPermissions: ["SPEAK", "CONNECT"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 10,
			},
		});
	}
	async run(message, args) {
		const { channel } = message.member.voice;
		const serverQueue = message.client.queue.get(message.guild.id);

		if (!args.length)
			return message
				.reply(
					`Usage: ${message.client.prefix}playlist <YouTube Playlist URL | Playlist Name>`
				)
				.catch(console.error);
		if (!channel)
			return message
				.reply("You need to join a voice channel first!")
				.catch(console.error);

		const permissions = channel.permissionsFor(message.client.user);
		if (!permissions.has("CONNECT"))
			return message.reply(
				"Cannot connect to voice channel, missing permissions"
			);
		if (!permissions.has("SPEAK"))
			return message.reply(
				"I cannot speak in this voice channel, make sure I have the proper permissions!"
			);

		if (serverQueue && channel !== message.guild.me.voice.channel)
			return message
				.reply(`You must be in the same channel as ${message.client.user}`)
				.catch(console.error);

		const search = args.join(" ");
		const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
		const url = args[0];
		const urlValid = pattern.test(args[0]);

		const queueConstruct = {
			textChannel: message.channel,
			channel,
			connection: null,
			songs: [],
			loop: false,
			volume: 100,
			playing: true,
		};

		let playlist = null;
		let videos = [];

		if (urlValid) {
			try {
				playlist = await youtube.getPlaylist(url, { part: "snippet" });
				videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, {
					part: "snippet",
				});
			} catch (error) {
				console.error(error);
				return message.reply("Playlist not found :(").catch(console.error);
			}
		} else if (scdl.isValidUrl(args[0])) {
			if (args[0].includes("/sets/")) {
				message.channel.send("⌛ fetching the playlist...");
				playlist = await scdl.getSetInfo(args[0], SOUNDCLOUD_CLIENT_ID);
				videos = playlist.tracks.map((track) => ({
					title: track.title,
					url: track.permalink_url,
					duration: track.duration / 1000,
				}));
			}
		} else {
			try {
				const results = await youtube.searchPlaylists(search, 1, {
					part: "snippet",
				});
				playlist = results[0];
				videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, {
					part: "snippet",
				});
			} catch (error) {
				return message.reply(error.message).catch(console.error);
			}
		}
		// makes sure the 'string' inputed by a user is a valid playlsit, if not it will return an err message.
		try {
			const newSongs = videos.map((video) => {
				return (song = {
					title: video.title,
					url: video.url,
					duration: video.durationSeconds,
				});
			});
		} catch {
			return message.reply(
				"Cant find that playlist, make sure the link is valid"
			);
		}

		serverQueue
			? serverQueue.songs.push(...newSongs)
			: queueConstruct.songs.push(...newSongs);
		const songs = serverQueue ? serverQueue.songs : queueConstruct.songs;

		let playlistEmbed = new MessageEmbed()
			.setTitle(`${playlist.title}`)
			.setDescription(songs.map((song, index) => `${index + 1}. ${song.title}`))
			.setURL(playlist.url)
			.setColor("#c28ada")
			.setTimestamp();

		if (playlistEmbed.description.length >= 2048)
			playlistEmbed.description =
				playlistEmbed.description.substr(0, 2007) +
				"\nPlaylist larger than character limit...";

		message.channel.send(`${message.author} Started a playlist`, playlistEmbed);

		if (!serverQueue) {
			message.client.queue.set(message.guild.id, queueConstruct);

			try {
				queueConstruct.connection = await channel.join();
				await queueConstruct.connection.voice.setSelfDeaf(true);
				play(queueConstruct.songs[0], message);
			} catch (error) {
				console.error(error);
				message.client.queue.delete(message.guild.id);
				await channel.leave();
				return message.channel
					.send(`Could not join the channel: ${error.message}`)
					.catch(console.error);
			}
		}
	}
};
