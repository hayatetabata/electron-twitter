const React = require('react');
const T = require('../service/twitter');

class Tweet extends React.Component {
   render(){
      const isRetweet = this.props.tweet.
         hasOwnProperty('retweeted_status');
      const status = isRetweet ? this.props.tweet.
         retweeted_status : this.props.tweet.
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
               {firstImage?
                  <img src={firstImage.media_url_https}
                     className='img-rounded media-object media-img' />
                     : null }
            </div>
         </li>
      );
   }
}
