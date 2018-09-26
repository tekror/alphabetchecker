// The required modules for this program
const request = require('request');
const RedditApi = require('reddit-oauth');
const alphabetChecker = require('./alphabetchecker.js');
const topCommentsChecker = require('./top_comments_checker.js');

// Gives access to the reddit API when provided with correct credentials
const reddit = new RedditApi({
    app_id: //Your app id goes here,
    app_secret: //Your app secret goes here,
    redirect_uri: 'http://localhost',
    refresh_token: //Your refresh token goes here,
});

// Refreshes the access token
reddit.access_token = reddit.refreshToken();

// The random code used for generating new tokens
const state = //Your random code goes here;

// Generates a new URL to give permission to access token
function generateUrl() {
  console.log(reddit.oAuthUrl(state, 'identity edit flair history modconfig modflair modlog modposts modwiki mysubreddits privatemessages read report save submit subscribe vote wikiedit wikiread'));
}

// Posts comment to Reddit when it has an ID (comment to reply to)
// And the text for which it will post
function postComment(commentId, commentText) {
  reddit.post(
    '/api/comment',
    {
        api_type: 'json',
        thing_id: commentId,
        text: commentText
    },
    function (error, response, body) {
        console.log(error);
        console.log(body);
    }
  );
}

// Finds the current top post for the provided subreddit
function findTopPost() {
  reddit.get(
      '/r/all/.json', //Edit this to the subreddit of your choosing
      {},
      function (error, response, body) {
          let info = JSON.parse(body);
          const subreddit = info.data.children[0].data.subreddit;
          const id = info.data.children[0].data.id;
          const url = '/r/' + subreddit + '/comments/' + id + '.json';
          alphamatiseComment(url);
      })
}

// Looks up top comment, grabs its ID and body text
// and passes that to the postComment function
function alphamatiseComment(url) {
  reddit.get(
      url,
      {},
      function (error, response, body) {
          console.log(error);
          let info = JSON.parse(body);
          console.log(info[1].data.children[0]);
          const commentId = 't1_' + info[1].data.children[0].data.id;
          const alphaComment = alphabetChecker(info[1].data.children[0].data.body);
          const username = info[1].data.children[0].data.author;
          console.log(username);
          getUserTopComments(commentId, alphaComment, username);
      })
}

// Gets new tokens if ever necessary
// 'code' is from url to sent to redirect_uri
function getNewTokens() {
  const fakeQuery = {
    state: state,
    code: //Enter your code here
  }

  reddit.oAuthTokens(
      state,
      fakeQuery,
      function (success) {
          // Print the access and refresh tokens we just retrieved
          console.log(reddit.access_token);
          console.log(reddit.refresh_token);
      }
  );
}

// Goes to the user's profile of the top comment and retrieves their top 100 comments
function getUserTopComments(commentId, alphaComment, username) {
  reddit.get(
      '/user/' + username + '/comments/?limit=100&sort=top',
      {},
      function (error, response, body) {
          console.log(error);
          let info = JSON.parse(body);

          let top100Comments = '';

          for(let property in info.data.children) {
            top100Comments += info.data.children[property].data.body + '\n';
          }
          const checkedTopComments = topCommentsChecker(top100Comments);
          const finalComment = alphaComment + '\n\n' + checkedTopComments;
          console.log(finalComment);

          postComment(commentId, finalComment);
      })
}

// Exports the modules necessary
module.exports = findTopPost;
