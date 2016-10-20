module.exports = function($) {
  $.notify.defaults({
    autoHideDelay: 15000
  });

  for (const val in flash) {
    const len = flash[val].length;
    for (let i = 0; i < len; i++) {
      $.notify(flash[val][i], val);
    }
  }
};
