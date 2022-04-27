import HttpException from "./HttpException";

class UnknownException extends HttpException {
  constructor(message: string) {
    super(500, message);
  }
}

export default UnknownException;