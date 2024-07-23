"use client";

import * as React from 'react';

type Room = {
  id: string;
  name: string;
}

export default function Index() {
  // 環境変数を取得
  console.log(process.env.API_DOMAIN);
  console.log(process.env.WEBSOCKET_ENDPOINT);
  console.log(process.env.NEXT_PUBLIC_API_DOMAIN);
  console.log(process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT);

  const apiDomain = 'https://on7h3cdrrc.execute-api.ap-northeast-1.amazonaws.com/poc'
  const getRoomsEndpoint = `${apiDomain}/rooms`;
  const createRoomEndpoint = `${apiDomain}/room`;

  const [rooms, setRooms] = React.useState<Room[]>([]);
  // const [message, setMessage] = React.useState('');
  // const [socket, setSocket] = React.useState<WebSocket>();

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
      setRooms(body.rooms);
    }

    getRooms();

    // const socket = new WebSocket('wss://zmtmuxcpmb.execute-api.ap-northeast-1.amazonaws.com/poc-amplify-chat-chat-websocket-poc/');

  //   setSocket(socket);

  //   socket.onmessage = (event) => {
  //     console.log(event.data);
  //     const data = JSON.parse(event.data);
  //     setMessage(data.message);
  //   }

  //   return () => {
  //     socket.close();
  //   }
  }, []);

  // 部屋作成（入力値nameから部屋を作成）
  const handleCreateRoom = async (name: string) => {
    console.log(name);
    const response: Response = await fetch(createRoomEndpoint, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    const body = await response.json();
    console.log(body);
    setRooms([...rooms, body.room]);
  }
  

  // const handleSend = () => {
  //   console.log('send');
  //   socket?.send(
  //     JSON.stringify({
  //       action: 'sendMessage',
  //       data: {
  //         room: 'room1',
  //         user: 'user1',
  //         message: 'Hello, world!',
  //       },
  //     })
  //   );
  // }

  return (
    <>
      <h1>Chat</h1>

      <h2>Rooms</h2>

      {/* 部屋作成フォーム */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = e.currentTarget.name;
          handleCreateRoom(name);
        }}
      >
        <input type="text" name="name" />
        <button type="submit">Create Room</button>
      </form>
      

      <ul>
        {rooms.map((room) => (
          <li key={room.id}>{room.name}</li>
        ))}
      </ul>
      
      {/* <div>
        {message}
      </div> */}
      {/* <button onClick={handleSend}>Send</button> */}
    </>
  );
}
