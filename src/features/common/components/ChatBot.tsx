// src/ChatBot.tsx
import {
  Button,
  Stack,
  TextInput,
  Box,
  Paper,
  ScrollArea,
  useMantineTheme,
  Loader,
} from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Campfire, X } from "tabler-icons-react";
// import ChatGPTClient from "./ChatGPTClient";
// import { ChatCompletionRequestMessageRoleEnum } from "openai";

// const chatGptClient = new ChatGPTClient();

// const analyzeMessage = async (message: string): Promise<string> => {
//   try {
//     const chatGPTMessages = [
//       {
//         role: ChatCompletionRequestMessageRoleEnum.System,
//         content: "You are a helpful camping chatbot.",
//       },
//       {
//         role: ChatCompletionRequestMessageRoleEnum.User,
//         content: message,
//       },
//     ];

//     const response = await chatGptClient.respond(chatGPTMessages);

//     if (response.text) {
//       return response.text;
//     } else {
//       return "I'm not sure what you need. Can you please provide more information?";
//     }
//   } catch (error) {
//     console.error("Error while analyzing message:", error);
//     return "I'm having some trouble understanding your request. Please try again later.";
//   }
// };

interface Message {
  sender: "user" | "bot";
  content: string;
}

interface LoaderProps {
  size?: string;
  color?: string;
  variant?: string;
}

export const TypingLoader = () => {
  const theme = useMantineTheme();
  return (
    <Loader
      size="sm"
      variant="dots"
      color={
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6]
      }
    />
  );
};

export const ChatBot: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      content: "Hi, I am Camper Chris! How may I help you?",
    },
  ]);
  const viewport = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen]);

  const scrollToBottom = () =>
    viewport.current?.scrollTo({
      top: viewport.current?.scrollHeight,
      behavior: "smooth",
    });

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    scrollToBottom();

    event.preventDefault();
    const input = event.currentTarget.elements.namedItem(
      "message-input"
    ) as HTMLInputElement;
    const message = input.value.trim();

    if (message) {
      setMessages([...messages, { sender: "user", content: message }]);
      input.value = "";
      setIsTyping(true);

      setTimeout(() => {
        scrollToBottom();
      }, 500);

      setTimeout(() => {
        const response = analyzeMessage(message);
        setMessages([
          ...messages,
          { sender: "user", content: message },
          { sender: "bot", content: response },
        ]);
        setIsTyping(false);
      }, 1000);

      setTimeout(() => {
        scrollToBottom();
      }, 1500);
    }
  };

  const analyzeMessage = (message: string): string => {
    // Your hardcoded analysis logic here, e.g.:
    if (
      message.toLowerCase().includes("2-day") ||
      message.toLowerCase().includes("black") ||
      message.toLowerCase().includes("2 days") ||
      message.toLowerCase().includes("2days")
    ) {
      return `I suggest <a class="bot-link" href="/product/6436412420246e30a2a43553">"Hot Black Soul Camping Style"</a> package, 2-day, 1-night, all-inclusive for 1-2 people with a tent, sleeping pad(s), camp light, stove, and more. Tent is wind/rain-resistant, gas stove needs separate purchase/prep.`;
    }
    return "I'm not sure what you need. Can you please provide more information?";
  };

  return (
    <div className="chatbot">
      <Button
        leftIcon={isOpen ? <X /> : <Campfire />}
        radius="xl"
        mb={isOpen ? "sm" : "none"}
        onClick={handleButtonClick}
      >
        {isOpen ? "Close" : "Ask Camper Chris"}
      </Button>

      {isOpen && (
        <Paper
          className="flex flex-col border-[3px] border-gray-400 overflow-hidden"
          h={500}
          w={350}
          shadow="xl"
        >
          <Box
            h={50}
            className="bg-[#3f7566] flex items-center px-3 text-white font-bold"
          >
            <Campfire size={25} />
            <div>Camper Chris</div>
          </Box>

          <ScrollArea
            viewportRef={viewport}
            type="never"
            className="flex-1"
            h={300}
            p="sm"
          >
            <Stack className="chatbot-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chatbot-message ${message.sender}`}
                  dangerouslySetInnerHTML={{ __html: message.content }}
                  onClick={(e: any) => {
                    if (e.target.tagName === "A") {
                      e.preventDefault();
                      router.push(e.target.href);
                      setIsOpen(false);
                    }
                  }}
                ></div>
              ))}
              {isTyping && (
                <div className="chatbot-message bot w-[40px]">
                  <TypingLoader />
                </div>
              )}
            </Stack>

            <Box h={50} />
          </ScrollArea>
          <Box p="sm">
            <form className="flex mt-3" onSubmit={handleSubmit}>
              <TextInput
                radius="xl"
                mt="5"
                className="flex-1"
                type="text"
                name="message-input"
                placeholder="Type your message..."
                autoComplete="off"
                mr="xs"
              />

              <Button type="submit" radius="xl">
                Ask
              </Button>
            </form>
          </Box>
        </Paper>
      )}
    </div>
  );
};
