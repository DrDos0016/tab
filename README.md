# Twitter Archive Browser

Twitter Archive Browser (TAB), is a basic tool to work with downloads of
Twitter account data. It runs entirely using JavaScript in the browser
so it should be easy for non-programmers especially.

Twitter used to include a tool for viewing this data, but eventually changed
the format and stopped including anything to use the data. TAB exists to make
that data something that can be used.

## Features

- Browse tweets chronologically
- Filter tweets by date range
- Filter tweets that contain text
- Embeds local copies of images and video

## Usage

Fist download your account's [Twitter archive](https://twitter.com/settings/your_twitter_data).

Then download [TAB](https://github.com/DrDos0016/tab/archive/master.zip).

Extract TAB into a folder, then extract the Twitter archive into the `archive`
folder.

Run `tab.html`. Your tweets should load after a few moments and then you can
use the navigation tools and filters as needed.

There are no restrictions and the entire Tweet archive is loaded on page load.
You can easily hang the site by attempting to list too many Tweets at once.

I developed TAB using an archive of my personal Twitter account created in
late 2018. The `tweets.js` file is close to 90 MB and the tool has no issues
given a reasonable number of Tweets to show.

This tool is a little rough around the edges as it was developed for personal
use, but I figured others might be interested.