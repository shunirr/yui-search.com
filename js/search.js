var YuiSearch = function() { this.initialize.apply(this, arguments); };
YuiSearch.prototype = {
  initialize: function(options) {
    var settings = $.extend({
      container: "#contents",
    }, options);
    this.container = $(settings.container);
    this.page = settings.page;
  },
  next: function() {
    if (this.page + 1 <= this.total_page_count) {
      this.page += 1;
      return true;
    }
    return false;
  },
  youtube: function(query) {
    var self = this;
    $.getJSON("http://gdata.youtube.com/feeds/api/videos?alt=json&q=" + query, function(data) {
      var entries = data.feed.entry;
      if (entries) {
        var entry = entries[0];
        var author    = entry.author[0].name.$t;
        var video     = entry.media$group.media$player[0].url;
        var thumbnail = entry.media$group.media$thumbnail[0].url;
        var title     = entry.media$group.media$title.$t;
        if (author == "kingrecords") {
          var anchor = $('<a>').attr({
            href: video,
            target: '_blank'
          });
          var image = $('<img>').attr({
            src: thumbnail,
            width: "240",
            height: "180"
          });
          anchor.append(image);
          self.container.prepend(anchor);
        }
      }
    });
  },
  search: function(query) {
    var self = this;
    $.getJSON("http://api.yui-search.com/search?q=" + query + "&page=" + self.page, function(data) {
      if (self.page == 1 && data.info) {
        self.youtube(data.info);
      }

      if (data.total_count && data.total_count > 0) {
        $('p[id="total_count"]').text(data.total_count + " 件ヒット");
      } else {
        $('p[id="total_count"]').text("みつかりませんでした");
      }

      var entries = data.entries;
      if (!entries) {
        return;
      }
      
      self.total_page_count = parseInt(data.total_page_count);
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
  var query   = $.url().param('q');
  var pageStr = $.url().param('page');
  if (pageStr) {
    page = parseInt(pageStr);
  } else {
    page = 1;
  }

  $('input[name="q"]').val(query);
  $('#tweet').socialbutton('twitter', {
    button: 'horizontal',
    url: location.href,
    text: query + ' - ゆいゆい検索!!'
  });

  var searcher = new YuiSearch({
    container: "#contents",
    page: page
  });
  searcher.search(query);

  // AutoPager
  $(window).on("scroll", function() {
      var scrollHeight = $(document).height();
      var scrollPosition = $(window).height() + $(window).scrollTop();
      if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
        if (searcher.next()) {
          searcher.search(query);
        }
      }
  });
}());

