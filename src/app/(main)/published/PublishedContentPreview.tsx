interface PublishedContentPreviewProps {
  content: string | null | undefined;
}

export default function PublishedContentPreview({
  content,
}: PublishedContentPreviewProps) {
  if (!content) return <div>No Content available</div>;

  let filteredContent = content.replace(/<h1[^>]*>.*?<\/h1>/gs, "").trim();

  filteredContent = filteredContent.replace(
    /<p[^>]*data-p-placeholder="[^"]*"[^>]*>\s*<\/p>/g,
    "",
  );

  return (
    <div
      className="mt-5 font-mono text-xl font-medium leading-loose tracking-tight"
      dangerouslySetInnerHTML={{ __html: filteredContent }}
    />
  );
}
