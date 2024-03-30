"use client";

import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Menu } from "@mantine/core";
import { SiOpenai } from "react-icons/si";
import { GoNorthStar } from "react-icons/go";
import { HiSparkles } from "react-icons/hi2";
import "./styles.css";
import MistralIcon from "./MistralIcon";
import OllamaIcon from "./OllamaIcon";
import { useChat } from "ai/react";
import { useState } from "react";
import { BallTriangle } from "react-loader-spinner";

// The types of alerts that users can choose from.
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

export const Assistant = createReactBlockSpec(
  {
    type: "assistant",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "mistral",
        values: ["gpt", "mistral", "claude", "ollama"],
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const updateBlock = (message) => {
        props.editor.updateBlock(props.block, {
          type: "paragraph",
          content: message.content,
        });
      };
      const { messages, input, handleInputChange, handleSubmit } = useChat({
        onFinish: updateBlock,
      });
      const [showForm, setShowForm] = useState(true);
      const onSubmit = async (e) => {
        e.preventDefault();
        await handleSubmit(e);
        setShowForm(false);
      };
      const model = models.find((a) => a.value === props.block.props.type)!;
      const Icon = model.icon;
      return (
        <div className={"alert"} data-alert-type={props.block.props.type}>
          {showForm ? (
            <>
              {/*Icon which opens a menu to choose the Alert type*/}
              <Menu withinPortal={false} zIndex={999999}>
                <Menu.Target>
                  <div className={"alert-icon-wrapper"} contentEditable={false}>
                    <Icon
                      className={"alert-icon"}
                      data-alert-icon-type={props.block.props.type}
                      size={32}
                    />
                  </div>
                </Menu.Target>
                {/*Dropdown to change the Alert type*/}
                <Menu.Dropdown>
                  <Menu.Label>Choose Model</Menu.Label>
                  <Menu.Divider />
                  {models.map((type) => {
                    const ItemIcon = type.icon;

                    return (
                      <Menu.Item
                        key={type.value}
                        leftSection={
                          <ItemIcon
                            className={"alert-icon"}
                            color={type.color}
                          />
                        }
                        onClick={() =>
                          props.editor.updateBlock(props.block, {
                            type: "assistant",
                            props: { type: type.value },
                          })
                        }
                      >
                        {type.title}
                      </Menu.Item>
                    );
                  })}
                </Menu.Dropdown>
              </Menu>
              <form onSubmit={onSubmit} className="w-full">
                {/*Rich text field for user to type in*/}
                <input
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  value={input}
                  placeholder="What do you need help with?"
                  onChange={handleInputChange}
                />
              </form>
            </>
          ) : (
            <>
              <BallTriangle
                height={25}
                width={25}
                radius={5}
                color="lightgray"
                ariaLabel="ball-triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
              {messages.map(
                (m) =>
                  m.role !== "user" && (
                    <div
                      key={m.id}
                      className="whitespace-pre-wrap"
                      ref={props.contentRef}
                    >
                      {m.content}
                    </div>
                  ),
              )}
            </>
          )}
        </div>
      );
    },
  },
);
