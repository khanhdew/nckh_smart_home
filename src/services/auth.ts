import auth from '@react-native-firebase/auth';

export const signUpWithEmail = (email, password) => {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User account created & signed in!');
    });
};

export const signInWithEmail = (email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('Sign in complete');
    });
};
