export const LOADING_CHATS = 'loading logs from firebase';
export const NEW_LOG = 'new log';

export const LoadingLogs = ({loading}) => {
  return {
    type: LOADING_CHATS,
    loading,
  };
};

export const NewLogEntry = ({logData}) => {
  return {
    type: NEW_LOG,
    logData,
  };
};
