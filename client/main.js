(function($, window, document, undefined) {
  'use strict';

  var main = $("#main");
  var url = "http://api.jukugo.tech";

  var senseTemplate =
    '<p>'
  + '{{#partsOfSpeech}}'
  + '<strong>{{&partsOfSpeech}}:</strong> '
  + '{{/partsOfSpeech}}'
  + '{{translations}}'
  + '</p>';

  var entryTemplate =
    '<div class="row">'
  +   '<h1 class="display-4">{{&writings}}</h1>'
  +   '<p class="lead">{{&readings}}</p>'
  +   '{{&senses}}'
  + '</div>'
  + '<hr>';

  $("document").ready(function() {

    $.get(url, function (response) {
      var entries = response.map(function (entry) {
        var view = {
          writings: entry.writings.map(function (writing) {
            return writing.kanji
          }).join(', '),
          readings: entry.readings.map(function (reading) {
            return reading.kana
          }).join(', '),
          senses: entry.senses.map(function (sense) {
            sense.translations = sense.translations.join(', ')
            if (sense.partsOfSpeech) sense.partsOfSpeech = sense.partsOfSpeech.join('<br>')
            return Mustache.render(senseTemplate, sense)
          }).join('')
        };

        return Mustache.render(entryTemplate, view)
      }).join('');

      main.html(entries)
    })
  });
}(window.jQuery, window, window,document))
