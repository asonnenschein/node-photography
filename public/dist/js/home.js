var HomeGalleryItem = React.createClass({displayName: "HomeGalleryItem",
  render: function () {
    return (
      React.createElement("div", {className: "pure-u-1-3 pure-u-lg-1-5"}, 
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
  loadImagesFromServer: function () {
    $.ajax({
      url: this.props.source,
      type: 'GET',
      success: function (data) {
        console.log(data);
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.source, status, error.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    this.props.source = "/galleries/";
    return {data: []};
  },
  componentDidMount: function () {
    this.loadImagesFromServer();
  },
  generateGalleryItem: function (gallery) {
    var i
      , image
      , path
      , gallery
      , slides
    ;
    slides = [];
    for (i = 0; i < gallery.galleriesImages.length; i++) {
      image = gallery.galleriesImages[i];
      if (image.cover_image) {
        image.gallery_path = gallery.url_path;
        slides.push(image);
/*
        path = '/images/' + image.name;
        gallery = gallery.url_path;
        return <HomeGalleryItem path={path} gallery={gallery} />
*/
      }
    }
    function slippinAndSlidin () {

    }
  },
  generateGalleryNav: function (galleries) {

  },
  render: function () {
    var images = this.state.data.map(this.generateGalleryItem)
      , galleryNav = this.generateGalleryNav(this.state.data)
    ;
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
});
