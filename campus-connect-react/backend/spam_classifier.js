// spam_classifier.js

const { InferenceSession, Tensor } = require('onnxruntime-node');
const pickle = require('node-pickle');
const { PythonShell } = require('python-shell');
const fs = require('fs');

const Classifier = require('./classifier');

const TOKENIZER_BATCH_SIZE = 1;

// Function to tokenize text using en_core_web_sm
function tokenizeText(inputText) {
  console.log('Tokenize text function called');
  return new Promise((resolve, reject) => {
    console.log('Promise created');
    const options = {
      mode: 'text',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: __dirname,
      args: [inputText],
    };

    PythonShell.run('tokenizer.py', options, function (err, results) {
       if (err) {
        console.log('PythonShell.run error', err);
        reject(err);
    } else {
        console.log('PythonShell.run results', results);
        const tokens = JSON.parse(results[0]);
        resolve(tokens);
    }
    });
  });
}



class SpamClassifier extends Classifier {
  /**
   *  Initialize the SpamClassifier
   * @param {String} modelPath  path to the ONNX model
   * @param {String} tokenizerConfigPath  path to the tokenizer config file
   * @param {String} textVocabPath  Path to the text vocabulary file
   * @param {String} labelVocabPath  Path to the label vocabulary file
   */
  constructor(modelPath, tokenizerConfigPath, textVocabPath, labelVocabPath) {
    super();
    this.modelPath = modelPath;
    this.tokenizerConfigPath = tokenizerConfigPath;
    this.textVocab = pickle.loads(textVocabPath);
    this.tokenizer = tokenizeText;
  }
  /**
   * preprocess the text by tokenizing it and converting it to a Tensor
   * @param {String} text input text for classification
   * @returns {Tensor} Tensor of the preprocessed text
   */
  async preprocess(text) {
    console.log('Start pre:', text)

    if (!this.textVocab) {
      throw new Error('Text vocabulary not initialized. Make sure the vocabulary file is available.');
    }

    try {
      const tokens = await this.tokenizer(text);
      console.log('Here is the Tokens:', tokens);
    } catch (err) {
      console.error('Error in tokenizing text:', err);
      return;
    }


    // Convert tokens to corresponding vocabulary indices using the textVocab
    const inputIndices = tokens.map(token => this.textVocab.stoi[token]);

    // Create a Tensor from the input indices
    return new Tensor('int32', inputIndices, [TOKENIZER_BATCH_SIZE, inputIndices.length]);
  }

  /**
   * Classify the text as spam or not spam
   * @param {*} text input text for classification
   * @returns {boolean} true if spam, false if not spam
   */
  async classify(text) {
    console.log('Classifying text:', text)
    this.model = await InferenceSession.create(this.modelPath);
    try {
      console.log('Preprocessing text:', text)
      // Preprocess the text
      const inputTensor = await this.preprocess(text);
        console.log('Input tensor:', inputTensor)

      // Run inference with the model
      const outputTensor = await this.model.run([inputTensor]);
      console.log('Output tensor:', outputTensor)

      const prob = outputTensor.data; // Probability of spam

      // if prob > 0.7, classify as spam
      return prob > 1;
    } catch (error) {
      console.error('Error during classification:', error);
      throw error;
    }
  }
}


module.exports = SpamClassifier;
