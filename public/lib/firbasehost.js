  /* jshint esversion: 6 */
  export default function fbapp(){/// Initialize Firebase
    const config = {
      apiKey: "AIzaSyAG5qxkAn8s0evOGQIBh9GQBPPepMU42F8",
      authDomain: "othellomultimedia18-19.firebaseapp.com",
      databaseURL: "https://othellomultimedia18-19.firebaseio.com",
      projectId: "othellomultimedia18-19",
      storageBucket: "othellomultimedia18-19.appspot.com",
      messagingSenderId: "984933187697"
    };
    // @ts-ignore
    firebase.initializeApp(config);
    //Get auth elements
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnLogin = document.getElementById('btnLogin');
    const btnSignUp = document.getElementById('btnSignUp');
    const btnLogout = document.getElementById('btnLogout');
    //add login event 
    btnLogin.addEventListener('click', e => {
      //Get credentials
      // @ts-ignore
      const email = txtEmail.Value;
      // @ts-ignore
      const pass = txtPassword.Value;
      // @ts-ignore
      const auth = firebase.auth();
      //Sign in
      const promise = auth.signInWithEmailAndPassword(email, pass);
      promise.catch(e => console.log(e.message));
    });
    //add signup event
    btnSignUp.addEventListener('click', e => {
      //Get credentials
      // @ts-ignore
      const email = txtEmail.Value;
      // @ts-ignore
      const pass = txtPassword.Value;
      // @ts-ignore
      const auth = firebase.auth();
      //Sign in
      const promise = auth.createUserWithEmailAndPassword(email, pass);
      promise.catch(e => console.log(e.message));
    });
    //Add a realtime listener
    // @ts-ignore
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        console.log(firebaseUser);
      } else {
        console.log('not logged in');
      }
    });
  }