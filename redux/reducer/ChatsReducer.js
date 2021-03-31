import * as ChatActions from '../action/ChatsActions';
import firebase from '../../config/firebase';

const initialState = {
  chats: {},
  ids: [],
  unreadCount: {},
  loading: false,
};

export const fetchAsync = () => {
  return dispatch => {
    dispatch(ChatActions.LoadingChats({loading: true}));
    const newState = initialState;
    const ref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('chats');
    ref.get().then(snapshot => {
      snapshot.docs.forEach(doc => {
        newState.ids.push(doc.id);
        newState.chats[doc.id] = [];
      });
      if (snapshot.size === 0) {
        dispatch(ChatActions.LoadingChats({loading: false}));
      }
      for (let index = 0; index < newState.ids.length; index++) {
        const element = newState.ids[index];
        ref
          .doc(element)
          .collection('messages')
          .orderBy('timestamp')
          .get()
          .then(data => {
            data.docs.forEach(message => {
              const messageData = message.data();
              console.log(messageData, firebase.auth().currentUser.uid);
              if (
                !messageData.read &&
                messageData.from !== firebase.auth().currentUser.uid
              ) {
                newState.unreadCount[messageData.from]
                  ? (newState.unreadCount[messageData.from] =
                      newState.unreadCount[messageData.from] + 1)
                  : (newState.unreadCount[messageData.from] = 0);
              }
              newState.chats[element].push({
                ...messageData,
                messageId: message.id,
              });
            });
            dispatch(ChatActions.ChangeState({state: newState}));
            if (index === newState.ids.length - 1) {
              dispatch(ChatActions.LoadingChats({loading: false}));
            }
          });
      }
    });
  };
};

export const ChatsReducer = (state = initialState, action) => {
  if (action.type === ChatActions.CHANGE_STATE) {
    state.chats = action.state.chats;
    state.loading = action.state.loading;
    state.ids = action.state.ids;
    state.unreadCount = action.state.unreadCount;
    return state;
  } else if (action.type === ChatActions.LOADING_CHATS) {
    return {
      ...state,
      loading: action.loading,
    };
  } else if (action.type === ChatActions.NEW_MESSAGE) {
    if (!state.ids.includes(action.id)) {
      return {
        ...state,
        unreadCount: state.unreadCount + 1,
        ids: [action.id, ...state.ids],
        chats: {
          ...state.chats,
          [action.id]: [
            {
              id: action.id,
              text: action.text,
              timestamp: action.timestamp,
              from: action.from,
              read: action.read,
              messageId: action.messageId,
            },
          ],
        },
      };
    } else {
      return {
        ...state,
        // unreadCount: state.unreadCount + 1,
        chats: {
          ...state.chats,
          [action.id]: [
            ...state.chats[action.id],
            {
              id: action.id,
              text: action.text,
              timestamp: action.timestamp,
              from: action.from,
              read: action.read,
              messageId: action.messageId,
            },
          ],
        },
      };
    }
  } else if (action.type === ChatActions.SEND_MESSAGE) {
    if (!state.ids.includes(action.id)) {
      return {
        ...state,
        ids: [action.id, ...state.ids],
        chats: {
          ...state.chats,
          [action.id]: [
            {
              id: action.id,
              text: action.text,
              timestamp: action.timestamp,
              from: action.from,
              read: action.read,
              messageId: action.messageId,
            },
          ],
        },
      };
    } else {
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.id]: [
            ...state.chats[action.id],
            {
              id: action.id,
              text: action.text,
              timestamp: action.timestamp,
              from: action.from,
              read: action.read,
              messageId: action.messageId,
            },
          ],
        },
      };
    }
  }
  return state;
};
