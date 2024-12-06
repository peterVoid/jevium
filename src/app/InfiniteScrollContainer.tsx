import { useInView } from "react-intersection-observer";

export default function InfiniteScrollContainer({
  children,
  className,
  fetchNextPage,
}: {
  children: React.ReactNode;
  className: string;
  fetchNextPage: () => void;
}) {
  const { ref } = useInView({
    onChange(inView) {
      if (inView) {
        fetchNextPage();
      }
    },
  });

  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
}
