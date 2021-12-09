// var admin = require("firebase-admin");

// var serviceAccount = require("./serviceAccountKey.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// //middleware function to check authentication
// function checkAuthentication(req, res, next) {
//     if (req.headers.authtoken) {
//         admin
//             .auth()
//             .verifyIdToken(req.headers.authtoken)
//             .then((token) => {
//                 //console.log(token)
//                 req.authtoken = { email: token.email }
//                 next();
//             })
//             .catch(() => {
//                 res.status(403).send('Unauthorized')
//             });
//     } else {
//         res.status(403).send('Unauthorized')
//     }
// }

const admin = require('firebase-admin')
admin.initializeApp();

/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body.
 */
async function checkAuthentication(req, res, next) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req['currentUser'] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }
  next();
}

module.exports = {
    checkAuthentication
}