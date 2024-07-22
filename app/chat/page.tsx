"use client";

import * as React from 'react';

function Index() {
  const apiDomain = 'https://on7h3cdrrc.execute-api.ap-northeast-1.amazonaws.com/poc'
  const getRoomsEndpoint = `${apiDomain}/rooms`;

  // 部屋取得APIのレスポンスを表示
  const [rooms, setRooms] = React.useState('');
  React.useEffect(() => {
    fetch(getRoomsEndpoint, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setRooms(data));
    console.log(rooms);
  }, []);

  return (
    <h1>Chat</h1>
  );
}

export default Index;
