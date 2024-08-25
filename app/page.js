'use client'
import { Box, Button, Stack, TextField, Typography, Avatar } from '@mui/material'
import { useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ])
  const [message, setMessage] = useState('')

  
  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let result = ''

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: `url('/background.jpg')`,
        backgroundSize: "cover",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        color: "#f5f5f5"
    }}
    >
      <Stack      
        direction={'column'}
        width="800px"
        height="650px"
        border="4px solid orange"
        borderRadius={6}
        p={2}
        spacing={3}
        backgroundColor="white"
        opacity="0.9"
      >
        
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          p={1}
          spacing={2}
        >
          <Box textAlign="center">
            <Typography
              color="black"
              fontFamily="Raleway, Arial"
              fontWeight="bold"
              fontSize={30}
            >
              Rate my Professor
            </Typography>
          </Box>
          <Avatar
            alt="HeadStarter"
            src="/face.jpg"
            sx={{ width: 56, height: 56 }}
          />
        </Stack>
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'green'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}