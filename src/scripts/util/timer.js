// Source - https://stackoverflow.com/a/57981688
// Posted by Tomasz Bubała, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-02, License - CC BY-SA 4.0

export class Timer {
  constructor() {
    this.isRunning = false;
    this.startTime = 0;
    this.overallTime = 0;
  }

  _getTimeElapsedSinceLastStartMs() {
    if (!this.startTime) {
      return 0;
    }

    return Date.now() - this.startTime;
  }

  start() {
    if (this.isRunning) {
      return console.error('Timer is already running');
    }

    this.isRunning = true;

    this.startTime = Date.now();
  }

  stop() {
    if (!this.isRunning) {
      return console.error('Timer is already stopped');
    }

    this.isRunning = false;

    this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStartMs();
  }

  reset() {
    this.overallTime = 0;

    if (this.isRunning) {
      this.startTime = Date.now();
      return;
    }

    this.startTime = 0;
  }

  getTime() {
    if (!this.startTime) {
      return { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    }

    if (this.isRunning) {
      return this.getTimeFromMilliseconds(this.overallTime + this._getTimeElapsedSinceLastStartMs());
    }

    return this.getTimeFromMilliseconds(this.overallTime);
  }

  getTimeFromMilliseconds(milliseconds) {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 60);

    return { hours, minutes, seconds, milliseconds };
  }
}
