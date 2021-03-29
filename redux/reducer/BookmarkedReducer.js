import firebase from '../../config/firebase';
import * as BookmarkedAction from '../action/BookmarkedActions';

const initialState = {
  bookmarkedUsers: [],
  ids: [],
  loading: false,
};

export const fetchAsync = () => {
  return dispatch => {
    dispatch(BookmarkedAction.LoadingBookmarks());
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
        setTimeout(() => {
          dispatch(
            BookmarkedAction.SaveAll({
              bookmarked: newState.bookmarkedUsers,
              ids: newState.ids,
            }),
          );
        }, 2000);
      })
      .catch(ex => {});
  };
};

export const BookmarkedReducer = (state = initialState, action) => {
  if (action.type === BookmarkedAction.SAVE_ALL) {
    state = initialState;
    return {
      bookmarkedUsers: [...action.bookmarked],
      ids: [...action.ids],
      loading: false,
    };
  } else if (action.type === BookmarkedAction.ADD_BOOKMARKED_USER) {
    return {
      ...state,
      bookmarkedUsers: [
        ...state.bookmarkedUsers,
        {
          id: action.id,
          photoURL: action.photoURL,
          displayName: action.displayName,
        },
      ],
      ids: [...state.ids, action.id],
      loading: false,
    };
  } else if (action.type === BookmarkedAction.REMOVE_BOOKMARKED_USER) {
    return {
      ...state,
      bookmarkedUsers: state.bookmarkedUsers.filter(
        user => user.id !== action.id,
      ),
      ids: state.ids.filter(id => id !== action.id),
      loading: false,
    };
  } else if (action.type === BookmarkedAction.LOADING_BOOKMARKS) {
    return {
      ...state,
      loading: true,
    };
  }
  return state;
};
