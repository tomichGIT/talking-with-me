import express, { Router } from 'express';
import multer from 'multer';
import { convertSpeechToText } from './speechToText.js';
import { processTranscription } from './gptProcessing.js';
import { convertTextToSpeech } from './textToVoice.js'
import serverless from 'serverless-http';

const app = express();
const router = Router();

//router.use(express.static('public'));



const storage = multer.diskStorage({
  destination: './',
  filename: (req, file, callback) => {
    callback(null, 'audio.mp3');
  },
});
const upload = multer({ storage });


console.log("corriendo api.js");
// Serve static files from the "public" directory
app.use(express.static('public'));



// New Code
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', "./views");


// // sin utilizar router con su prepend /.netlify/functions/api...
// app.get('/', (req, res) => {
//   //console.log("trying to find2 /");
//   res.render('index'); // Assuming your EJS file is named "index.ejs"
// });


// -------- Rutas /.netlify/functions/api/xxxxx --------

router.get('/', (req, res) => {
  console.log("trying to find /");
  res.render('index.ejs');
});

router.post('/upload', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file received' });
  }

  try {
    //const audioBuffer = req.file.buffer;
    const transcriptionResult = await convertSpeechToText();
    console.log("transcriptionResult.text:", transcriptionResult.text)
    const processedResult = await processTranscription(transcriptionResult.text);
    const audioTag = await convertTextToSpeech(processedResult);

    // Send the JSON response to frontend
    res.json({
      processedresult: processedResult,
      transcriptionresult: transcriptionResult,
      audiocontent: audioTag
    });

  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ message: 'Error processing audio' });
  }

});

app.use('/.netlify/functions/api', router);
//app.use(router);


// probar crear server de express en vez de usar serverless de netlify
export const handler = serverless(app);


// New Code

// app.listen(3005, () => {
//   console.log('Server is running on port 3005');
// });