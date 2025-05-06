import DOMPurify from 'isomorphic-dompurify';

interface Props {
  htmlContent: string;
}

export default function SafeHtmlViewer({ htmlContent }: Props) {
  const sanitizedContent = DOMPurify.sanitize(htmlContent);

  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}