import firebase from '../../config/firebase';
import * as BookmarkedAction from '../action/BookmarkedActions';

const initialState = {
  bookmarkedUsers: [],
  ids: [],
  loading: false,
};

export const fetchAsync = () => {
  return dispatch => {
    dispatch(
      BookmarkedAction.SaveAll({
        bookmarked: [],
        ids: [],
        loading: true,
      }),
    );
    const newState = initialState;
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('bookmarked')
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(document => {
          newState.bookmarkedUsers.push(document.data());
          newState.ids.push(document.id);
        });
        dispatch(
          BookmarkedAction.SaveAll({
            bookmarked: newState.bookmarkedUsers,
            ids: newState.ids,
            loading: false,
          }),
        );
      })
      .catch(ex => {});
  };
};

export const BookmarkedReducer = (state = initialState, action) => {
  if (action.type === BookmarkedAction.SAVE_ALL) {
    state.bookmarkedUsers = action.bookmarked;
    state.ids = action.ids;
    state.loading = action.loading;
    return {...state};
  } else if (action.type === BookmarkedAction.ADD_BOOKMARKED_USER) {
    state.bookmarkedUsers = [
      ...state.bookmarkedUsers,
      {
        id: action.id,
        photoURL: action.photoURL,
        displayName: action.displayName,
      },
    ];
    state.ids = [...state.ids, action.id];
    state.loading = false;
    return {...state};
  } else if (action.type === BookmarkedAction.REMOVE_BOOKMARKED_USER) {
    state.bookmarkedUsers = state.bookmarkedUsers.filter(
      user => user.id !== action.id,
    );
    state.ids = state.ids.filter(id => id !== action.id);
    state.loading = false;
    return {...state};
  }
  return state;
};
