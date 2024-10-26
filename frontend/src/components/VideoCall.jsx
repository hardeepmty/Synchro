import React, { useState } from 'react';
import AgoraUIKit from 'agora-react-uikit';

const VideoCall = ({ appId, channel }) => {
  const [isJoined, setIsJoined] = useState(false);

  const rtcProps = {
    appId: appId, // Use your Agora App ID
    channel: channel, // Channel name
    token: null, // Replace with your actual token if needed
  };

  // Handle join and leave actions
  const handleJoin = () => {
    setIsJoined(true);
  };

  const handleLeave = () => {
    setIsJoined(false);
  };

  return (
    <div>
      <h2>Video Call</h2>

      <div>
        {/* Join and Leave Buttons */}
        <button onClick={handleJoin} disabled={isJoined}>Join</button>
        <button onClick={handleLeave} disabled={!isJoined}>Leave</button>
      </div>

      {/* Render Agora UIKit only when joined */}
      {isJoined && (
        <div style={{ width: '100%', height: '500px', marginTop: '20px' }}>
          <AgoraUIKit rtcProps={rtcProps} />
        </div>
      )}
    </div>
  );
};

export default VideoCall;
