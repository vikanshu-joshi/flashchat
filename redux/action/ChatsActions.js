export const LOADING_CHATS = 'loading chats from firebase';
export const NEW_MESSAGE = 'new incoming message';
export const SEND_MESSAGE = 'send outgoing message';
export const READ_MESSAGE = 'mark a message read';
export const CHANGE_STATE = 'change previous state with a new state';

export const LoadingChats = ({loading}) => {
  return {
    type: LOADING_CHATS,
    loading,
  };
};

export const ChangeState = ({state}) => {
  return {
    type: CHANGE_STATE,
    state,
  };
};

export const NewIncomingMessage = ({
  id,
  text,
  timestamp,
  from,
  read,
  messageId,
}) => {
  return {
    type: NEW_MESSAGE,
    id,
    text,
    timestamp,
    from,
    read,
    messageId,
  };
};

export const SendMessage = ({id, text, timestamp, from, read}) => {
  return {
    type: SEND_MESSAGE,
    id,
    text,
    timestamp,
    from,
    read,
  };
};

export const ReadMessage = ({id, messageId}) => {
  return {
    type: READ_MESSAGE,
    id,
    messageId,
  };
};
