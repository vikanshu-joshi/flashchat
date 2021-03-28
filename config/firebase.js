import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDY7-XKa0jtbTKiv1yi6QJwjelORAWxQ7A',
  authDomain: 'flamechat-7181e.firebaseapp.com',
  projectId: 'flamechat-7181e',
  storageBucket: 'flamechat-7181e.appspot.com',
  messagingSenderId: '998374062778',
  appId: '1:998374062778:web:fdbad55ad0e5732b09e083',
};

firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({experimentalForceLongPolling: true});
export default firebase;
