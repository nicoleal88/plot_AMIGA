const fs = require ('fs');
const request = require('request');

const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url)
	  .pipe(fs.createWriteStream(path))
	  .on('close', callback)
  })
}

const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3WkkXWxUp3TXEBsqGeeAtuMNKwVu3ZPASyzY8C43B5fWEyKqp2Xs0sEcM3_VXy_eoJNI_a8Mo8aiN/pub?gid=182439664&single=true&output=csv"

const path = './csvs/data.csv'

download(url, path, () => {
  console.log('Done!');
})
