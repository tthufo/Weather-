let changeListeners = [];
let actions = {
};


const backButtonAndroidService = {
  getActions: () => actions,
  setActions: (action1) => {
      actions = action1;
      changeListeners.forEach((l) => l(actions));
  },
  addListener: (object) => {
    if (changeListeners.every((item) => item !== object)) {
      changeListeners.push(object);
    }
  },
  removeListener: (object) => {
    changeListeners = changeListeners.filter((item) => item !== object);
  }
};

export default backButtonAndroidService;