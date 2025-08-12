import clientPromise from '../util/mongodb';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = await clientPromise;
    const db = client.db('learners-kingdom');

    if (req.body) {
      const { name, email, phone, password, address } = req.body;

      const findUser = await db.collection('users').findOne({ email: email });
      if (findUser) {
        return res.json({
          success: false,
          message: 'User already exists.',
        });
      }

      if (name.length < 3)
        return res.json({
          success: false,
          message: 'Name should be minimum 3 characters long.',
        });
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return res.json({ success: false, message: 'Invalid email.' });
      }
      if (phone.length !== 11)
        return res.json({
          success: false,
          message: 'Number should be exactly 11 characters long.',
        });
      if (password.length < 6)
        return res.json({
          success: false,
          message: 'Password should be minimum 6 characters long.',
        });

      // Storing password as plain text (for now)
      const userInfo = {
        name,
        email,
        phone,
        password,   // <-- plain password here, NOT encrypted
        address,
      };

      const result = await db.collection('users').insertOne(userInfo);
      res.status(200).json({ success: true, result });
    } else {
      return res.json({ success: false, message: 'No data found' });
    }
  } else {
    res.status(400).json({ success: false });
  }
}