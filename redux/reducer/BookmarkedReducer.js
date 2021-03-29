import firebase from '../../config/firebase';
import * as BookmarkedAction from '../action/BookmarkedActions';

const initialState = {
  bookmarkedUsers: [],
  ids: [],
};

export const fetchAsync = () => {
  return dispatch => {
    const newState = initialState;
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('bookmarked')
      .get()
      .then(snapshot => {
        console.log('fetched', snapshot.size);
        snapshot.docs.forEach(document => {
          newState.bookmarkedUsers.push(document.data());
          newState.ids.push(document.id);
        });
        console.log('dispatching', newState);
        dispatch(
          BookmarkedAction.SaveAll({
            bookmarked: newState.bookmarkedUsers,
            ids: newState.ids,
          }),
        );
      })
      .catch(ex => {});
  };
};

export const BookmarkedReducer = (state = initialState, action) => {
  if (action.type === BookmarkedAction.SAVE_ALL) {
    return {bookmarkedUsers: action.bookmarked, ids: action.ids};
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
    };
  } else if (action.type === BookmarkedAction.REMOVE_BOOKMARKED_USER) {
    return {
      ...state,
      bookmarkedUsers: state.bookmarkedUsers.filter(
        user => user.id !== action.id,
      ),
      ids: state.ids.filter(id => id !== action.id),
    };
  }
  return state;
};
