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

// The types of alerts that users can choose from.
export const alertTypes = [
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

// The Alert block.
export const Alert = createReactBlockSpec(
  {
    type: "alert",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "mistral",
        values: ["gpt", "mistral", "claude", "ollama"],
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const alertType = alertTypes.find(
        (a) => a.value === props.block.props.type,
      )!;
      const Icon = alertType.icon;
      return (
        <div className={"alert"} data-alert-type={props.block.props.type}>
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
              {alertTypes.map((type) => {
                const ItemIcon = type.icon;

                return (
                  <Menu.Item
                    key={type.value}
                    leftSection={
                      <ItemIcon
                        className={"alert-icon"}
                        data-alert-icon-type={type.value}
                        color={type.color}
                      />
                    }
                    onClick={() =>
                      props.editor.updateBlock(props.block, {
                        type: "alert",
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
          {/*Rich text field for user to type in*/}
          <div className={"inline-content"} ref={props.contentRef} />
        </div>
      );
    },
  },
);
