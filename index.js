import 'dotenv/config'
import linebot from 'linebot'
import axios from 'axios'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})
bot.on('message', async event => {
  if (event.message.type === 'text') {
    try {
      const { data } = await axios.get('https://cloud.culture.tw/frontsite/trans/emapOpenDataAction.do?method=exportEmapJson&typeId=M')
      console.log(data.name)
      for (const info of data) {
        if (info.name === event.message.text) {
          event.reply([
            info.intro,
            {
              type: 'location',
              title: info.name,
              address: info.address,
              latitude: info.latitude,
              longitude: info.longitude
            }
          ])
          return
        }
      }
      event.reply('找不到')
    } catch (error) {
      console.log(error)
      event.reply('發生錯誤')
    }
  }
})
bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人已開啟')
})
