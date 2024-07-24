"use client";

import { useRouter } from 'next/navigation';
import * as React from 'react';

interface Room {
  id: string;
  name: string;
}

interface FormElement extends HTMLFormControlsCollection {
  room_name: HTMLInputElement;
}

export default function Page() {
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
  const getRoomsEndpoint = `${apiDomain}/rooms`;
  const createRoomEndpoint = `${apiDomain}/room`;

  const router = useRouter();

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
    setRooms(body.rooms);
  }

  React.useEffect(() => {
    getRooms();
  }, []);

  // 部屋作成
  const handleCreateRoom = async (room_name: string, form: HTMLFormElement) => {
    await fetch(createRoomEndpoint, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: room_name,
      }),
    });
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
          handleCreateRoom(target.room_name.value, form);
          form.reset();
        }}
      >
        <input type="text" name="room_name" />
        <button type="submit">Create Room</button>
      </form>
      
      <ul>
        {rooms.map((room) => (
          <li key={room.id}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              router.push(`/chat/room/${room.id}`);
            }}
          >
            {room.name}
          </li>
        ))}
      </ul>
    </>
  );
}
