var YuiSearch = function() { this.initialize.apply(this, arguments); };
YuiSearch.prototype = {
  initialize: function(options) {
    var settings = $.extend({
      container: "#contents",
    }, options);
    this.container = $(settings.container);
    this.photoSize = settings.photoSize;
  },
  search: function(query, page) {
    var self = this;
    $.getJSON("http://api.yui-search.com/search?q=" + query + "&page=" + page, function(data) {
      var entries = data.entries;
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var item = $("<div>").attr({ class: "col-md-12" });
        var title = $("<h3>")
        var anchor = $("<a>")
          .attr({
            href: entry.permalink,
            target: '_blank'
          })
          .text(entry.title)
        title.append(anchor)
        item.append(title);

        var site_info = $('<p>')
          .attr({ class: 'site_info' })
          .text(entry.permalink);
        item.append(site_info);

        if (entry.thumbnail) {
          var row = $('<div>')
            .attr({ class: 'row' })

          var col_image = $('<div>')
            .attr({ class: 'col-md-2' })
          var img_anchor = $("<a>")
            .attr({
              href: entry.permalink,
              target: '_blank'
            })
          var image = $('<img>')
            .attr({ class: 'thumbnail' })
            .attr({ src: entry.thumbnail })
          img_anchor.append(image);
          col_image.append(img_anchor);
          row.append(col_image);

          var col_snippet = $('<div>')
            .attr({ class: 'col-md-10' })
          var snippet = $('<p>')
            .attr({ class: 'snippet' })
            .html(entry.snippets);
          col_snippet.append(snippet);
          row.append(col_snippet);

          item.append(row);
        } else {
          var snippet = $('<p>')
            .attr({ class: 'snippet' })
            .html(entry.snippets);
          item.append(snippet);
        }   
        self.container.append(
          $("<div>")
            .attr({ class: "row" })
            .append(item));
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
  var page  = $.url().param('page');
  $('input[name="q"]').val(query);
  $('#tweet').socialbutton('twitter', {
    button: 'horizontal',
    url: location.href,
    text: query + ' - ゆいゆい検索!!'
  });
  searcher.search(query, page);
}());

