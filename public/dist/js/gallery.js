var SlideShowTimeout;

var GalleryItem = React.createClass({displayName: "GalleryItem",
  render: function () {
    var slideClass = "slide " + this.props.active;
    return (
      React.createElement("div", {className: slideClass, ref: "slideImage"}, 
        React.createElement("div", {className: "pure-u-1-1 pure-u-lg-1-1", ref: "image"}, 
          React.createElement("img", {className: "pure-img", src: this.props.path}), 
          React.createElement("h4", null, this.props.title)
        )
      )
    );
  }
});

var GalleryNav = React.createClass({displayName: "GalleryNav",
  handleClick: function (event) {
    var slides, i, image, source;
    slides = $('#slideshow .slide');
    for (i = 0; i < slides.length; i++) {
      image = $(slides[i]);
      source = image.find('img').attr('src').split('/images/')[1];
      if (image.hasClass('active')) {
        image.removeClass('active').addClass('hidden');
      }
      if (source === this.props.name) {
        clearTimeout(SlideShowTimeout);
        if (image.hasClass('hidden')) {
          image.removeClass('hidden').addClass('active');
        }
      }
    }
  },
  render: function () {
    var imageClass = "pure-menu-link " + this.props.position;
    return (
      React.createElement("li", {className: "pure-menu-item"}, 
        React.createElement("a", {href: "javascript:void(0);", className: imageClass, 
          onClick: this.handleClick}, 
          React.createElement("img", {src: this.props.path})
        )
      )
    );
  }
});

var Gallery = React.createClass({displayName: "Gallery",
  getInitialState: function() {
    this.props.source = location.pathname + "?mime=json";
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
  generateGalleryItem: function (image) {
    var path
      , active
      , title
    ;
    path = '/images/' + image.name;
    active = arguments[1] === 0 ? 'active' : 'hidden';
    title = image.img_title;
    return React.createElement(GalleryItem, {path: path, active: active, title: title});
  },
  generateGalleryNav: function (image) {
    var image
      , path
      , name
      , position
    ;
    path = '/thumbnails/' + image.name;
    name = image.name;
    position = arguments[1] === 0 || arguments[1] === arguments[2].length
      ? 'position-end'
      : 'position-middle'
    ;
    return React.createElement(GalleryNav, {path: path, position: position, name: name});
  },
  render: function () {
    var self = this, images, navs, data;
    if (this.state.data) {
      if (this.state.data.hasOwnProperty('galleriesImages')) {
        data = this.state.data.galleriesImages;
      }
      else {
        data = this.state.data;
      }
      images = data.map(this.generateGalleryItem);
      navs = data.map(this.generateGalleryNav);
      return (
        React.createElement("div", {className: "content-container pure-g"}, 
          React.createElement("div", {className: "pure-u-1-1 pure-u-lg-1-1"}, 
            React.createElement("div", {id: "slideshow"}, 
              images
            )
          ), 
          React.createElement("div", {className: "pure-menu pure-menu-horizontal pure-menu-scrollable"}, 
            React.createElement("ul", {className: "pure-menu-list"}, 
              navs
            )
          )
        )
      );
    }
    return React.createElement("div", null)
  }
});
