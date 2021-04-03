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
    ref.onSnapshot(snapshot => {
      if (snapshot.size === 0)
        dispatch(ChatActions.LoadingChats({loading: false}));
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          dispatch(
            ChatActions.NewIncomingMessage({
              messageData: {...data},
            }),
          );
        } else if (change.type === 'modified') {
          const data = change.doc.data();
          dispatch(
            ChatActions.NewIncomingMessage({
              messageData: {...data},
            }),
          );
        } else if (change.type === 'removed') {
          console.log('Removed chat: ', change.doc.data());
        }
      });
    });
  };
};

export const ChatsReducer = (state = initialState, action) => {
  if (action.type === ChatActions.CHANGE_STATE) {
    return {
      ...action.state,
    };
  } else if (action.type === ChatActions.LOADING_CHATS) {
    return {
      ...state,
      loading: action.loading,
    };
  } else if (action.type === ChatActions.NEW_MESSAGE) {
    const currentids = state.ids;
    if (!currentids.includes(action.messageData.uid))
      currentids.push(action.messageData.uid);
    return {
      ...state,
      ids: currentids,
      chats: {
        ...state.chats,
        [action.messageData.uid]: action.messageData,
      },
      loading: false,
      unreadCount: {
        ...state.unreadCount,
        [action.messageData.id]: action.messageData.unreadCount,
      },
    };
  }
  return state;
};
