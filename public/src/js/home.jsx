var HomeGalleryItem = React.createClass({
  render: function () {
    return (
      <div className="pure-u-1-1 pure-u-lg-1-1">
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
        return <HomeGalleryItem path={path} gallery={this_gallery} />
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
    return <div></div>
  }
});
