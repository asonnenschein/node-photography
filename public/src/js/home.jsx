var HomeGalleryItem = React.createClass({
  render: function () {
    var slideClass = "slide " + this.props.active;
    return (
      <div className={slideClass} ref="slideImage">
        <div className="pure-u-1-1 pure-u-lg-1-1" ref="image">
          <a href={this.props.gallery}>
            <img className="pure-img" src={this.props.path} />
          </a>
        </div>
      </div>
    );
  }
});

var HomeGalleryNav = React.createClass({
  render: function () {
    var imageClass = "pure-menu-link " + this.props.position;
    return (
      <li className="pure-menu-item">
        <a href={this.props.gallery} className={imageClass}>
          <img src={this.props.path}></img>
        </a>
      </li>
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
        return <HomeGalleryItem path={path} gallery={this_gallery}
          active={active} />
      }
    }
  },
  generateGalleryNav: function (gallery) {
    var i
      , image
      , path
      , position
      , this_gallery
    ;
    for (i = 0; i < gallery.galleriesImages.length; i++) {
      image = gallery.galleriesImages[i];
      if (image.cover_image) {
        image.gallery_path = gallery.url_path;
        path = '/thumbnails/' + image.name;
        this_gallery = image.url_path;
        position = arguments[1] === 0 || arguments[1] === arguments[2].length
          ? 'position-end'
          : 'position-middle'
        ;
        return <HomeGalleryNav path={path} gallery={this_gallery}
          position={position}/>
      }
    }
  },
  render: function (images) {
    var self = this, images, navs;
    if (this.state.data) {
      images = images || this.state.data.map(this.generateGalleryItem);
      navs = this.state.data.map(this.generateGalleryNav);
      return (
        <div className="content-container pure-g">
          <div className="pure-u-1 pure-u-md-1-1">
            <div className="header">
            </div>
          </div>
          <div className="pure-u-1-1 pure-u-lg-1-1">
            <div id="slideshow">
              {images}
            </div>
          </div>
          <div className="pure-menu pure-menu-horizontal pure-menu-scrollable">
            <ul className="pure-menu-list">
              {navs}
            </ul>
          </div>
        </div>
      );
    }
    return <div></div>
  }
});
