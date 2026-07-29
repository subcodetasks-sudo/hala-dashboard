"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/features/profile/queries/use-profile";
import { ChevronDown } from "lucide-react";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function NavProfileSkeleton() {
  return (
    <div className="flex h-12 items-center gap-2 rounded-full bg-brand-background py-0.5 ps-1 pe-1 md:pe-3">
      <Skeleton className="size-10 shrink-0 rounded-full bg-brand-primary/15" />
      <div className="hidden md:flex min-w-0 flex-col gap-1.5">
        <Skeleton className="h-3.5 w-24 bg-brand-primary/15" />
        <Skeleton className="h-3 w-14 bg-brand-gris/15" />
      </div>
      <ChevronDown className="hidden md:block size-4 text-brand-accent/40 shrink-0" />
    </div>
  );
}

export default function DashboardNavProfile() {
  const { data: profile, isPending, isError } = useProfile();

  if (isPending || (!profile && !isError)) {
    return <NavProfileSkeleton />;
  }

  if (!profile) {
    return null;
  }

  const name = profile.name?.trim() || "";
  const role = profile.roles?.[0]?.label || profile.roles?.[0]?.name || "";
  const initials = name ? getInitials(name) : "?";
  const avatarSrc = profile.avatar || undefined;

  return (
    <div className="flex h-12 items-center gap-2 rounded-full bg-brand-background py-0.5 ps-1 pe-1 md:pe-3 transition-colors hover:bg-brand-background/80 cursor-pointer">
      <div className="relative size-10 shrink-0">
        <Avatar className="size-10 after:border-0">
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback className="rounded-full bg-white text-sm font-semibold text-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span
          className="absolute top-0 right-0 size-2.5 rounded-full border-2 border-brand-background bg-brand-success"
          aria-hidden
        />
      </div>

      <div className="hidden md:block min-w-0 text-start leading-tight">
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>

      <ChevronDown className="hidden md:block size-4 text-brand-accent shrink-0" />
    </div>
  );
}
