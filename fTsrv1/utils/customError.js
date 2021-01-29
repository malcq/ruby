class PossibleContinueError extends Error {
  constructor(responseObject, message) {
    super(message);
    this.name = this.constructor.name;
    this.response = responseObject;
  }
}

module.exports = PossibleContinueError;
