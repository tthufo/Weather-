const DAY = [
  { name: 'Quang mây, nắng nhiều', icon: require('../../assets/images/ic_weather_day_1.png') },
  { name: 'Ít mây, nắng nhiều', icon: require('../../assets/images/ic_weather_day_2.png') },
  { name: 'Nắng nóng', icon: require('../../assets/images/ic_weather_day_3.png') },
  { name: 'Nắng gián đoạn', icon: require('../../assets/images/ic_weather_day_4.png') },
  { name: 'Có sương mù', icon: require('../../assets/images/ic_weather_day_night_5.png') },
  { name: 'Nhiều mây, không mưa', icon: require('../../assets/images/ic_weather_day_night_6.png') },
  { name: 'Trời rét, không mưa', icon: require('../../assets/images/ic_weather_day_night_7.png') },
  { name: 'Mưa rào gián đoạn', icon: require('../../assets/images/ic_weather_day_8.png') },
  { name: 'Mưa rào và giông gián đoạn', icon: require('../../assets/images/ic_weather_day_night_9.png') },
  { name: 'Mưa phùn', icon: require('../../assets/images/ic_weather_day_night_10_11.png') },
  { name: 'Mưa phùn và sương mù', icon: require('../../assets/images/ic_weather_day_night_10_11.png') },
  { name: 'Mưa nhỏ', icon: require('../../assets/images/ic_weather_day_night_12.png') },
  { name: 'Mưa rào', icon: require('../../assets/images/ic_weather_day_night_13_14.png') },
  { name: 'Mưa vừa, mưa to', icon: require('../../assets/images/ic_weather_day_night_13_14.png') },
  { name: 'Mưa đá', icon: require('../../assets/images/ic_weather_day_night_15.png') },
  { name: 'Mưa dông', icon: require('../../assets/images/ic_weather_day_16.png') },
  { name: 'Trời rét, có mưa', icon: require('../../assets/images/ic_weather_day_night17.png') },
  { name: 'Trời rét, có băng giá', icon: require('../../assets/images/ic_weather_day_night_18.png') },
]

const NIGHT = [
  { name: 'Quang mây', icon: require('../../assets/images/ic_weather_night_1.png') },
  { name: 'Ít mây', icon: require('../../assets/images/ic_weather_night_2.png') },
  { name: 'Không mưa', icon: require('../../assets/images/ic_weather_night_3_4.png') },
  { name: 'Không mưa', icon: require('../../assets/images/ic_weather_night_3_4.png') },
  { name: 'Có sương mù', icon: require('../../assets/images/ic_weather_day_night_5.png') },
  { name: 'Nhiều mây, không mưa', icon: require('../../assets/images/ic_weather_day_night_6.png') },
  { name: 'Trời rét, không mưa', icon: require('../../assets/images/ic_weather_day_night_7.png') },
  { name: 'Mưa rào gián đoạn', icon: require('../../assets/images/ic_weather_night_8.png') },
  { name: 'Mưa rào và giông gián đoạn', icon: require('../../assets/images/ic_weather_day_night_9.png') },
  { name: 'Mưa phùn', icon: require('../../assets/images/ic_weather_day_night_10_11.png') },
  { name: 'Mưa phùn và sương mù', icon: require('../../assets/images/ic_weather_day_night_10_11.png') },
  { name: 'Mưa nhỏ', icon: require('../../assets/images/ic_weather_day_night_12.png') },
  { name: 'Mưa rào', icon: require('../../assets/images/ic_weather_day_night_13_14.png') },
  { name: 'Mưa vừa, mưa to', icon: require('../../assets/images/ic_weather_day_night_13_14.png') },
  { name: 'Mưa đá', icon: require('../../assets/images/ic_weather_day_night_15.png') },
  { name: 'Mưa dông', icon: require('../../assets/images/ic_weather_night_16.png') },
  { name: 'Trời rét, có mưa', icon: require('../../assets/images/ic_weather_day_night17.png') },
  { name: 'Trời rét, có băng giá', icon: require('../../assets/images/ic_weather_day_night_18.png') },
]

