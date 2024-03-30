"use client"; // this registers <Editor> as a Client Component
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteView,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";

import { HiSparkles } from "react-icons/hi2";
import { Assistant } from "./Assistant";
import { AssistantDlg } from "./AssistantDlg";
import { useState } from "react";

// Our schema with block specs, which contain the configs and implementations for blocks
// that we want our editor to use.
const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the Alert block.
    assistant: Assistant,
  },
});

export default function App() {
  // Slash menu item to insert an Alert block
  const insertAssistant = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Generate UI Block",
    onItemClick: () => {
      insertOrUpdateBlock(editor, {
        type: "assistant",
      });
    },
    //search terms
    aliases: ["ai", "generate", "assistant"],
    group: "Magic",
    icon: <HiSparkles color="yellow" />,
    subtext: "Generate UI elements",
  });
  const openAssistant = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Generate UI Dialog",
    onItemClick: () => {
      setAssistantOpen(true);
    },
    //search terms
    aliases: ["ai", "generate", "assistant"],
    group: "Magic",
    icon: <HiSparkles color="yellow" />,
    subtext: "Generate UI elements",
  });
  const [assistantOpen, setAssistantOpen] = useState(false);
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "heading",
        content: "Generative Blog 🌱",
      },
      {
        type: "paragraph",
        content: "Press the '/' key to open the Slash Menu and add another",
      },
      {
        type: "paragraph",
      },
    ],
  });

  // Renders the editor instance.
  return (
    <BlockNoteView editor={editor} slashMenu={false}>
      {assistantOpen && (
        <AssistantDlg
          onClose={() => setAssistantOpen(false)}
          onGenerateContent={(content) => {
            // Handle the generated content
            console.log("Generated content:", content);
            const lastBlock = editor.document[editor.document.length - 1];

            // Insert the generated content as a new block
            editor.insertBlocks(
              [
                {
                  content:
                    "This block was inserted at " +
                    new Date().toLocaleTimeString(),
                },
              ],
              lastBlock,
              "after",
            );
          }}
        />
      )}
      {/* Replaces the default Slash Menu. */}
      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={async (query) =>
          // Gets all default slash menu items and `insertAssistant` item.
          filterSuggestionItems(
            [
              ...getDefaultReactSlashMenuItems(editor),
              insertAssistant(editor),
              openAssistant(editor),
            ],
            query,
          )
        }
      />
    </BlockNoteView>
  );
}
