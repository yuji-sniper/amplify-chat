"use client";

import * as React from 'react';

function Index() {
  const apiDomain = 'https://on7h3cdrrc.execute-api.ap-northeast-1.amazonaws.com/poc'
  const getRoomsEndpoint = `${apiDomain}/rooms`;

  // 部屋取得APIのレスポンスを表示
  const [rooms, setRooms] = React.useState('');
  React.useEffect(() => {
    const getRooms = async () => {
      const response = await fetch(getRoomsEndpoint, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setRooms(data);
      console.log(rooms);
    }

    getRooms();
  }, []);

  return (
    <h1>Chat</h1>
  );
}

export default Index;
