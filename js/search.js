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
    $.getJSON("http://api.yui-search.com/search?q=" + query , function(data) {
      for (var i = 0; i < data.length; i++) {
        var $item = $("<div>");
        var $title = $("<h3>")
          .text(data[i].title);
        $item.append($title);

        var $site_info = $('<p>')
          .attr({ class: 'site_info' })
          .text(data[i].permalink);
        $item.append($site_info);

        if (data[i].thumbnail) {
          var $row = $('<div>')
            .attr({ class: 'row' });

          var $col_image = $('<div>')
            .attr({ class: 'col-md-2' });
          var $image = $('<img>')
            .attr({
                class: 'thumbnail',
                src: data[i].thumbnail
            });
          $col_image.append($image);
          $row.append($col_image);

          var $col_snippet = $('<div>')
            .attr({ class: 'col-md-10' });
          var $snippet = $('<p>')
            .attr({ class: 'snippet' })
            .html(data[i].snippets);
          $col_snippet.append($snippet);
          $row.append($col_snippet);

          $item.append($row);
        } else {
          var $snippet = $('<p>')
            .attr({ class: 'snippet' })
            .html(data[i].snippets);
          $item.append($snippet);
        }   

        var $anchor = $("<a>")
          .attr({
            href: data[i].permalink,
            target: '_blank'
          })
          .append($item);
        self.container.append(
          $("<div>")
            .attr({ class: "row" })
            .append($anchor));
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

