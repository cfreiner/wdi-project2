$(function() {
  twttr.ready(function(twttr) {
    $('#tweets').children().each(function() {
      var tweetId = $(this).attr('id');
      twttr.widgets.load();
      twttr.widgets.createTweet(tweetId, document.getElementById(tweetId), {
        cards: 'hidden'
      })
      .then(function(twt) {
        console.log(twt);
        // console.log('tweet created');
        twttr.widgets.load(document.getElementById('tweets'));
      });
    });
  });
});