const NIGHT_BG = [
  { name: '-', icon: require('../../assets/images/bg_19.png') },
  { name: 'Quang mây, nắng nhiều', icon: require('../../assets/images/bg_19.png') },
  { name: 'Ít mây, nắng nhiều', icon: require('../../assets/images/bg_19.png') },
  { name: 'Nắng nóng', icon: require('../../assets/images/bg_20.png') },
  { name: 'Nắng gián đoạn', icon: require('../../assets/images/bg_20.png') },
  { name: 'Có sương mù', icon: require('../../assets/images/bg_05.png') },
  { name: 'Nhiều mây, không mưa', icon: require('../../assets/images/bg_06.png') },
  { name: 'Trời rét, không mưa', icon: require('../../assets/images/bg_06.png') },
  { name: 'Mưa rào gián đoạn', icon: require('../../assets/images/bg_08.png') },
  { name: 'Mưa rào và giông gián đoạn', icon: require('../../assets/images/bg_14.png') },
  { name: 'Mưa phùn', icon: require('../../assets/images/bg_12.png') },
  { name: 'Mưa phùn và sương mù', icon: require('../../assets/images/bg_12.png') },
  { name: 'Mưa nhỏ', icon: require('../../assets/images/bg_12.png') },
  { name: 'Mưa rào', icon: require('../../assets/images/bg_14.png') },
  { name: 'Mưa vừa, mưa to', icon: require('../../assets/images/bg_14.png') },
  { name: 'Mưa đá', icon: require('../../assets/images/bg_12.png') },
  { name: 'Mưa dông', icon: require('../../assets/images/bg_14.png') },
  { name: 'Trời rét, có mưa', icon: require('../../assets/images/bg_12.png') },
  { name: 'Trời rét, có băng giá', icon: require('../../assets/images/bg_12.png') },
]

const DAY_BG = [
  { name: '-', icon: require('../../assets/images/bg_01.png') },
  { name: 'Quang mây', icon: require('../../assets/images/bg_01.png') },
  { name: 'Ít mây', icon: require('../../assets/images/bg_02.png') },
  { name: 'Không mưa', icon: require('../../assets/images/bg_03.png') },
  { name: 'Không mưa', icon: require('../../assets/images/bg_04.png') },
  { name: 'Có sương mù', icon: require('../../assets/images/bg_05.png') },
  { name: 'Nhiều mây, không mưa', icon: require('../../assets/images/bg_06.png') },
  { name: 'Trời rét, không mưa', icon: require('../../assets/images/bg_06.png') },
  { name: 'Mưa rào gián đoạn', icon: require('../../assets/images/bg_08.png') },
  { name: 'Mưa rào và giông gián đoạn', icon: require('../../assets/images/bg_14.png') },
  { name: 'Mưa phùn', icon: require('../../assets/images/bg_12.png') },
  { name: 'Mưa phùn và sương mù', icon: require('../../assets/images/bg_12.png') },
  { name: 'Mưa nhỏ', icon: require('../../assets/images/bg_12.png') },
  { name: 'Mưa rào', icon: require('../../assets/images/bg_14.png') },
  { name: 'Mưa vừa, mưa to', icon: require('../../assets/images/bg_14.png') },
  { name: 'Mưa đá', icon: require('../../assets/images/bg_12.png') },
  { name: 'Mưa dông', icon: require('../../assets/images/bg_14.png') },
  { name: 'Trời rét, có mưa', icon: require('../../assets/images/bg_12.png') },
  { name: 'Trời rét, có băng giá', icon: require('../../assets/images/bg_12.png') },
]

const DEFAULT_BG_DAY = require('../../assets/images/bg_01.png')
const DEFAULT_BG_NIGHT = require('../../assets/images/bg_19.png')


export default ICON = {
  DAY,
  NIGHT,
  DAY_BG,
  NIGHT_BG,
  DEFAULT_BG_DAY,
  DEFAULT_BG_NIGHT
}