import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type EmployeeAvatar = {
  src?: string;
  name: string;
  fallback?: string;
  fallbackClassName?: string;
};

type EmployeesCardProps = {
  title: string;
  count: string | number;
  avatars: EmployeeAvatar[];
  className?: string;
};

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function EmployeesCard({
  title,
  count,
  avatars,
  className,
}: EmployeesCardProps) {
  return (
    <article
      className={cn(
        "flex h-44 flex-col justify-around rounded-[2.25rem] bg-brand-background px-5 py-6",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium leading-snug text-brand-gris text-start">
          {title}
        </p>
        <AvatarGroup className="-space-x-3 rtl:space-x-reverse">
          {avatars.map((avatar) => (
            <Avatar
              key={avatar.name}
              size="lg"
              className="size-10 ring-2 ring-brand-background md:size-11"
            >
              {avatar.src ? (
                <AvatarImage src={avatar.src} alt={avatar.name} />
              ) : null}
              <AvatarFallback
                className={cn(
                  "text-xs font-semibold text-white",
                  avatar.fallbackClassName ?? "bg-brand-primary"
                )}
              >
                {avatar.fallback ?? initialsFromName(avatar.name)}
              </AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>

      <div className="text-start">
        <p className="text-3xl font-bold tracking-tight text-brand-black md:text-4xl">
          {count}
        </p>
      </div>
    </article>
  );
}
