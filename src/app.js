(function (window, $) {

  var Templates = {};
  $('script[type="text/x-handlebars-template"]').each(function () {
    Templates[this.id] = Handlebars.compile(this.innerHTML);
  });

  window.onhashchange = function (e) {
    if (e.oldURL === e.newURL) {
      return;
    }
    var match = e.newURL.match(/#.+/);
    var hash = match ? match[0] : '';
    showPage(hash);
  };

  var client = contentful.createClient({
    space: 'gw535tje8lpl',
    accessToken: '99c27188fd1493adb1a4c5150744217c99ef90e7e6e22aa63012be69134305e8'
  });

  var ContentTypes = {
    GoogleImageSearch: '20NbuwseSYi6qSY2wA2GKK'
  };


  showPage(window.location.hash || '');

  function showPage(hash) {
    var pagePromise = renderGoogleImageTypes();


    pagePromise.then(function (html) {
      $('#myContent').html(html);
      window.dispatchEvent(new Event('page'));
    }).done();
  }

  function renderGoogleImageTypes(categoryId) {
    return client.entries({
      content_type: ContentTypes.GoogleImageSearch
    }).then(function (imageSearches) {
      var result = imageSearches.map(function (entry) {
        console.log(entry);
        return Templates.GoogleImageSearchTemplate({
          text: entry.fields.text,
          mainImageURL: assetUrl(entry, {
            fit: 'pad',
            w: 150,
            h: 150
          })
        });
      }).join('');

      return result;
    });
  }

  function assetUrl(asset, extraParams) {
    try {
      console.log(asset);
      var url = asset.fields.img.fields.file.url;

      if (extraParams) {
        var queryString = '';
        for (var key in extraParams) {
          queryString += '&' + key + '=' + extraParams[key];
        }
        url += '?' + queryString.substr(1);
      }
      return url;
    } catch (e) {
      console.error('Asset had no file URL:', asset);
      return 'images/show_item_01.jpg';
    }
  }



})(window, window.jQuery, window.contentful);
