import cron from 'node-cron';

import 'dotenv/config'

const baseLeetcodeURL = 'https://leetcode.com';
const timezone = process.env.DLB_TIMEZONE || 'Etc/UTC';
const cronSchedule = process.env.DLB_CRON_SCHEDULE || '0 12 * * *'; // See https://www.npmjs.com/package/node-cron#cron-syntax for more info
const messageTopic = 'Daily Leetcode Problem';
const slackWebhookURL = process.env.DLB_SLACK_WEBHOOK;

class LeetCodeBot {
	static async run () {
		cron.schedule(cronSchedule, async () => {
			const date = new Date(); 

			const humanReadableDateString = date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', timeZone: timezone });
			console.info(`Getting leetcode problem for ${humanReadableDateString}`);

			try {
				console.info('Making the call to alfa-leetcode-api...');
					// This is the current functioning daily leetcode api
					// https://github.com/alfaArghya/alfa-leetcode-api
				let response = await fetch('https://alfa-leetcode-api.onrender.com/daily');
				let leetcode_data;
				if (response.ok) {
					leetcode_data = (await response.json());
					// Structure the data in the original Leetcode API format
					leetcode_data = {
						question: {
							difficulty: leetcode_data.difficulty,
							title: leetcode_data.questionTitle,
						},

						link: leetcode_data.questionLink.match(/\/problems\/.*/)[0]
					}

				} else {
					console.group('There was a problem fetching data from alfa-leetcode-api.');
					console.error(response.status, response.statusText);
					console.groupCollapsed('Response body:')
					console.error(await response.text(), '\n');
					console.groupEnd();
					console.groupEnd();

					console.group('Getting data from python script...');
					leetcode_data = (await run_python()).data?.activeDailyCodingChallengeQuestion;
					console.groupEnd();
				}

				const messageData = {
					date: humanReadableDateString,
					problems: {
						leetcode_daily: { ...leetcode_data?.question, link: leetcode_data?.link },
					}
				};
				if (leetcode_data === undefined) {
					messageData.problems.leetcode_daily = undefined;
				}
				if (slackWebhookURL) {
					await this.postMessageToSlack(messageData);
				}
			} catch (error) {
				console.group('Error getting problems:');
				console.error(error);
				console.groupEnd();
			}
		}, {
			scheduled: true,
			timezone
		});


		console.info(`Daily Leetcode Bot is running and will post to Slack with the following configuration:
		Schedule(cron): ${cronSchedule}
		Recipient: ${messageReceiver}
		Topic: ${messageTopic}
		Timezone: ${timezone}`);
	}

	static async postMessageToSlack ({ date, problems }) {
		const payload = {
			blocks: [
				{
					type: "header",
					text: {
						type: "plain_text",
						text: date
					}
				},
				{
					type: "context",
					elements: [
						{
							type: "mrkdwn",
							text: "`Daily Question` at <https://leetcode.com/problemset/all/|leetcode.com>"
						}
					]
				},
				{
					type: "context",
					elements: [
						{
							type: "plain_text",
							text: "Good morning Kappa Theta Pi! It is a great day to build your coding skills!"
						}
					]
				},
				{
					type: "rich_text",
					elements: [
						{
							type: "rich_text_list",
							style: "ordered",
							elements: [
								{
									type: "rich_text_section",
									elements: [
										{
											type: "text",
											text: `${problems.leetcode_daily ? `(${problems.leetcode_daily.difficulty}) ` : 'There was a problem with the Leetcode API.'}`
										},
										{
											type: "link",
											url: `${baseLeetcodeURL}${problems.leetcode_daily ? problems.leetcode_daily.link : '/problemset'}`,
											text: problems.leetcode_daily ? problems.leetcode_daily.title : 'Find the daily problem on the calendar here',
										}
									]
								}
							]
						}
					]
				},
				{
					type: "rich_text",
					elements: [
						{
							type: "rich_text_list",
							style: "ordered",
							elements: []
						}
					]
				}
			]
		};

		console.info('  Posting message to Slack:', `\n    ${JSON.stringify(payload)}`);

		try {
			const response = await fetch(slackWebhookURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			const result = await response.text();
			console.info('  Response:', result);
		} catch (error) {
			console.error('Error posting message to Slack:', error);
		}
	}
}

LeetCodeBot.run();
