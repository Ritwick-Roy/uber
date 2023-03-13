import { Configuration, OpenAIApi } from "openai";
import axios from 'axios';
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const problem = req.body.problem || '';
  if (problem.length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid problem",
      }
    });
    return; 
  }

  try {

    // original documentation code
    // const completion = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   // prompt: `${problem} TL;DR`,
    //   prompt: `Find out the issue of the writer in the given text "${problem}"`,
    //   temperature: 0,
    //   max_tokens: 1000,
    //   top_p: 1,
    //   frequency_penalty: 0.0,
    //   presence_penalty: 0.0,
    //   stop: ["\n"],
    // });
    
    const completion = await axios.post('https://api.openai.com/v1/completions', {
      model: "davinci:ft-personal-2023-03-01-00-25-03",
      // model: "text-davinci-003",
      // prompt: `Summarize all the problems of a student who sent the mail, ${problem}`,
      prompt: `${problem} ->`,
      max_tokens: 1000,
      n: 1,
      // echo: true,
      stop: ['\n'],
      // stop: null,
      // top_p: 1,
      // frequency_penalty: 0.0,
      // presence_penalty: 0.0,
      temperature: 0.1,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(completion.data);
    console.log(problem);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
} 