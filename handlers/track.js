'use strict';
require('dotenv').config();
const { trackStudentAndNotify } = require('../modules/main');

module.exports.main = async () => {
  const studentsCredentials = process.env.STUDENTS.split(',')
    .map((creds) => creds.trim()) // remove surrounding empty spaces
    .filter((creds) => creds); // remove empty creds

  for (const creds of studentsCredentials) {
    const [username, password] = creds.split(':');
    console.log('tracking', username, password);

    await trackStudentAndNotify({
      username,
      password,
      topicArn: process.env.SNS_TOPIC_ARN,
    });
  }

  // TODO: check how to launch multiple browsers in parallel

  // await Promise.all(studentsCredentials.map(async (creds) => {
  //   const [username, password] = creds.split(':');
  //   console.log('tracking', username, password);

  //   return await trackStudentAndNotify({
  //     username,
  //     password,
  //     topicArn: process.env.SNS_TOPIC_ARN,
  //   });
  // }));
};
