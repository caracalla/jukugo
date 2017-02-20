(function($, window, document, undefined) {
  'use strict';

  var main = $("#main");
  var url = "http://api.jukugo.tech/entries";

  var entryTemplate =
    '<div class="row">'
  +   '<h1 class="display-4">{{&writings}}</h1>'
  +   '<p class="lead">{{&readings}}</p>'
  +   '{{&senses}}'
  + '</div>'
  + '<hr>';

  var writingTemplate = '<span{{#priority}} class="text-danger"{{/priority}}>{{kanji}}</span>';

  var readingTemplate = '<span{{#priority}} class="text-danger"{{/priority}}>{{kana}}</span>';

  var senseTemplate =
    '<p>'
  +   '{{#partsOfSpeech}}'
  +   '<strong>{{&partsOfSpeech}}:</strong> '
  +   '{{/partsOfSpeech}}'
  +   '{{translations}}'
  + '</p>';

  var renderEntry = function (entry) {
    var view = {
      writings: entry.writings.map(function (writing) {
        return Mustache.render(writingTemplate, writing);
      }).join(', '),

      readings: entry.readings.map(function (reading) {
        return Mustache.render(readingTemplate, reading);
      }).join(', '),

      senses: entry.senses.map(function (sense) {
        sense.translations = sense.translations.join(', ')

        if (sense.partsOfSpeech) {
          sense.partsOfSpeech = sense.partsOfSpeech.join('<br>');
        }

        return Mustache.render(senseTemplate, sense);
      }).join('')
    };

    return Mustache.render(entryTemplate, view);
  };

  $("document").ready(function() {
    $.get(url, function (response) {
      console.log(JSON.stringify(response[29]))
      var entries = response.map(renderEntry).join('');

      main.html(entries);
    })
  });
}(window.jQuery, window, window.document));
