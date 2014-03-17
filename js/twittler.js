$(function() {

// defining some jquery objects
	var $title = $('.navbar-brand');
	var $subtitle = $('.subtitle');
	var $tweetsArea = $('.tweetsArea');
	var $newTweetsNotificationArea = $('.newTweetsNotificationArea');
	var $getNewTweetsButton = $('.getNewTweetsButton');
	var $userTweetMessage = $('#userTweetMessage');
	var $userTweetButton = $('.userTweetButton');
	var $login = $('.modal');
	var $submitUsername = $('.submitUsername');
	var $usernameEntry = $('.usernameEntry');
	var $name = $('.name');
	var $tweetCount = $('.tweet-count');

// initializing
	var lastSeenTweetIndex = 0;
	var numberOfUserTweets = 0;

// populateTweetsArea([user])
// this function refreshes the tweets area with new tweets. also logs in
// console how many tweets have been fetched. the function is passed the
// 'last seen tweet index'. the function returns the last index.
	var populateTweetsArea = function(user) {
		var index;
		var numberOfFetchedTweets;
		var whatToDisplay;

		if (!user) { // if called without a user, refresh feed
			$subtitle.html('feed');
			index = streams.home.length - 1;
			numberOfFetchedTweets = index - lastSeenTweetIndex;
			lastSeenTweetIndex = index;
			whatToDisplay = streams.home;
			console.log("fetched " + numberOfFetchedTweets + " tweets");
		} else { // if called with a user, display that user
			index = user.length - 1;
			whatToDisplay = user;
		}
		$tweetsArea.html(''); // current implementation clears display, then rewrites it
		while(index >= 0) {
	      var tweet = whatToDisplay[index];
	      var $tweet = $('<div></div>');

	      $tweet.html('<a class="username" href="#">@' + tweet.user + '</a> - '
	      	+ moment(tweet.created_at).fromNow()+ "<br />"
	      	+ tweet.message + "<hr />");
	      $tweet.appendTo($tweetsArea);
	      index -= 1;
	    }
	    showNumberOfUndisplayedTweets(); // manually run this function
	}

// showNumberOfUndisplayedTweets()
// this function displays number of undisplayed tweets and lights up the button
// when there are new tweets
	var showNumberOfUndisplayedTweets = function() {
		if (streams.home.length - 1 !== lastSeenTweetIndex) {
			$newTweetsNotificationArea.html(streams.home.length - 1 - lastSeenTweetIndex + ' new tweets');
			$getNewTweetsButton.attr('class', 'getNewTweetsButton btn navbar-btn btn-primary');

		} else {
			$newTweetsNotificationArea.html('no new tweets');
			$getNewTweetsButton.attr('class', 'getNewTweetsButton btn navbar-btn btn-default');
		}
	}

// initialize view

	populateTweetsArea();

// poll for # of undisplayed tweets every 3 seconds
	setInterval(function() {
		showNumberOfUndisplayedTweets();
	}, 3000);

// tying the getNewTweets button to populateTweetsArea()
	$getNewTweetsButton.click(function() {
		populateTweetsArea();
	});

// tying a title click to populateTweetsArea as well
	$title.click(function() {
		populateTweetsArea();
	});

// tying username clicks to individual tweet feeds
	$('body').on('click', '.username', function() {
		var $username = $(this).html().replace("@", "");
		$subtitle.html('@' + $username);
		populateTweetsArea(streams.users[$username]);
	});

// what happens when user wants to tweet
	var tweetIt = function() {
		writeTweet($userTweetMessage.val());
		$userTweetMessage.val('');
		populateTweetsArea();
		numberOfUserTweets++;
		$tweetCount.html(numberOfUserTweets);
	}

// tying the userTweetButton to its function
	$userTweetButton.click(function() {
		if(!window.visitor) {
			$login.modal();
		} else {
			tweetIt();
		}
	});

// tying username to function (and tweeting the first one)
	$submitUsername.click(function() {
		window.visitor = $usernameEntry.val();
		streams.users[visitor] = [];
		$name.html(window.visitor);

		tweetIt();
		
	});
});