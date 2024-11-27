import { useState } from 'react';
import {
  Container, Header, SpaceBetween, TextContent, Button, Box
} from "@cloudscape-design/components";
import ChatBubble from "@cloudscape-design/chat-components/chat-bubble";
import LoadingBar from "@cloudscape-design/chat-components/loading-bar";
import Avatar from "@cloudscape-design/chat-components/avatar";
import PromptInput from "@cloudscape-design/components/prompt-input";

import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();
export function Bot(props: any) {
  type chat = {
    role: string;
    text: string;
  };

  const [chats, setChats] = useState<chat[]>([]);
  const [value, setValue] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <div>Ask AI assistant</div>
  );
}