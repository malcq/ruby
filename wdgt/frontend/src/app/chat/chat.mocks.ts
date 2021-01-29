export const initialUserMessage = () => ({
  text: '?',
  sender: 'user',
  type: 'initial'
});


export const usualUserMessage = () => ({
  text: 'I am the simple message from user',
  sender: 'user',
  type: 'message',
  newMessage: true
});

export const usualBotMessage = () => ({
  text: 'I am the simple bot message',
  sender: 'bot',
  type: 'message',
  newMessage: true
});

export const actionsBotRequest = () => ({
  text: 'Please choose one of the options below',
  sender: 'bot',
  newMessage: true,
  type: 'actions',
  actions: [
    {
      title: 'Done',
      type: 'done',
    },
    {
      title: 'I got more',
      type: 'i-got-more',
    },
    {
      title: 'Speak to expert',
      type: 'speak-to-expert',
      payload: {
        phone: '+49 89 125016000'
      }
    },
  ],
});

export const actionsUserResponse = () => ({
  text: '',
  sender: 'user',
  type: 'actions[0].type',
});

export const loginBotRequest = () => ({
  text: 'Please enter your creds',
  sender: 'bot',
  newMessage: true,
  type: 'login',
});

export const loginUserResponse = () => ({
  text: '?',
  sender: 'bot',
  newMessage: true,
  type: 'login',  // Maybe choose another type for response, e.g. login-complete
});

export const emailInfoRequest = () => ({
  text: 'Please input your email',
  sender: 'bot',
  newMessage: true,
  type: 'email',
});

export const usernameInfoRequest = () => ({
  text: 'Please input your username',
  sender: 'bot',
  newMessage: true,
  type: 'username',
});

export const inputBotRequest = () => ({
  text: 'Please enter something inside the input box',
  sender: 'bot',
  newMessage: true,
  type: 'input',
});

export const inputNumbersBotRequest = () => ({
  text: 'Please enter some numbers in the input box',
  sender: 'bot',
  newMessage: true,
  type: 'input-numbers',
});

export const linkBotMessage = () => ({
  sender: 'bot',
  newMessage: true,
  type: 'link',
  payload: {
    link: {
      url: 'http://www.bmwusa.com/owners-manuals.html',
      image: 'https://www.bmwusa.com/content/dam/bmwusa/Forms/form__owners-manual.jpg',
      title: 'BMW DRIVER’S GUIDE: Download now.',
    },
  },
});

export const selectBotMessage = () => ({
  text: 'Select something from selector',
  sender: 'bot',
  newMessage: true,
  type: 'selector',
  payload: {
    options: [
      { title: 'Option 1' },
      { title: 'Option 2' },
      { title: 'Option 3'},
    ],
    actions: [
      {
        title: 'Dont know',
      },
    ],
  }
});

export const searchBotMessage = () => ({
  text: 'Can you **describe your idea** in 2 words?',
  sender: 'bot',
  defaultValue: 'default value',
  newMessage: true,
  type: 'search'
});
