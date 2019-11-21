const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');


/**
 * Helper 
 * @param {*} errorMessage 
 * @param {*} defaultLanguage 
 */
function getTheErrorResponse(errorMessage, defaultLanguage) {
  return {
    statusCode: 200,
    body: {
      language: defaultLanguage || 'en',
      errorMessage: errorMessage
    }
  };
}

/**
  *
  * main() will be run when teh action is invoked
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {

  /*
   * The default language to choose in case of an error
   */
  const defaultLanguage = 'en';

  return new Promise(function (resolve, reject) {

    try {
const languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({
    apikey: 'rboxmj20W_OgkwHl7HPqEaDWnEdsvR5MDeBdl-qPTdhd',
  }),
  url: 'https://gateway-fra.watsonplatform.net/language-translator/api',
});

const translateParams = {
  text: params.text,
  modelId: params.language + '-en',
};

languageTranslator.translate(translateParams)
  .then(translationResult => {
    
  resolve({
    statusCode: 200,
    body: {
      translation: translationResult.result.translations[0].translation
    },
    headers: { 'Content-Type': 'application/json' }
});
  })
  .catch(err => {
    resolve({
      statusCode: 200,
      body:  params.text,
      headers: { 'Content-Type': 'application/json' }
  });
  });
      // - Call the language translation API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#translate
      // - if successful, resolve exatly like shown below with the
      // translated text in the "translation" property,
      // the number of translated words in "words"
      // and the number of characters in "characters".

      // in case of errors during the call resolve with an error message according to the pattern
      // found in the catch clause below

      // pick the language with the highest confidence, and send it back
      
         
    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
    }
  });
}
