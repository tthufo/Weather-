import AsyncStorage from '@react-native-community/async-storage';

const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
  }
}

const getData = async (key) => {
  try {
    const item = await AsyncStorage.getItem(key)
    if (item !== null) {
      return JSON.parse(item);
    }
  } catch (e) {
  }
}

const clearData = async () => {
  try {
    await AsyncStorage.clear()
  } catch (e) {
  }
}

const clear = async (name) => {
  try {
    await AsyncStorage.removeItem(name)
  } catch (e) {
  }
}

export default STG = {
  saveData,
  getData,
  clearData,
  clear,
}

