const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const client = new SNSClient();

async function sendNotification({
  topicArn,
  subject,
  message,
}) {
  const params = {
    Subject: subject,
    Message: message,
    TopicArn: topicArn,
  };
  const command = new PublishCommand(params);
  await client.send(command);
}

module.exports = {
  sendNotification,
};
