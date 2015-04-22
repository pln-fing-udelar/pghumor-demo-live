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
        $('.wellClassified').text('' + Math.round(wellClassified*100/tweetCount) + '%');
        $('.badClassified').text('' + Math.round(badClassified*100/tweetCount) + '%');
        $('.totalClassified').text('' + tweetCount);
        if (pause || toolTip){
            $('#current-title').html('Humor según el clasificador <i class="fa fa-pause"></i>');
        }
        else{
            $('#current-title').html('Humor según el clasificador <i class="fa fa-play"></i>');
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
    module.getCurrentTrendTweets = function(){
        module.getTweets();
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

    var tweetLoop = function (i, tweets, time) {
        if (typeof time === 'undefined') { time = TIME_BETWEEN_ITEMS; }
        setTimeout(function () {
            if (pause || toolTip){
                tweetLoop(i, tweets, TIME_WHEN_STOP);
                return;
            }
            if (--i){
                $('#current-title').html('Humor según el clasificador <i class="fa fa-play"></i>');
                if (tweets[i].id > lastTweetId){
                    lastTweetId = tweets[i].id;
                }
                var $lastChild = $('#tweets-div li').last();
                if (tweets[i].is_humor){
                    wellClassified++;
                }
                else{
                    badClassified++;
                }
                tweetCount++;
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

    var getHtmlTweet = function(tweet){
        var source   = $("#tweet-template").html();
        var template = Handlebars.compile(source);
        var average = (tweet.one_star + 2*tweet.two_star + 3*tweet.three_star + 4*tweet.four_star + 5*tweet.five_star)*1.0/(tweet.positive_votes + tweet.negative_votes);
        var html = template({
            image: tweet.account.image_path,
            username: tweet.account.name,
            text: tweet.text,
            eshumor: tweet.is_humor,
            positive: tweet.positive_votes,
            negative: tweet.negative_votes,
            accountType: tweet.account.account_type,
            averageStar: average
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
        $('.tweet').hover(onHover, outHover);
        $(".popover").remove();
        $('.tweet').popover({
            html: true,
            trigger: "hover",
            title: "Descripción",
            placement: "left",
            content: function(){
                console.log($(this).data('avg-stars'));
                content = '<dl>';
                content += '<dt>Votos positivos</dt><dd>' + $(this).data('positive-votes') + '</dd>';
                content += '<dt>Votos negativos</dt><dd>' + $(this).data('negative-votes') + '</dd>';
                content += '<dt>Tipo de cuenta</dt><dd>'  + $(this).data('account-type') + '</dd>';
                content += '<dt>Prom. estrellas</dt><dd>'  + $(this).data('avg-stars').toLocaleString() + '</dd>';
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
