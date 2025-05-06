import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface ReactQuillEditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any;
  value?: string;
  onChange: (value: string) => void;
}

function ReactQuillEditor({ value, onChange }: ReactQuillEditorProps) {
  return (
    <div className="w-full min-h-[350px]">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        style={{ height: "300px", backgroundColor: "white" }}
        className="[&_.ql-editor]:bg-white"
      />
    </div>
  );
}
export default ReactQuillEditor;

