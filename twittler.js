$(document).ready(function(){

	// defining some jquery objects
	var $title = $('.navbar-brand');
	var $subtitle = $('.subtitle');
	var $tweetsArea = $('.tweetsArea');
	var $newTweetsNotificationArea = $('.newTweetsNotificationArea');
	var $getNewTweetsButton = $('.getNewTweetsButton');
	var $userTweetMessage = $('#userTweetMessage');
	var $userTweetButton = $('.userTweetButton');

	// other definitions
	window.visitor = 'davis';
	streams.users[visitor] = [];

	// initializing lastSeenTweetIndex
	var lastSeenTweetIndex = 0;

	// this function refreshes the tweets area with new tweets. also logs in console how many tweets have been fetched. the function is passed the 'last seen tweet index'. the function returns the last index.
	var populateTweetsArea = function(user) {
		var index;
		var numberOfFetchedTweets;
		var whatToDisplay;

		if (arguments.length === 0) {
			$subtitle.html('feed');
			index = streams.home.length - 1;
			numberOfFetchedTweets = index - lastSeenTweetIndex;
			lastSeenTweetIndex = index;
			whatToDisplay = streams.home;
		} else {
			index = user.length - 1;
			numberOfFetchedTweets = index - lastSeenTweetIndex;
			lastSeenTweetIndex = index;
			whatToDisplay = user;
		}

		$tweetsArea.html('');

		while(index >= 0) {
	      var tweet = whatToDisplay[index];
	      var $tweet = $('<div></div>');

	      $tweet.html('<a class="username" href="#">@' + tweet.user + '</a> - '
	      	+ moment(tweet.created_at).fromNow()+ "<br />"
	      	+ tweet.message + "<hr />");

	      $tweet.appendTo($tweetsArea);
	      index -= 1;
	    }
	    console.log("fetched " + numberOfFetchedTweets + " tweets");
	    showNumberOfUndisplayedTweets(); // manually run this function
	}

	// this function displays number of undisplayed tweets and lights up the button when there are new tweets
	var showNumberOfUndisplayedTweets = function() {
		if (streams.home.length - 1 !== lastSeenTweetIndex) {
			$newTweetsNotificationArea.html(streams.home.length - 1 - lastSeenTweetIndex + ' new tweets');
			$getNewTweetsButton.attr('class', 'getNewTweetsButton btn navbar-btn btn-primary');

		} else {
			$newTweetsNotificationArea.html('no new tweets');
			$getNewTweetsButton.attr('class', 'getNewTweetsButton btn navbar-btn btn-default');
		}
	}

	setInterval(function() {
		showNumberOfUndisplayedTweets();
	}, 3000);

	populateTweetsArea(); // initialize view

	// tying the getNewTweets button to populateTweetsArea()
	$getNewTweetsButton.click(function() {
		populateTweetsArea();
	});

	$title.click(function() {
		populateTweetsArea();
	});

	// tying usernames to individual tweet feeds
	$('body').on('click', '.username', function() {
		var $username = $(this).html().replace("@", "");
		$subtitle.html('@' + $username);
		populateTweetsArea(streams.users[$username]);
	});

	// tying the userTweetButton to its function
	$userTweetButton.click(function() {
		writeTweet($userTweetMessage.val());
		$userTweetMessage.val('');
		populateTweetsArea();
	})
});