export interface MailMessage {
  body: string;
  // Add more properties as needed (e.g., subject, sender, etc.)
}
export interface EmailData {
  ReturnPath?: string;
  DeliveredTo?: string;
  From?: string;
  To?: string;
  Cc?: string;
  Subject?: string;
  Date?: string;
  MessageID?: string;
  Content?: string;
}