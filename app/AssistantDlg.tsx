"use client";

import { Menu } from "@mantine/core";
import { SiOpenai } from "react-icons/si";
import { GoNorthStar } from "react-icons/go";
import { HiSparkles } from "react-icons/hi2";
import "./styles.css";
import MistralIcon from "./MistralIcon";
import OllamaIcon from "./OllamaIcon";
import { useChat } from "ai/react";
import { useState } from "react";

// The types of models that users can choose from.
export const models = [
  {
    title: "GPT-4",
    value: "gpt",
    icon: SiOpenai,
    color: "#0cac84",
    backgroundColor: {
      light: "#fff6e6",
      dark: "#805d20",
    },
  },
  {
    title: "Mistral",
    value: "mistral",
    icon: MistralIcon,
    color: "#ff4100",
    backgroundColor: {
      light: "#ffe6e6",
      dark: "#802020",
    },
  },
  {
    title: "Claude",
    value: "claude",
    icon: GoNorthStar,
    color: "#ff7400",
    backgroundColor: {
      light: "#e6ebff",
      dark: "#203380",
    },
  },
  {
    title: "Ollama",
    value: "ollama",
    icon: OllamaIcon,
    color: "white",
    backgroundColor: {
      light: "#e6ffe6",
      dark: "white",
    },
  },
] as const;

// The Assistant component.
export const AssistantDlg = ({ onClose, onGenerateContent }) => {
  const { input, handleInputChange, handleSubmit, messages } = useChat();
  const [showForm, setShowForm] = useState(true);
  const [selectedModel, setSelectedModel] = useState("mistral");

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(e);
    setShowForm(false);
    // Get the response from the messages array
    const response = "test";
    // Generate the content and pass it to the onGenerateContent callback
    onGenerateContent(response);
    // Close the dialog
    onClose();
  };

  const Icon = models.find((a) => a.value === selectedModel)!.icon;

  return (
    <div className={"alert"} data-alert-type={selectedModel}>
      {/*Icon which opens a menu to choose the model*/}
      {showForm ? (
        <>
          <Menu withinPortal={false} zIndex={999999}>
            <Menu.Target>
              <div className={"alert-icon-wrapper"} contentEditable={false}>
                <Icon
                  className={"alert-icon"}
                  data-alert-icon-type={selectedModel}
                  size={32}
                />
              </div>
            </Menu.Target>
            {/*Dropdown to change the model*/}
            <Menu.Dropdown>
              <Menu.Label>Choose Model</Menu.Label>
              <Menu.Divider />
              {models.map((type) => {
                const ItemIcon = type.icon;

                return (
                  <Menu.Item
                    key={type.value}
                    leftSection={
                      <ItemIcon className={"alert-icon"} color={type.color} />
                    }
                    onClick={() => setSelectedModel(type.value)}
                  >
                    {type.title}
                  </Menu.Item>
                );
              })}
            </Menu.Dropdown>
          </Menu>
          {/*Input field for user to type in*/}
          <form onSubmit={onSubmit} className="w-full">
            <input
              className="w-full p-2 border border-gray-300 rounded"
              value={input}
              placeholder="What do you need help with?"
              onChange={handleInputChange}
            />
          </form>
        </>
      ) : null}
    </div>
  );
};
