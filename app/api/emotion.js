// // app/api/emotion.js
// import fetch from 'node-fetch';
// import FormData from 'form-data';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { image } = req.body;
//   if (!image) {
//     return res.status(400).json({ error: 'Image is required' });
//   }

//   try {
//     // Remove the "data:image/jpeg;base64," prefix (if present)
//     const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
//     // Convert base64 string into a Buffer
//     const buffer = Buffer.from(base64Data, 'base64');

//     // Build a FormData payload
//     const form = new FormData();
//     form.append('api_key', process.env.FACEPP_API_KEY);
//     form.append('api_secret', process.env.FACEPP_API_SECRET);
//     form.append('return_attributes', 'emotion');
//     form.append('image_file', buffer, { filename: 'image.jpg' });

//     // Call Face++ API endpoint for face detection (which returns emotion attributes)
//     const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
//       method: 'POST',
//       body: form,
//     });

//     const data = await response.json();

//     // Check if any face was detected
//     if (data.faces && data.faces.length > 0) {
//       // Face++ returns an "emotion" object inside "attributes"
//       const emotions = data.faces[0].attributes.emotion;
//       return res.status(200).json({ emotions });
//     } else {
//       return res.status(200).json({ error: 'No face detected' });
//     }
//   } catch (error) {
//     console.error('Error in emotion API route:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
