const $ = require('jquery');
window.jQuery = window.$ = $;

const notify = require('notifyjs-browser')(this, $);

const tether = require('tether');
window.Tether = tether;

const bootstrap = require('vendor/bootstrap/js/bootstrap.js');

require('./flash')($); //Add flash messages
