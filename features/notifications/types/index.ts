export interface Notification {
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, string>;
}
