const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const keys = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');

const s3 = new AWS.S3({
  accessKeyId: keys.awsAccessKeyId,
  secretAccessKey: keys.awsSecretAccessKey
})

module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const { name, type } = req.query;
    const key = `${req.user.id}/${uuid()}.jpeg`;

    s3.getSignedUrl('putObject', {
      Bucket: 'nlazzos-advanced-node',
      Key: key,
      ContentType: 'image/jpeg'
    }, (error, url) => res.send({ key, url }));
  });
};
