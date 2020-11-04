import app from 'firebase/app'
import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { APPSTRING } from '../helpers/Const';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMOQEkR8gxHB1ywLM3RNCAd9sSiKP55XU",
  authDomain: "catalog-b015a.firebaseapp.com",
  databaseURL: "https://catalog-b015a.firebaseio.com",
  projectId: "catalog-b015a",
  storageBucket: "catalog-b015a.appspot.com",
  messagingSenderId: "478519733567",
  appId: "1:478519733567:web:76e55663b00b472dc2b78a",
  measurementId: "G-ZNWJEXX7PW"
};



class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    app.analytics();

    this.app = app;
    this.auth = app.auth();
    this.analytics = app.analytics();
    this.firestore = app.firestore();
    this.storage = app.storage();
  }


  /** AUTH API */

  doCreateUser = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignIn = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
  doSignInWithGoogle = async () => {
    let provider = new app.auth.GoogleAuthProvider()
    return this.auth.signInWithPopup(provider);
  }

  doSignInWithFacebook = async () => {
    let provider = new app.auth.FacebookAuthProvider();
    return this.auth.signInWithPopup(provider);
  }

  doSignInWithPhoneNumber = async (phone, appVerifier) => {
    return app.auth().signInWithPhoneNumber(phone, appVerifier)
      .then((confirmResult) => {
        return confirmResult;
      })
  }

  doSignOut = () =>
    this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = newPassword => this.auth.currentUser.updatePassword(newPassword);

  //** Firestore Database access */

  getCatalog = (uid) => this.firestore.collection(APPSTRING.shops).doc(uid).collection(APPSTRING.catalogItems).get();
  catalog = (uid) => this.firestore.collection(APPSTRING.shops).doc(uid).collection(APPSTRING.catalogItems);
  
  getItem = (uid, id) => this.firestore.collection(APPSTRING.shops).doc(uid).collection(APPSTRING.catalogItems).doc(id).get();
  item = (uid, id) => this.firestore.collection(APPSTRING.shops).doc(uid).collection(APPSTRING.catalogItems).doc(id);

  addItem = (uid, item) => this.firestore.collection(APPSTRING.shops).doc(uid).collection(APPSTRING.catalogItems).add(item);

  uploadImage = (img, uid) => this.storage.ref(`${APPSTRING.shops}/${uid}`).child(`img-${Date.now()}`).put(img);


  /** get current user profile */
  getCurrentUser = () => this.auth.currentUser;
  /**get user by uid */
  getUser = (uid) => this.firestore.collection(APPSTRING.shops).where(APPSTRING.ID, '==', uid).get();
  /** get all users */
  getAllUsers = () => this.firestore.collection(APPSTRING.shops).get();

  user = (uid) => this.firestore.collection(APPSTRING.shops).doc(uid);
}

export default Firebase;