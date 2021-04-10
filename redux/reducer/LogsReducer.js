import * as LogActions from '../action/LogsActions';
import firebase from '../../config/firebase';

const initialState = {
  logs: {},
  ids: [],
  loading: false,
};

export const fetchAsync = () => {
  return dispatch => {
    dispatch(LogActions.LoadingLogs({loading: true}));
    const newState = initialState;
    const ref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('logs');
    ref.orderBy('timestamp').onSnapshot(snapshot => {
      if (snapshot.size === 0)
        dispatch(LogActions.LoadingLogs({loading: false}));
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          dispatch(
            LogActions.NewLogEntry({
              logData: {...data, cid: change.doc.id},
            }),
          );
        } else if (change.type === 'modified') {
          const data = change.doc.data();
          dispatch(
            LogActions.NewLogEntry({
              logData: {...data, cid: change.doc.id},
            }),
          );
        } else if (change.type === 'removed') {
          console.log('Removed chat: ', change.doc.data());
        }
      });
    });
  };
};

export const LogsReducer = (state = initialState, action) => {
  if (action.type === LogActions.LOADING_CHATS) {
    return {
      ...state,
      loading: action.loading,
    };
  } else if (action.type === LogActions.NEW_LOG) {
    const currentids = state.ids;
    if (!currentids.includes(action.logData.cid))
      currentids.push(action.logData.cid);
    return {
      ...state,
      ids: currentids,
      logs: {
        ...state.logs,
        [action.logData.cid]: action.logData,
      },
      loading: false,
    };
  }
  return state;
};
