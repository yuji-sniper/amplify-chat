"use client";

import * as React from 'react';

interface Room {
  id: string;
  name: string;
}

interface FormElement extends HTMLFormControlsCollection {
  room_name: HTMLInputElement;
}

export default function Index() {
  // 環境変数を取得
  console.log(process.env.NEXT_PUBLIC_API_DOMAIN);
  console.log(process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT);

  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
  const getRoomsEndpoint = `${apiDomain}/rooms`;
  const createRoomEndpoint = `${apiDomain}/room`;

  const [rooms, setRooms] = React.useState<Room[]>([]);

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

  React.useEffect(() => {
    getRooms();
  }, []);

  // 部屋作成（入力値room_nameから部屋を作成）
  const handleCreateRoom = async (room_name: string) => {
    console.log(room_name);
    const response: Response = await fetch(createRoomEndpoint, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: room_name,
      }),
    });
    const body = await response.json();
    console.log(body);
    await getRooms();
  }

  return (
    <>
      <h1>Chat</h1>

      <h2>Rooms</h2>

      {/* 部屋作成フォーム */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const target = form.elements as FormElement;
          handleCreateRoom(target.room_name.value);
        }}
      >
        <input type="text" name="room_name" />
        <button type="submit">Create Room</button>
      </form>
      
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>{room.name}</li>
        ))}
      </ul>
    </>
  );
}
