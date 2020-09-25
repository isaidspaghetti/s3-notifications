var express = require('express');
var router = express.Router();
const stream = require('getstream');

require('dotenv').config();

const streamApiKey = process.env.STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_API_SECRET;
const appId = process.env.STREAM_APP_ID;

const client = stream.connect(streamApiKey, streamApiSecret);

router.post('/registration', async (req, res) => {
  try {
    const frontendUser = req.body.frontendUser.replace(/\s/g, '_').toLowerCase();

    const userToken = client.createUserToken(frontendUser);

    await client.user(frontendUser).getOrCreate({
      name: frontendUser,
    });

    await client.user('s3').getOrCreate({
      name: 's3'
    });

    const userFeed = client.feed('user_notifications', frontendUser);

    await userFeed.follow('s3_activities', 's3');

    res.status(200).json({
      userToken,
      streamApiKey,
      frontendUser,
      appId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/lambda', async function (req, res) {
  try {
    const s3 = client.feed('s3_activities', 's3');

    await s3.addActivity({
      'actor': 's3',
      'verb': 'post',
      'object': req.body.eventName,
      's3UserName': req.body.user,
      'bucketName': req.body.bucketName,
      'objectName': req.body.objectName,
      'eventTime': req.body.eventTime
    });

    res.status(200).send();

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
