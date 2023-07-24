// spam_classifier.js

const { InferenceSession, Tensor } = require('onnxruntime-node');
const pickle = require('pickle');
const spacy = require('spacy');
const Classifier = require('./classifier');

const TOKENIZER_BATCH_SIZE = 1;

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

    this.model = null;
    this.tokenizerConfigPath = tokenizerConfigPath;
    this.textVocab = pickle.load(textVocabPath);
    this.labelVocab = pickle.load(labelVocabPath);

    // load tokenizer
    this.tokenizerConfig = require(tokenizerConfigPath);
    spacy.load(this.tokenizerConfig.language_model).then((nlp) => {
      this.tokenizer = async (text) => {
        const doc = await nlp(text);
        return doc.tokens.map(token => token.text);
      };
    }).catch((error) => {
      console.error('Error loading spaCy tokenizer:', error);
    });

  // load the ONNX model
    try {
      this.model = new InferenceSession();
      this.model.loadModel(modelPath);
    } catch (error) {
      console.error('Error loading the ONNX model:', error);
    }
  }

  /**
   * preprocess the text by tokenizing it and converting it to a Tensor
   * @param {String} text input text for classification
   * @returns {Tensor} Tensor of the preprocessed text
   */
  async preprocess(text) {
    if (!this.tokenizer) {
      throw new Error('Tokenizer not initialized. Make sure spaCy is installed and the language model is available.');
    }

    if (!this.textVocab) {
      throw new Error('Text vocabulary not initialized. Make sure the vocabulary file is available.');
    }

    if (!this.labelVocab) {
      throw new Error('Label vocabulary not initialized. Make sure the vocabulary file is available.');
    }

    const tokens = await this.tokenizer(text);

    // Convert tokens to corresponding vocabulary indices using the textVocab
    const inputIndices = tokens.map(token => this.textVocab.stoi[token]);

    // Create a Tensor from the input indices
    const inputTensor = new Tensor('int32', inputIndices, [TOKENIZER_BATCH_SIZE, inputIndices.length]);
    return inputTensor;
  }

  /**
   * Classify the text as spam or not spam
   * @param {*} text input text for classification
   * @returns {boolean} true if spam, false if not spam
   */
  async classify(text) {
    try {
      // Preprocess the text
      const inputTensor = await this.preprocess(text);

      // Run inference with the model
      const outputTensor = await this.model.run([inputTensor]);

      const prob = outputTensor.data; // Probability of spam

      // if prob > 0.7, classify as spam
      const isSpam = probabilitySpam > 0.7;

      return isSpam;
    } catch (error) {
      console.error('Error during classification:', error);
      throw error;
    }
  }
}

module.exports = SpamClassifier;
