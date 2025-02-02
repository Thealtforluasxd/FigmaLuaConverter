
const { Client, GatewayIntentBits } = require('discord.js');
const { parseFigmaToRoblox } = require('./converters/FigmaConverter');
const config = require('./config.json');
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ] 
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (!config.ALLOWED_CHANNELS.includes(message.channelId)) return;
  
  const attachment = message.attachments.first();
  if (attachment?.name.endsWith('.txt')) {
    try {
      const luaCode = await parseFigmaToRoblox(attachment.url);
      message.reply({
        files: [{
          name: `converted_${Date.now()}.lua`,
          attachment: Buffer.from(luaCode)
        }]
      });
    } catch (error) {
      message.reply(`❌ Hata: ${error.message}`);
    }
  }
});

client.login(config.TOKEN);
