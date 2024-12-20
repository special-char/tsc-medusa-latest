import ReactMarkdownEditor from "@uiw/react-markdown-editor"
type Props = any
export const ReactMarkDownEditor = ({ value, onChange, ...props }: Props) => {
  return (
    <div className="overflow-hidden rounded-lg">
      <ReactMarkdownEditor
        visible={true}
        className="w-full"
        height="300px"
        value={value ?? ""}
        onChange={onChange}
      />
    </div>
  )
}
