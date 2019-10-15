"use strict";

var account = "";
var tweet_count = 0;

window.YTD = {
    "account":[],
    "tweet":[],
    "profile":[],
    };

$(document).ready(function (){
    console.log("INIT");
    account = window.YTD.account.part0[0].account;
    tweet_count = window.YTD.tweet.part0.length;

    $("#tweet-count").text(tweet_count);

    console.log("Sorting...");
    window.YTD.tweet.part0.sort((a,b) => a.id - b.id);
    console.log("Sorting complete!");

    $("#update").click(function (){
        console.log("Updating Results");
        var start = $("input[name=start]").val();
        var limit = $("input[name=limit]").val();

        // Filters
        var from = $("input[name=from]").val();
        var to = $("input[name=to]").val();
        var contains = $("input[name=contains").val().toLowerCase();
        var has_link = $("input[name=display-media]").is(":checked");
        var has_image = $("input[name=display-media]").is(":checked");
        var has_video = $("input[name=display-media]").is(":checked");


        show_tweets(start, limit, from, to, contains, has_link, has_image, has_video);

        $(".media-frame").click(function (){
            console.log("Zooming!");
            $(this).toggleClass("zoomed");
        });
    })

    $(".page-nav-button").click(function (){
        console.log("Page update");
        if ($(this).data("dir") == "prev")
        {
            var new_start = Math.max(0, parseInt($("input[name=start]").val()) - parseInt($("input[name=limit]").val()));
            $("input[name=start]").val(new_start);
        }
        else
        {
            //var new_start = Math.max(parseInt($("input[name=start]").val()) + parseInt($("input[name=limit]").val()));
            var new_start = parseInt($(".id").last().text().slice(1)) + 1;
            $("input[name=start]").val(new_start);
        }

        $("#update").click();
    });

    $("#update").click();
});


function show_tweets(start, limit, from, to, contains, has_link, has_image, has_video)
{
    console.log("-- Show Tweets --");
    console.log("Start/Limit:", start, limit);
    console.log("Date Range:", from, to);
    console.log("Contains:", contains);
    console.log("Has Link/Image/Video:", has_link, has_image, has_video);

    $("#tweet-output").html("<i>Working...</i>");

    start = parseInt(start);
    limit = parseInt(limit);

    if (isNaN(start))
    {
        start = 0;
        $("input[name=start]").val(start);
    }
    if (isNaN(limit))
    {
        limit = 50;
        $("input[name=limit]").val(limit);
    }

    var results_count = 0;
    var idx = start;
    var output = "";
    var abort = false;

    while (idx < tweet_count)
    {
        if (idx >= window.YTD.tweet.part0.length)
            break;

        var tweet = window.YTD.tweet.part0[idx];
        var media = "";

        // Check filters
        var created = new Date(tweet.created_at);
        created = created.toISOString().split("T")[0];
        // Date range
        if (from && created < from)
        {
            idx++;
            continue;
        }
        if (to && created > to)
        {
            idx++;
            abort = true;
        }

        // Contains Text
        if (contains)
        {
            var contains_match = true;

            if ((tweet.full_text.toLowerCase().indexOf(contains) == -1) && (1))
                contains_match = false;

            if (! contains_match)
            {
                idx++;
                continue;
            }
        }

        // Include the tweet
        if (tweet["extended_entities"] && $("input[name=display-media]").is(":checked"))
        {
            for (var media_idx = 0; media_idx < tweet.extended_entities.media.length; media_idx++)
            {
                var format = "image";
                if (tweet.extended_entities.media[media_idx].media_url.indexOf("tweet_video_thumb") !== -1) // Video
                    var format = "video";
                else if (tweet.extended_entities.media[media_idx].media_url.indexOf("ext_tw_video_thumb") !== -1) // Video (Alt)
                    var format = "video";


                if (format == "video")
                {
                    var video_filename = base_name(tweet.extended_entities.media[media_idx].video_info.variants[0].url);
                    media += `<div class="media-frame">
                        <video src="archive/tweet_media/${tweet.id}-${video_filename}" controls></video>
                    </div>`;
                }
                else // Image
                {
                    var image_filename = base_name(tweet.extended_entities.media[media_idx].media_url);
                    media += `<div class="media-frame">
                        <img src="archive/tweet_media/${tweet.id}-${image_filename}" alt="${tweet.id}-${image_filename}">
                    </div>`;
                }
            }
        }

        var include_raw = "";
        if ($("input[name=display-raw]").is(":checked"))
            include_raw = `<div class="raw"><textarea>${JSON.stringify(tweet, null, 2)}</textarea></div>`;

        output += `
        <div class="tweet" data-idx="${idx}">
            <div class="id">#${idx}</div>
            <div class="timestamp"><a href="https://twitter.com/${account.username}/status/${tweet.id}" target="_blank">${tweet.created_at}</a></div>
            <div class="pfp"></div>
            <div class="content">${parse_text(tweet.full_text)}</div>
            <div class="media">${media}</div>
            <div class="stats">
                <div class="replies">--</div>
                <div class="retweets">${tweet.retweet_count}</div>
                <div class="likes">${tweet.favorite_count}</div>
            </div>
            ${include_raw}
        </div>`;
        results_count++;

        if (abort || (results_count >= limit))
            break;

        idx++;
    }
    console.log("DONE");
    $("#tweet-output").html(output);
}

function base_name(input)
{
    var split = input.split("/");
    var output = split[split.length - 1];
    return output;
}

function parse_text(text)
{
    var parsed = text;
    parsed = parsed.replace(/@(\w*)/g, `<a href="https://twitter.com/$1" target="_blank">$&</a>`);
    return parsed;
}
