import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationBellProps {
  unreadCount: number;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount,
}) => {
  return (
    <div className="relative inline-flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className="relative transition-all duration-300 hover:scale-110"
      >
        <Bell className="h-6 w-6 text-gray-700 dark:text-gray-200" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px] font-bold ring-2 ring-white dark:ring-gray-900 animate-in zoom-in duration-300"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};
