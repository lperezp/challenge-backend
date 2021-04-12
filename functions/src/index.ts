import * as functions from "firebase-functions";

import * as admin from 'firebase-admin';

const serviceAccount = require('./servicesAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://reto-oechsle-d0c94.firebaseio.com',
});

const db = admin.firestore();

const cors = require('cors')({
  origin: true,
}); 

exports.getClients = functions.https.onRequest((req, res)=>{
  try {
    cors(req, res, async () => {
      const clientsRef = db.collection('clients');
        const docsSnap = await clientsRef.get();
    const listClients = docsSnap.docs.map((doc) => doc.data());
    res.json(listClients)
    })
  } catch (error) {
    res.json({error: `${error}`})
  }
});

exports.addClients = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
      try {
      const clientsRef = db.collection('clients');
      const docsSnap = await clientsRef.get();
      const listClients = docsSnap.docs.map((doc) => doc.data());
      const size = listClients.length + 1;
      const { name,lastname,dateBirth,age } = req.body;
      const id = (size).toString().padStart(3, '0')
      const data = { id, name,lastname,dateBirth,age}
      await clientsRef.doc(`${id}`).set(data);
      res.json({ message: `Se ha registrado correctamente.` });
    } catch (error) {
      res.json({error: `${error}`})
    }
    })
});