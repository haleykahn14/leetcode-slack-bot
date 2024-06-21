

<p align="center">
	<img width="200px" height="200px" src="https://github.com/RodEsp/daily-leetcode-bot/assets/1084688/30e9f79f-0b6a-4691-8537-77f892c635bf">
</p>

# Daily Leetcode Bot 

The Daily Leetcode Bot can post questions from [leetcode.com](https://leetcode.com) to Slack every day.

## ORIGINAL AUTHOR
> The original code used to create this bot can be found at: https://github.com/RodEsp/daily-leetcode-bot
> The original author of the code is @RodEsp. 

## Getting Started
> To run this bot you must have [Node.js](https://nodejs.org/) installed.

### Configuration
The bot can be configured by using the following environment variables:

* Slack
	* `DLB_SLACK_WEBHOOK` - the webhook URL for an [incoming webhook](https://api.slack.com/messaging/webhooks)

* Bot
	* `DLB_TIMEZONE` - A timezone identifier as defined by [IANA](https://www.iana.org/) (list [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))
	* `DLB_CRON_SCHEDULE` - A `cron` expression as defined by [node-cron](https://www.npmjs.com/package//node-cron#cron-syntax)

### Running
1. Clone this repo
2. Install dependencies
	1. `npm install`
3. Run the bot
	1. `npm start`

## Repo Overview

This repository is composed of two main files.
#### [bot.js](./bot.js)
The business logic for the bot and where all the configuration gets applied.

#### [queries.js](./queries.js)
GraphQL queries that can be used with the Leetcode API. <br/>
Unfortunately the Leetcode API is not documented but useful information about it can be found [here](https://github.com/aylei/leetcode-rust/issues/12), [here](https://leetcode.com/discuss/general-discussion/1297705/is-there-public-api-endpoints-available-for-leetcode), and by searching the intertubez.

## Contributing

> Please read our [Code of Conduct](CODE_OF_CONDUCT.md)
