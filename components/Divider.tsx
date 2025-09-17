type Props = { className?: string };

export default function Divider({ className }: Props) {
  return (
    <hr aria-hidden="true" className={["w-full border-t-2 border-accent mt-8", className ?? ""].join(" ")} />
  );
}
