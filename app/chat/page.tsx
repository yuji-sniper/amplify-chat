"use client";

import * as React from 'react';

function Index() {
  const apiDomain = 'https://on7h3cdrrc.execute-api.ap-northeast-1.amazonaws.com/poc'
  const getRoomsEndpoint = `${apiDomain}/rooms`;

  const [rooms, setRooms] = React.useState('');
  const [socket, setSocket] = React.useState<WebSocket>();

  React.useEffect(() => {
    const getRooms = async () => {
      const response: Response = await fetch(getRoomsEndpoint, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const body = await response.json();
      console.log(body);
      setRooms(body.message);
    }

    getRooms();

    const socket = new WebSocket('wss://zmtmuxcpmb.execute-api.ap-northeast-1.amazonaws.com/poc-amplify-chat-chat-websocket-poc/');

    setSocket(socket);

    socket.onmessage = (event) => {
      console.log(event.data);
    }

    return () => {
      socket.close();
    }
  }, []);

  const handleSend = () => {
    socket?.send(
      JSON.stringify({
        action: 'sendMessage',
        data: {
          room: 'room1',
          user: 'user1',
          message: 'Hello, world!',
        },
      })
    );
  }

  return (
    <>
      <h1>Chat</h1>
      <div>
        {rooms}
      </div>
      <button onClick={handleSend}>Send</button>
    </>
  );
}

export default Index;
