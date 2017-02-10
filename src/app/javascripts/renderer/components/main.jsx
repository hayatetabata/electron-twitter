const React = require('react');
const T = require('../services/twitter');

class Tweet extends React.Component {
   render(){
      const isRetweet = this.props.tweet.
         hasOwnProperty('retweeted_status');
      const status = isRetweet ? this.props.tweet.
         retweeted_status : this.props.tweet;
      const media = status.entities.media || [];
      const firstImage = media.find((item) => {
         return item.type === 'photo';
      });

      return(
         <li className='list-group-item'>
            <img src={status.user.profile_image_url_https}
               className='img-rounded media-object pull-left'
               width='32'
               height='32' />
            <div className='media-body'>
               <strong className='user-name'>
                  {status.user.name}
               </strong>
               <span className='user-screen_name'>
                  @{status.user.screen_name}
               </span>
               <p className='text'>{status.text}</p>
               {firstImage ?
                  <img src={firstImage.media_url_https}
                     className='img-rounded media-object media-img' />
                     : null}
            </div>
         </li>
      );
   }
}

//timeline class
class Timeline extends React.Component{
   render(){
      const tweets = this.props.tweets.map((tweet) =>{
         return <Tweet tweet={tweet} key={tweet.id}/>;
      });

      return (
         <ul className='list-group'>
            {tweets}
         </ul>
      );
   }
}

module.exports = class MainContent extends React.Component {
   constructor(props){
      super(props);
      this.state = {user: null, tweets: []};
   }

   render(){
      return (
         <div className='window'>
            <div id='window-content' 
            className='window-content'>
               <Timeline tweets={this.state.tweets}/>
            </div>
         </div>
      );
   }

    componentDidMount(){
        T.get('account/verify_credentials')
        .catch(error => {
            console.log(error);
        })
        .then((result) => {
            if (result.data.errors) {
                console.log(result.data.errors);
                return;
            }
            this.setState({user: result.data});
        });

        T.get('statuses/home_timeline')
        .catch(error => {
            console.log(error);
         })
        .then((result) => {
            this.setState({tweets: result.data});
            this.connectStream();
         });
    }

    connectStream(){
        const stream = T.stream('user');

        stream.on('error',(error) =>{
            throw error;
        });

        stream.on('tweet', (tweet) =>{
            const tweets = this.state.tweets;
            const newTweets = [tweet].concat(tweets);
            this.setState({tweets:newTweets});
            this.notifyIfMention(tweet);
        });
    }

    notifyIfMention(tweet) {
        const isMention =
            tweet.entities.user_mentions.findIndex((user) => {
                return user.id === this.state.user.id;
            }) >= 0;
            if (!isMention) {
                return;
            }

            new Notification('メンションがあります。', {
                body: tweet.text,
                icon: tweet.user.profile_image_url_https
            });
            ipcRenderer.send('newMention');
    }
}
