"use client";

import * as React from 'react';

interface Message {
  id: string;
  text: string;
  created_at: string;
}

interface FormElement extends HTMLFormControlsCollection {
  text: HTMLInputElement;
}

export default function Page(
  { params }: { params: { id: string } }
) {
  const roomId = params.id;

  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
  const getMessagesEndpoint = `${apiDomain}/messages`;
  const deleteConnectionEndpoint = `${apiDomain}/connection`;
  const websocketEndpoint = process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT;

  const [socket, setSocket] = React.useState<WebSocket|null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);

  const getMessages = async () => {
    const url = new URL(getMessagesEndpoint);
    url.searchParams.append('room_id', roomId);
    const response: Response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = await response.json();
    setMessages(body.messages);
  }

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
    getMessages();

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
      <h1>Room</h1>
      <h2>{roomId}</h2>
      <ul>
        {messages.map((message: any) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const target = form.elements as FormElement;
          handleSendMessage(target.text.value);
          form.reset();
        }}
      >
        <input type="text" name="text" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
