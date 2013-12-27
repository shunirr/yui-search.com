var YuiSearch = function() { this.initialize.apply(this, arguments); };
YuiSearch.prototype = {
  initialize: function(options) {
    var settings = $.extend({
      container:       "#contents",
      count_container: "#count",
      information:     "#information",
    }, options);
    this.container       = $(settings.container);
    this.count_container = $(settings.count_container);
    this.information     = $(settings.information);
    this.page            = settings.page;
  },
  next: function() {
    if (this.page + 1 <= this.total_page_count) {
      this.page += 1;
      return true;
    }
    return false;
  },
  create_item: function(item_title, item_url, item_snippets, image_url) {
    var item = $("<div>").attr({ class: "col-md-12" });
    var title = $("<h3>")
    var anchor = $("<a>")
      .attr({
        href: item_url,
        target: '_blank'
      })
      .text(item_title)
    title.append(anchor)
    item.append(title);

    var site_info = $('<p>')
      .attr({ class: 'site_info' })
      .text(item_url);
    item.append(site_info);

    if (image_url) {
      var row = $('<div>')
        .attr({ class: 'row' })

      var col_image = $('<div>')
        .attr({ class: 'col-md-2' })
      var img_anchor = $("<a>")
        .attr({
          href: item_url,
          target: '_blank'
        })
      var image = $('<img>')
        .attr({ class: 'thumbnail' })
        .attr({ src: image_url })
      img_anchor.append(image);
      col_image.append(img_anchor);
      row.append(col_image);

      var col_snippet = $('<div>')
        .attr({ class: 'col-md-10' })
      var snippet = $('<p>')
        .attr({ class: 'snippet' })
        .html(item_snippets);
      col_snippet.append(snippet);
      row.append(col_snippet);

      item.append(row);
    } else {
      var snippet = $('<p>')
        .attr({ class: 'snippet' })
        .html(item_snippets);
      item.append(snippet);
    }   
    return $("<div>").attr({ class: "row" }).append(item);
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
          self.container.prepend(
              self.create_item(title, video, null, thumbnail)
          );
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

      self.count_container.children().remove();
      if (data.total_count && data.total_count > 0) {
        self.count_container
          .append($('<p>').text(data.total_count + " 件ヒット"));
      } else {
        self.count_container
          .append($('<p>').text("「ゆいちゃんさすがにその検索ワードはないよ〜」"))
          .append($('<p>').text("「エッ!! キャリさんだって前は" + query + "について調べようとしてたじゃん!」"))
          .append($('<p>').text("「え〜そんなことないよ〜」"))
          .append($('<p>').text("「ゆいももう大人なんだから" + query +"くらい Google で調べるもん!」"));
      }

      var entries = data.entries;
      if (!entries) {
        return;
      }
      
      self.total_page_count = parseInt(data.total_page_count);
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        self.container.append(
            self.create_item(entry.title, entry.permalink, entry.snippets, entry.thumbnail)
        );
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
    container:       "#contents",
    count_container: "#count",
    information:     "#information",
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

