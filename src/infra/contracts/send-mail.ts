export type SendMailParams = {
  to: string;
  subject: string;
  body: string;
};

export interface SendMail {
  send(params: SendMailParams): Promise<void>;
}
