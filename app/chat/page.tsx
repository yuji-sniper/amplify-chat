"use client";

import { Box, Button, Card, TextField } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
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
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        height='100px'
        padding={2}
      >
        <h1>Chat</h1>

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
          <div>
            <TextField
              name="room_name"
              label="Room Name"
              variant="outlined"
              margin='normal'
            />
          </div>
          <Button
            variant='contained'
            type="submit"
          >
            Create Room
          </Button>
        </form>
        
        {/* 部屋一覧 */}
        <Grid2 container spacing={2}>
          {rooms.map((room) => (
            <Grid2 xs={4}>
              <Card
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  router.push(`/chat/room/${room.id}`);
                }}
              >
                <h2>{room.name}</h2>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </>
  );
}
