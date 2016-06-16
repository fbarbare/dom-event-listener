var jsdom = require('jsdom').jsdom;
var lodash = require('lodash');

global._ = lodash;
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
