import { RunFunction } from '../../interfaces/Command';
import * as api from 'imageapi.js';

export const run: RunFunction = async (client, message, args) => {
	const subreddits: string[] = ['meme', 'memes', 'dankmemes'];
	const s: string = subreddits[Math.floor(Math.random() * subreddits.length)];

	const meme = await api.advanced(s, 'new');
	message.channel.send(
		client.embed(
			{
				title: meme.title,
				author: {
					name: message.author.username
				},
				image: {
					url: meme.img,
				},
				description: `\`${meme.upvoteRatio}%\` of people like this meme. \n Votes: 👍${meme.upvotes}👎 ${meme.downvotes} \n From: r/${meme.author}`,
			},
			message
		)
	);
};

export const name: string = 'meme';
export const aliases: string[] = ['memes'];
export const category: string = 'fun';
export const cooldown: number = 10;
