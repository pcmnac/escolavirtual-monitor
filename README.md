# Escola Virtual Monitor

A very simple puppeteer script to track students progress on escolavirtual.pt and send alerts. I created this to monitor my kids progress and decided to make it public since it can be useful for other people.

## Requiments

- [Node.js](https://nodejs.org/) (I like to use [NVM](https://github.com/nvm-sh/nvm) to install/manage node versions)
- [Serverless Framework](https://www.serverless.com/)

## Set Up Instructions

1. Clone this repo;
1. run `npm i` inside the project directory;
1. Rename the `.env.example` file to `.env`;
1. Setup an SNS Topic on your AWS account and assign its ARN to the `SNS_TOPIC_ARN` variable on the `.env` file;
1. Assing the list of login:password pairs of the students you wanna track to the `STUDENTS` variable on the `.env` file;
1. Run `sls deploy` to deploy your lambda function;
1. Optionally, you can change the schedule in the `serverless.yml` file by modifying the cron expression.