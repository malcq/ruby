/**
 * Message animation timings,
 * BotMessageTime = FAKE_TYPE_TIME + MESSAGE_TRANSFORM_FROM_TYPING_TIME + MESSAGE_CONTENT_FILL_TIME;
 * linkMessageTime = FLY_IN_MESSAGE_TIME_BOT;
 */
export const CHAT_ANIMATION_CONFIG = {
  FAKE_TYPE_TIME: 1300,
  FLY_IN_MESSAGE_TIME_BOT: 200,
  FLY_IN_MESSAGE_DELAY_BOT: 300,
  AVATAR_ANIMATION: 300,
  MESSAGE_TRANSFORM_FROM_TYPING_TIME: 400,
  MESSAGE_CONTENT_FILL_TIME: 400,
  PAUSE_BETWEEN_MESSAGES: 500,
};

const getMessageTimeWithAvatar = () => {
  const {
    AVATAR_ANIMATION,
    FLY_IN_MESSAGE_DELAY_BOT,
    FAKE_TYPE_TIME,
    MESSAGE_TRANSFORM_FROM_TYPING_TIME,
    MESSAGE_CONTENT_FILL_TIME,
  } = CHAT_ANIMATION_CONFIG;

  return AVATAR_ANIMATION +
    FLY_IN_MESSAGE_DELAY_BOT +
    FAKE_TYPE_TIME +
    MESSAGE_TRANSFORM_FROM_TYPING_TIME +
    MESSAGE_CONTENT_FILL_TIME;
};

/**
 * Get full timing for bot message animation
 * @param config.withoutTyping message without '...' typing icon
 * @param config.withAvatar bot message has avatar
 */
export const getFullBotMessageTime = ({
  withoutTyping = false,
  withAvatar = false,
} = {}) => {
  if (withoutTyping) {
    return CHAT_ANIMATION_CONFIG.FLY_IN_MESSAGE_TIME_BOT;
  }

  if (withAvatar) {
    return getMessageTimeWithAvatar();
  }

  const {
    FAKE_TYPE_TIME,
    MESSAGE_TRANSFORM_FROM_TYPING_TIME,
    MESSAGE_CONTENT_FILL_TIME,
  } = CHAT_ANIMATION_CONFIG;

  return FAKE_TYPE_TIME +
    MESSAGE_TRANSFORM_FROM_TYPING_TIME +
    MESSAGE_CONTENT_FILL_TIME;
};
