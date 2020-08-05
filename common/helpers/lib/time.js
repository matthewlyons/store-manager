module.exports = {
  timeUntilMidnight() {
    let midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    let now = new Date();
    return [midnight - now, midnight.getTime()];
  }
};
