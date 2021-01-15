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
    return 'km/h'
  }

  if (w && w.wind && w.wind == '2') {
    return 'm/s'
  }

  return 'km/h'
}

export const tempUnit = async () => {
  let w = await STG.getData('temperature')

  if (w && w.temp && w.temp == '1') {
    return '°C'
  }

  if (w && w.temp && w.temp == '2') {
    return '°F'
  }

  return '°C'
}

export const formatUv = (uv) => {
  if (uv == null) return "-";
  else if (uv >= 0 && uv <= 2) return "Thấp";
  else if (uv >= 3 && uv <= 5) return "Trung bình";
  else if (uv >= 6 && uv <= 7) return "Cao";
  else if (uv >= 8 && uv <= 10) return "Rất cao";
  else if (uv >= 11) return "Nguy hại";
  else return "-";
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