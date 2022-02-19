export type SendMailNotificationParams = {
  to: string;
  subject: string;
  body: string;
};

export interface SendMailNotification {
  send(params: SendMailNotificationParams): Promise<void>;
}
