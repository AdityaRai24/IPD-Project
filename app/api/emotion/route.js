// import { NextResponse } from 'next/server';
// import FormData from 'form-data';
// import fetch from 'node-fetch';

// export async function POST(request) {
//   try {
//     const { image } = await request.json();

//     if (!image) {
//       return NextResponse.json(
//         { error: 'Image is required' },
//         { status: 400 }
//       );
//     }

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

//     // Call Face++ API endpoint
//     const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
//       method: 'POST',
//       body: form,
//     });

//     const data = await response.json();

//     // Check if any face was detected
//     if (data.faces && data.faces.length > 0) {
//       return NextResponse.json({ emotions: data.faces[0].attributes.emotion });
//     } else {
//       return NextResponse.json({ error: 'No face detected' }, { status: 200 });
//     }
//   } catch (error) {
//     console.error('Error in emotion API route:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import FormData from 'form-data';
import fetch from 'node-fetch';

export async function POST(request) {
  try {
    const { image } = await request.json();

    if (!image) {
      console.log('No image received');
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    // Remove the "data:image/jpeg;base64," prefix (if present)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    
    // Convert base64 string into a Buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // Build a FormData payload
    const form = new FormData();
    form.append('api_key', process.env.FACEPP_API_KEY);
    form.append('api_secret', process.env.FACEPP_API_SECRET);
    form.append('return_attributes', 'emotion');
    form.append('image_file', buffer, { filename: 'image.jpg' });

    console.log('Calling Face++ API...');
    // Call Face++ API endpoint
    const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
      method: 'POST',
      body: form,
    });

    const data = await response.json();
    console.log('Face++ API response:', data);

    // Check if any face was detected
    if (data.faces && data.faces.length > 0) {
      return NextResponse.json({ emotions: data.faces[0].attributes.emotion });
    } else {
      return NextResponse.json({ error: 'No face detected' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error in emotion API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

//try
// app/api/emotion/route.js
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   try {
//     const { image } = await request.json();

//     if (!image) {
//       return NextResponse.json(
//         { error: 'Image is required' },
//         { status: 400 }
//       );
//     }

//     // Remove the "data:image/jpeg;base64," prefix
//     const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    
//     // Convert base64 to binary
//     const imageData = Buffer.from(base64Data, 'base64');

//     // Call Hugging Face API
//     const response = await fetch(
//       "https://api-inference.huggingface.co/models/dima806/facial_emotions_image_detection", 
//       {
//         headers: { 
//           Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
//           "Content-Type": "application/json"
//         },
//         method: "POST",
//         body: JSON.stringify({ inputs: base64Data })
//       }
//     );

//     const result = await response.json();

//     // Transform the result to match our expected format
//     if (result && result[0]) {
//       const emotions = {
//         happy: 0,
//         sad: 0,
//         angry: 0,
//         neutral: 0,
//         surprise: 0,
//         fear: 0,
//         disgust: 0
//       };

//       result[0].forEach(prediction => {
//         emotions[prediction.label.toLowerCase()] = prediction.score * 100;
//       });

//       return NextResponse.json({ emotions });
//     }

//     return NextResponse.json({ error: 'No face detected' }, { status: 200 });
//   } catch (error) {
//     console.error('Error in emotion API route:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }