export type SendMailNotificationParams = {
  subject: string;
  body: string;
};

export interface SendMailNotification {
  send(params: SendMailNotificationParams): Promise<void>;
}
