var HomeGalleryItem = React.createClass({displayName: "HomeGalleryItem",
  render: function () {
    return (
      React.createElement("div", {className: "pure-u-1-1 pure-u-lg-1-1"}, 
        React.createElement("a", {href: this.props.gallery}, 
          React.createElement("img", {className: "pure-img", src: this.props.path})
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
        if (this.isMounted()) {
          this.setState({data: data});
        }
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
      , this_gallery
    ;
    for (i = 0; i < gallery.galleriesImages.length; i++) {
      image = gallery.galleriesImages[i];
      if (image.cover_image) {
        image.gallery_path = gallery.url_path;
        path = '/images/' + image.name;
        this_gallery = image.url_path;
        return React.createElement(HomeGalleryItem, {path: path, gallery: this_gallery})
      }
    }
  },
  generateGalleryNav: function (galleries) {

  },
  render: function () {
    var images, galleryNav;
    if (this.state.data) {
      images = this.state.data.map(this.generateGalleryItem);
      galleryNav = this.generateGalleryNav(this.state.data);
      return (
        React.createElement("div", {className: "content-container pure-g"}, 
          React.createElement("div", {className: "pure-u-1 pure-u-md-1-1"}, 
            React.createElement("div", {className: "header"}
            )
          ), 
          React.createElement("div", {className: "pure-u-1-1 pure-u-lg-1-1"}, 
            images
          )
        )
      );
    }
    return React.createElement("div", null)
  }
});
