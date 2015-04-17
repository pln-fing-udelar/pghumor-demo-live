// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var Tweets = function(){

    var module = {};
    $('#add-favorite-message').empty();

    var TIME_BETWEEN_ITEMS = 4000; // 4 seconds
    var lastTweetId = 57;
    var cantidadTweets = 10;

    /**
     * get tweets with hastag and put it in list removing the last.
     *
     * @param hashtag represent a twitter hashtag to search
     */
    module.getCurrentTrendTweets = function(){
        var currentTrend = $('#current-trend').text();
        module.getTweets(currentTrend);
    };

    module.getTweets = function(){
        $.ajax({
            url: '/tweets/' + lastTweetId + "/" + cantidadTweets,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function(result){
                tweetLoop(5, result.tweets);
            },
            error: function(result){
                message = '<strong>Upps! Something go wrong!';

                $('#add-favorite-message').append(message);
                $('#favorite-modal').modal('show');
            }
        });
    };

    var tweetLoop = function (i, tweets) {
        setTimeout(function () {
            if (--i){
                if (tweets[i].id > lastTweetId){
                    lastTweetId = tweets[i].id;
                }
                var $lastChild = $('#tweets-div li').last();
                $(getHtmlTweet(tweets[i]))
                    .hide()
                    .prependTo('#tweets-div')
                    .slideDown('normal', module.addPopover);
                $lastChild.slideUp('normal', function() { $(this).remove(); });
                module.addUsernameClickListener();
                tweetLoop(i, tweets);
            }
            else{
                module.getCurrentTrendTweets();
            }

        }, TIME_BETWEEN_ITEMS)
    };

    var getHtmlTweet = function(tweet){
        var source   = $("#tweet-template").html();
        var template = Handlebars.compile(source);
        var html = template({
            image: tweet.account.image_path,
            username: tweet.account.name,
            text: tweet.text,
            eshumor: tweet.is_humor,
            positive: tweet.positive_votes,
            negative: tweet.negative_votes
        });
        return html
    };

    module.addUsernameClickListener = function(){
        $('.username').click(function(){
            module.showBio($(this));
        });
    };
    /***************************************************************/

    module.addPopover = function(){
        $('.tweet').popover({
            html: true,
            trigger: "hover",
            title: "Descripción",
            placement: "left",
            content: function(){
                content = '<dl>';
                content += '<dt>Votos positivos</dt><dd>' + $(this).data('positive-votes') + '</dd>';
                content += '<dt>Votos negativos</dt><dd>' + $(this).data('negative-votes') + '</dd>';
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
