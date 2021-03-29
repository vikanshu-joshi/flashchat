export const SAVE_ALL = 'save all bookmarked users';
export const ADD_BOOKMARKED_USER = 'add new bookmarked user';
export const REMOVE_BOOKMARKED_USER = 'remove bookmarked user';
export const LOADING_BOOKMARKS = 'loading bookmarks';

export const SaveAll = ({bookmarked, ids}) => {
  return {
    type: SAVE_ALL,
    bookmarked,
    ids,
  };
};

export const AddBookmark = ({id, photoURL, displayName}) => {
  return {
    type: ADD_BOOKMARKED_USER,
    id,
    photoURL,
    displayName,
  };
};

export const RemoveBookmark = ({id}) => {
  return {
    type: REMOVE_BOOKMARKED_USER,
    id,
  };
};

export const LoadingBookmarks = () => {
  return {
    type: LOADING_BOOKMARKS,
  };
};
