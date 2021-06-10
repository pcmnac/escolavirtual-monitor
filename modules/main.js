const { trackStudent } = require('./tracker');
const { sendNotification } = require('./notifier');

async function trackStudentAndNotify({
  topicArn,
  username,
  password,
}) {
  const { name, points } = await trackStudent(username, password);

  const message = `${name} tem ${points} pontos em ${new Date().toLocaleString()}`;

  await sendNotification({
    topicArn,
    subject: `Pontos de ${name}`,
    message,
  });
}

module.exports = {
  trackStudentAndNotify,
};
