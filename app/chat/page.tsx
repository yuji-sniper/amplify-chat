"use client";

import * as React from 'react';

function Index() {
  const apiDomain = 'https://abc9gd8tnd.execute-api.ap-northeast-1.amazonaws.com/poc-amplify-chat-chat-rest-poc'
  const getRoomsEndpoint = `${apiDomain}/rooms`;

  // 部屋取得APIのレスポンスを表示
  const [messages, setMessages] = React.useState([]);
  React.useEffect(() => {
    fetch(getRoomsEndpoint)
      .then(response => response.json())
      .then(data => setMessages(data));
    
    console.log(messages);
  }, []);

  return (
    <h1>Chat</h1>
  );
}

export default Index;
