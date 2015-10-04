var HomeGalleryItem = React.createClass({
  render: function () {
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
