import clientPromise from "../util/mongodb";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    if (req.body) {
      const { email, password } = req.body;

      if (email) {
        const client = await clientPromise;
        const db = client.db("learners-kingdom");
        const query = { email };
        console.log(email);
        const result = await db.collection('users').findOne(query);
        console.log(result);
        if (result) {
          // Directly compare stored password (assumed plain text now)
          if (result.password === password) {
            const token = jwt.sign(email, process.env.JWT_KEY);
            res.status(200).json({ success: true, token: token });
          } else {
            return res.json({ success: false, message: 'Invalid credentials' });
          }
        } else {
          return res.json({ success: false, message: 'User not found' });
        }
      } else {
        return res.json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
  } else {
    res.status(400).json({ success: false, error: 'error' });
  }
}