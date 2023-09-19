const fetch = require('node-fetch-commonjs');

const downloadImage = async function(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (response.ok) {
      return await response.buffer();
    }
    return null;
  } catch (error) {
    console.error('Error downloading image:', error);
    return null;
  }
} 

const convertMsg = async function({type, content}) {
  switch(type) {
    // 纯文本
    case 'text':
      return content;
    case 'richText':
      return 
  }
}

module.exports = {
  downloadImage,
  convertMsg
}

