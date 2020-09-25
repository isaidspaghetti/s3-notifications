import React from 'react';
const dlIcon = require('./download-icon.png');
const ulIcon = require('./upload-icon.png');

const Post = ((props) => {
  if (props.activity.object === 'GetObject') {
    return (
      <div>
        <hr className="hr-class" />
        <div className='post'>
          <img className="actor-logo" alt="download-icon" src={dlIcon} />
          <div className="post-content">
            <p className="post-title"><strong>{props.activity.s3UserName}</strong> viewed <strong>{props.activity.objectName}</strong> from the bucket: <strong>{props.activity.bucketName}</strong>.</p>
            <p className="post-time">{props.activity.eventTime}</p>
          </div>
        </div >
      </div>
    );
  } else {
    return (
      <div>
        <hr className="hr-class" />
        <div className='post'>
          <img className="actor-logo" alt="upload-icon" src={ulIcon} />
          <div className="post-content">
            <p className="post-title"><strong>{props.activity.s3UserName}</strong> uploaded <strong>{props.activity.objectName}</strong> to the bucket: <strong>{props.activity.bucketName}</strong>.</p>
            <p className="post-time">{props.activity.eventTime}</p>
          </div>
        </div >
      </div>
    );
  }
});

export default Post;
