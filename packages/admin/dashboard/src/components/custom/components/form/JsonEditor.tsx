import React from "react"
import MonacoEditor from "@monaco-editor/react"
import { Container } from "@medusajs/ui"
import { useTheme } from "../../../../providers/theme-provider"

type JsonEditorFieldProps = {
  onChange: (value: string | undefined) => void
  value: string
}

const JsonEditor: React.FC<JsonEditorFieldProps> = ({ onChange, value }) => {
  const { theme } = useTheme()

  return (
    <Container>
      <MonacoEditor
        height="250px"
        language="json"
        theme={theme !== "dark" ? "light" : "vs-dark"}
        value={value}
        onChange={onChange}
        onMount={(editor, monaco) => {
          setTimeout(function () {
            editor.getAction("editor.action.formatDocument").run()
          }, 300)

          editor.onDidFocusEditorText(() => {
            // for new line on enter, as it was not working because enter key event is prevented by harsh bhai for not submitting form.
            editor.addCommand(monaco.KeyCode.Enter, () => {
              editor.trigger("keyboard", "type", { text: "\n" })
            })
          })
        }}
        options={{
          automaticLayout: true,
          formatOnType: true,
          formatOnPaste: true,
          autoClosingBrackets: "always",
        }}
      />
    </Container>
  )
}

export default JsonEditor
