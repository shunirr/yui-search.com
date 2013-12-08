var YuiSearch = function() { this.initialize.apply(this, arguments); };
YuiSearch.prototype = {
  initialize: function(options) {
    var settings = $.extend({
      container: "#contents",
    }, options);
    this.container = $(settings.container);
    this.photoSize = settings.photoSize;
  },
  search: function(query) {
    var self = this;
    $.getJSON("http://api.s5r.jp/search?q=" + query , function(data) {
      for (var i = 0; i < data.length; i++) {
        var $item = $("<div>").attr({ class: "col-md-6" });
        var $title = $("<h2>")
        var $anchor = $("<a>")
          .attr({
            href: data[i].permalink,
            target: 'blank'
          })
          .text(data[i].title)
        $title.append($anchor)
        var $snippet = $('<p>')
          .attr({ class: 'snippet' })
          .html(data[i].snippets);
        $item.append($title);
        $item.append($snippet);
        self.container.append($item);
      }
    });
  }
};
(function() {
  $('#search_button').remove();
  var searcher = new YuiSearch({
    container: "#contents"
  });
  var query = $.url().param('q');
  $('input[name="q"]').val(query);
  $('#tweet').socialbutton('twitter', {
    button: 'horizontal',
    url: location.href,
    text: query + ' - ゆいゆい検索!!'
  });
  searcher.search(query);
}());
