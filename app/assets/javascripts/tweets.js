// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var Tweets = function(){

    var module = {};
    var pause = false;
    var toolTip = false;
    var tweetCount = 10;
    var wellClassified = 8;
    var badClassified = 2;


    var setHeader = function(){
        if (pause || toolTip){
            $('#current-title').html('Humor en vivo según el clasificador <i class="fa fa-pause"></i>');
        }
        else{
            $('#current-title').html('Humor en vivo según el clasificador <i class="fa fa-play"></i>');
        }
    };

    var onHover = function(){
        toolTip = true;
        setHeader();
    };

    var outHover = function(){
        toolTip = false;
        setHeader();
    };

    $('.tweet').hover(onHover, outHover);

    $('#current-title').click(function(){
        pause = !pause;
        setHeader();
    });

    var TIME_BETWEEN_ITEMS = 4000; // 4 seconds
    var TIME_WHEN_STOP = 1000 // 1 second
    var lastTweetId = 57;
    var cantidadTweets = 10;

    /**
     * get tweets with hastag and put it in list removing the last.
     *
     * @param hashtag represent a twitter hashtag to search
     */
    module.getCurrentTrendTweets = function() {
        module.getTweets();
    };

    module.getTweets = function() {
        $.ajax({
            url: '/tweets/' + lastTweetId + "/" + cantidadTweets,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function(result) {
                var cantidad = Math.min(5, result.tweets.length);
                tweetLoop(cantidad, result.tweets);
            },
            error: function(result){
                message = '<strong>Upps! Something go wrong!';

                $('#add-favorite-message').append(message);
                $('#favorite-modal').modal('show');
            }
        });
    };

    var tweetLoop = function (i, tweets, time) {
        if (typeof time === 'undefined') { time = TIME_BETWEEN_ITEMS; }
        setTimeout(function () {
            if (pause || toolTip){
                tweetLoop(i, tweets, TIME_WHEN_STOP);
                return;
            }
            if (--i) {
                $('#current-title').html('Humor en vivo según el clasificador <i class="fa fa-play"></i>');
                if (tweets[i].id > lastTweetId) {
                    lastTweetId = tweets[i].id;
                }
                var $lastChild = $('#tweets-div li').last();
                $(getHtmlTweet(tweets[i]))
                    .hide()
                    .prependTo('#tweets-div')
                    .slideDown('normal', module.addPopover);
                $lastChild.slideUp('normal', function() {
                    $(this).remove();
                    setHeader();
                });
                module.addUsernameClickListener();
                tweetLoop(i, tweets);
            }
            else{
                module.getCurrentTrendTweets();
            }

        }, time)
    };

    var getHtmlTweet = function(tweet) {
        var source = $("#tweet-template").html();
        var template = Handlebars.compile(source);
        var average;
        if (tweet.positive_votes + tweet.negative_votes == 0) {
            average = 0;
        } else {
            average = (tweet.one_star + 2 * tweet.two_star + 3 * tweet.three_star + 4 * tweet.four_star + 5 * tweet.five_star) * 1.0 / (tweet.positive_votes + tweet.negative_votes);
        }
        var image_url;
        if (tweet.account.image_path.startsWith("https")) {
            image_url = tweet.account.image_path;
        } else {
            image_url = "assets/" + tweet.account.image_path;
        }
        return template({
            image: image_url,
            username: tweet.account.name,
            text: tweet.text,
            eshumor: tweet.is_humor,
            retweets: tweet.retweet_count,
            favoritos: tweet.favorite_count,
            accountType: tweet.account.account_type,
            averageStar: average
        })
    };

    module.addUsernameClickListener = function(){
        $('.username').click(function(){
            module.showBio($(this));
        });
    };
    /***************************************************************/

    module.addPopover = function(){
        $('.tweet').hover(onHover, outHover);
        $(".popover").remove();
        $('.tweet').popover({
            html: true,
            trigger: "hover",
            title: "Descripción",
            placement: "top",
            content: function(){
                console.log($(this).data('avg-stars'));
                content = '<dl>';
                content += '<dt>Retweets</dt><dd>' + $(this).data('retweets') + '</dd>';
                content += '<dt>Favoritos</dt><dd>' + $(this).data('favoritos') + '</dd>';
                content += '</dl>';
                content += '<div class="cleaner"></div>'
                return content;
            }
        });
    };

    return module;
};

$().ready(function(){
    var tweetsModule = Tweets();
    tweetsModule.getCurrentTrendTweets();
    tweetsModule.addUsernameClickListener();
    tweetsModule.addPopover();
});
