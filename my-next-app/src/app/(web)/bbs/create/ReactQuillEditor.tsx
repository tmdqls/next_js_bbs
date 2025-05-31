import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

interface ReactQuillEditorProps {
  value?: string;
  onChange: (value: string) => void;
}

function ReactQuillEditor({ value, onChange }: ReactQuillEditorProps) {
  const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false }) 
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

