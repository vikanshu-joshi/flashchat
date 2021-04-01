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

export const NewIncomingMessage = ({messageData}) => {
  return {
    type: NEW_MESSAGE,
    messageData,
  };
};

export const SendMessage = ({messageData}) => {
  return {
    type: SEND_MESSAGE,
    messageData,
  };
};

export const ReadMessage = ({id, messageId}) => {
  return {
    type: READ_MESSAGE,
    id,
    messageId,
  };
};
