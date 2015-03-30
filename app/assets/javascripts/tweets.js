// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var Tweets = function(){

    var module = {};
    $('#add-favorite-message').empty();

    var TIME_BETWEEN_ITEMS = 4000; // 4 seconds
    var lastTweetId = 10;
    var cantidadTweets = 5;
    var slideListTweet = function(){
        var $lastChild = $('#tweets-div li').last();
        $('<li class="list-group-item">' + $lastChild.html() + '</li>')
            .hide()
            .prependTo('#tweets-div')
            .slideDown();
        $lastChild.remove();
    };

    module.animate = function(){
        setInterval(slideListTweet, 2000);
    };


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
                    .slideDown();
                $lastChild.remove();
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
            bio: tweet.account.description
        });
        return html
    };

    module.addUsernameClickListener = function(){
        $('.username').click(function(){
            module.showBio($(this));
        });
    };
    /***************************************************************/

    module.showBio = function(tweet){
        var user_name = tweet.attr('data-target');
        var user_bio = tweet.attr('data-src');

        $('#twitter-user-name').text(user_name)
        if (user_bio == ''){
            user_bio = user_name + ' hasn\'t got a description!'
        }
        $('#twitter-user-bio').text(user_bio);
        $('#show-user-bio').modal('show');
    };

    return module;
};

$().ready(function(){
    var tweetsModule = Tweets();
    tweetsModule.getCurrentTrendTweets();
    tweetsModule.addUsernameClickListener();
});
