var HomeGalleryItem = React.createClass({
  render: function () {
    console.log(this.props.path, this.props.gallery);
    return (
      <div className="pure-u-1-3 pure-u-lg-1-5">
        <a href={this.props.gallery}>
          <img className="pure-img" src={this.props.path} />
        </a>
      </div>
    );
  }
});

var HomeGalleryNav = React.createClass({
  render: function () {
    return (
      <div></div>
    );
  }
});

var Home = React.createClass({
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
  generateGalleryItem: function (galleries) {
    var i
      , image
      , path
      , gallery
    ;

    Promise.all(galleries.map(function (gallery) {
      for (i = 0; i < gallery.galleriesImages.length; i++) {
        image = gallery.galleriesImages[i];
        if (image.cover_image) {
          image.gallery_path = gallery.url_path;
          return image;
        }
      }
    })).then(function (slides) {
      console.log(slides);
    }).catch(function (error) {
      console.log(error);
    });

    function slippinAndSlidin (image) {
      path = '/images/' + image.name;
      gallery = image.url_path;
      return <HomeGalleryItem path={path} gallery={gallery} />
    }

  },
  generateGalleryNav: function (galleries) {

  },
  render: function () {
    var images, galleryNav;
    if (this.state.data) {
      images = this.generateGalleryItem(this.state.data);
      galleryNav = this.generateGalleryNav(this.state.data);
    }
    return (
      <div className="content-container pure-g">
        <div className="pure-u-1 pure-u-md-1-1">
          <div className="header">
          </div>
        </div>
        <div className="pure-u-1-1 pure-u-lg-1-1">
          {images}
        </div>
      </div>
    );
  }
});
