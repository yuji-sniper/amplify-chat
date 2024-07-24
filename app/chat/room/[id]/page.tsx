"use client";

import { Box, Button, List, ListItem, ListItemText, Paper, TextField, Typography } from '@mui/material';
import * as React from 'react';

interface Message {
  id: string;
  text: string;
}

interface FormElement extends HTMLFormControlsCollection {
  text: HTMLInputElement;
}

export default function Page(
  { params }: { params: { id: string } }
) {
  const roomId = params.id;

  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
  const deleteConnectionEndpoint = `${apiDomain}/connection`;
  const websocketEndpoint = process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT;

  const [socket, setSocket] = React.useState<WebSocket|null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);

  const initializeWebSocket = () => {
    const socket = new WebSocket(`${websocketEndpoint}?room_id=${roomId}`);
    let connectionId: string|null = null;
    setSocket(socket);

    socket.onopen = () => {
      socket?.send(
        JSON.stringify({
          action: 'sendConnectionId',
        })
      );
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const type = data.type;
      switch (type) {
        case 'message':
          setMessages((prevMessages) => [...prevMessages, data.message]);
          break;
        case 'connection':
          connectionId = data.connection_id;
          break;
        default:
          console.log(data.message);
      }
    }

    socket.onclose = async () => {
      await fetch(deleteConnectionEndpoint, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_id: roomId,
          connection_id: connectionId,
        }),
      });
    }

    return () => {
      socket.close();
    }
  }

  React.useEffect(() => {
    const cleanupWebSocket = initializeWebSocket();

    return cleanupWebSocket;
  }, []);

  const handleSendMessage = (text: string) => {
    socket?.send(
      JSON.stringify({
        action: 'sendMessage',
        data: {
          room_id: roomId,
          text: text,
        }
      })
    );
  }

  return (
    <>
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        padding={4}
      >
        <Paper
          elevation={3}
          style={{
            width: '100%',
            maxWidth: '600px',
            padding: '20px'
          }}
        >
          <Typography variant="h4" gutterBottom>
            Chat Room: {roomId}
          </Typography>
          <List style={{ maxHeight: '400px', overflow: 'auto' }}>
            {messages.map((message: any) => (
              <ListItem key={message.id}>
                <ListItemText primary={message.text} secondary={new Date(message.created_at).toLocaleString()} />
              </ListItem>
            ))}
          </List>
          <Box component="form"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const target = form.elements as FormElement;
              handleSendMessage(target.text.value);
              form.reset();
            }}
            mt={2}
            display="flex"
            alignItems="center"
          >
            <TextField
              name="text"
              label="Type your message"
              variant="outlined"
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '10px' }}>
              Send
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
