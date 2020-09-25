import React, { useState, useRef } from 'react';
import {
  StreamApp,
  FlatFeed,
  InfiniteScrollPaginator,
} from 'react-activity-feed';
import 'react-activity-feed/dist/index.es.css';
import axios from 'axios';
import Post from './Post';
import './App.css';


function App() {
  const [username, setUsername] = useState('');
  const [streamCredentials, setStreamCredentials] = useState(null);
  const containerRef = useRef(null);

  const register = async (e) => {
    try {
      e.preventDefault();

      var response = await axios.post('http://localhost:8080/registration', {
        frontendUser: username
      });

      setStreamCredentials({ token: response.data.userToken, apiKey: response.data.streamApiKey, appId: response.data.appId });

    } catch (e) {
      console.error(e, e.error);
    }
  };

  if (streamCredentials) {
    return (
      <div ref={containerRef}>
        <StreamApp apiKey={streamCredentials.apiKey} token={streamCredentials.token} appId={streamCredentials.appId}>
          <div className="stream-app">
            <h3 className="app-title">S3 Monitor</h3>
          </div>
          <FlatFeed
            feedGroup="user_notifications"
            notify
            options={{ limit: 6 }}
            Paginator={(props) => (
              <InfiniteScrollPaginator
                useWindow={false}
                threshold={10}
                {...props}
                getScrollParent={() => containerRef}
              />
            )}
            Activity={Post}
          />
        </StreamApp>
      </div>
    );
  } else {
    return (
      <div className="App container">
        <form className="card" onSubmit={register}>
          <label className="label-font">Username</label>
          <input className="input-style"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            required
          />
          <button type="submit">
            Log in
          </button>
        </form>
      </div>
    );
  }
}

export default App;
