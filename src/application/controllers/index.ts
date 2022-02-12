export interface Controller<Req = any, Res = any> {
  handle(request: Req): Promise<Res>;
}
