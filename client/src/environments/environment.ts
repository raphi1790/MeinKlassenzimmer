// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production : false,
  firebase: {
    apiKey: "AIzaSyCfwrUqTMbYVbfYjHLetIfJiT6vwA-Y27U",
    authDomain: "meinklassenzimmer.firebaseapp.com",
    databaseURL: "https://meinklassenzimmer.firebaseio.com",
    projectId: "meinklassenzimmer",
    storageBucket: "meinklassenzimmer.appspot.com",
    messagingSenderId: "946677335646",
    appId: "1:946677335646:web:17d2338c354f9858"
  }
};
