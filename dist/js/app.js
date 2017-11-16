"use strict";

/* global jQuery */
/* eslint no-param-reassign: ["error", { "props": false }] */

(function ($) {
  $.fn.myPattern = function myPattern() {
    var $myPattern = $(this);
    var actions = {
      someAction: function someAction(opts) {
        return opts.a + opts.b;
      }
    };
    $.fn.myPattern.test = actions;
    return this;
  };
})(jQuery);