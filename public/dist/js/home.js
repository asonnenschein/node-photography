var HomeGalleryItem = React.createClass({displayName: "HomeGalleryItem",
  render: function () {
    var slideClass = "slide " + this.props.active;
    return (
      React.createElement("div", {className: slideClass, ref: "slideImage"}, 
        React.createElement("div", {className: "pure-u-1-1 pure-u-lg-1-1", ref: "image"}, 
          React.createElement("a", {href: this.props.gallery}, 
            React.createElement("img", {className: "pure-img", src: this.props.path})
          )
        )
      )
    );
  }
});

var HomeGalleryNav = React.createClass({displayName: "HomeGalleryNav",
  render: function () {
    return (
      React.createElement("div", null)
    );
  }
});

var Home = React.createClass({displayName: "Home",
  getInitialState: function() {
    this.props.source = "/galleries/";
    return {data: null};
  },
  componentDidMount: function () {
    $.ajax({
      url: this.props.source,
      type: 'GET',
      success: function (data) {
        if (this.isMounted()) this.setState({data: data});
        var other = [];
        var children = $(this.getDOMNode()).find('#slideshow .slide');
        for (var i = 0; i < children.length; i++) {
          other.push(children[i]);
        }
        function recurse (x) {
          setTimeout(function () {
            child = x.shift();
            $(child).removeClass('active');
            $(child).addClass('hidden');
            $(x[0]).addClass('active');
            $(x[0]).removeClass('hidden');
            x.push(child);
            recurse(x);
          }, 5000);
        }
        recurse(other);
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.source, status, error.toString());
      }.bind(this)
    });
  },
  generateGalleryItem: function (gallery) {
    var i
      , image
      , path
      , active
      , this_gallery
    ;
    for (i = 0; i < gallery.galleriesImages.length; i++) {
      image = gallery.galleriesImages[i];
      if (image.cover_image) {
        image.gallery_path = gallery.url_path;
        path = '/images/' + image.name;
        this_gallery = image.url_path;
        active = arguments[1] === 0 ? 'active' : 'hidden';
        return React.createElement(HomeGalleryItem, {path: path, gallery: this_gallery, 
          active: active})
      }
    }
  },
  generateGalleryNav: function (galleries) {

  },
  render: function (images) {
    var self = this;
    if (this.state.data) {
      images = images || this.state.data.map(this.generateGalleryItem);
      return (
        React.createElement("div", {className: "content-container pure-g"}, 
          React.createElement("div", {className: "pure-u-1 pure-u-md-1-1"}, 
            React.createElement("div", {className: "header"}
            )
          ), 
          React.createElement("div", {className: "pure-u-1-1 pure-u-lg-1-1"}, 
            React.createElement("div", {id: "slideshow"}, 
              images
            )
          )
        )
      );
    }
    return React.createElement("div", null)
  }
});
