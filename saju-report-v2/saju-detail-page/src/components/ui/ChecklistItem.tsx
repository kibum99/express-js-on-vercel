interface ChecklistItemProps {
  id?: string;
  text: string;
}

export function ChecklistItem({
  text,
}: ChecklistItemProps) {
  return (
    <div
      className="flex items-center gap-2.5 py-1.5"
    >
      <span className="text-[16px] text-accent shrink-0 leading-none">✓</span>
      <span className="text-foreground text-[14px] leading-[1.6]">
        {text}
      </span>
    </div>
  );
}
