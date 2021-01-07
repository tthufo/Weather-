import STG from "../../service/storage";

export const temperature = async (temp) => {
  let t = await STG.getData('temperature')

  if (t && t.temp && t.temp == '1') {
    return Math.round(temp)
  }

  if (t && t.temp && t.temp == '2') {
    return Math.round((temp * 1.8) + 32)
  }

  return Math.round(temp)
}

export const wind = async (wind) => {
  let w = await STG.getData('wind')

  if (w && w.wind && w.wind == '1') {
    return Math.round(wind)
  }

  if (w && w.wind && w.wind == '2') {
    return Math.round((wind * 3.6) + 0)
  }

  return Math.round(wind)
}

export const windUnit = async () => {
  let w = await STG.getData('wind')

  if (w && w.wind && w.wind == '1') {
    return 'm/s'
  }

  if (w && w.wind && w.wind == '2') {
    return 'km/h'
  }

  return 'm/s'
}

export const weatherImage = (image) => {
  let images = [
    require('../../assets/images/ico_01.png'),
    require('../../assets/images/ico_02.png'),
    require('../../assets/images/ico_03.png'),
    require('../../assets/images/ico_04.png'),
    require('../../assets/images/ico_05.png'),
    require('../../assets/images/ico_06.png'),
    require('../../assets/images/ico_07.png'),
    require('../../assets/images/ico_08.png'),
    require('../../assets/images/ico_09.png'),
    require('../../assets/images/ico_10.png'),
    require('../../assets/images/ico_11.png'),
    require('../../assets/images/ico_12.png'),
    require('../../assets/images/ico_13.png'),
    require('../../assets/images/ico_14.png'),
    require('../../assets/images/ico_15.png'),
    require('../../assets/images/ico_16.png'),
    require('../../assets/images/ico_17.png'),
    require('../../assets/images/ico_18.png'),
    require('../../assets/images/ico_19.png'),
    require('../../assets/images/ico_20.png'),
    require('../../assets/images/ico_21.png'),
  ]

  return images[image]
}