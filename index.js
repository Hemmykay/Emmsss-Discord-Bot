import { Client, GatewayIntentBits, Partials } from 'discord.js';

// Ensure you have the DISCORD_TOKEN environment variable set
const token = process.env.DISCORD_TOKEN;

if (!token) {
    console.error('Error: DISCORD_TOKEN environment variable not set.');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Required to read message content
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel], // Required for direct messages
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    // Ignore messages from bots to prevent infinite loops
    if (message.author.bot) return;

    // Simple ping command
    if (message.content === '!ping') {
        message.reply('Pong!');
    }

    // Send message to a specific channel: !send <channel_id> <message>
    if (message.content.startsWith('!send ')) {
        const args = message.content.slice('!send '.length).trim().split(/ +/);
        const channelId = args.shift(); // Get the channel ID
        const messageToSend = args.join(' '); // Get the rest of the message

        if (!channelId || !messageToSend) {
            return message.reply('Usage: `!send <channel_id> <message>`');
        }

        try {
            const targetChannel = await client.channels.fetch(channelId);
            if (targetChannel && targetChannel.isTextBased()) {
                await targetChannel.send(messageToSend);
                message.reply(`Message sent to channel \`${channelId}\`.`);
            } else {
                message.reply(`Could not find a text channel with ID \`${channelId}\`.`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            message.reply('There was an error trying to send the message. Make sure the channel ID is correct and the bot has permissions.');
        }
    }
});

client.login(token);