var SlideShowTimeout;

var GalleryItem = React.createClass({
  render: function () {
    var slideClass = "slide " + this.props.active;
    return (
      <div className={slideClass} ref="slideImage">
        <div className="pure-u-1-1 pure-u-lg-1-1" ref="image">
          <img className="pure-img" src={this.props.path} />
          <h4>{this.props.title}</h4>
        </div>
      </div>
    );
  }
});

var GalleryNav = React.createClass({
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
      <li className="pure-menu-item">
        <a href="javascript:void(0);" className={imageClass}
          onClick={this.handleClick}>
          <img src={this.props.path}></img>
        </a>
      </li>
    );
  }
});

var Gallery = React.createClass({
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
        var other = [];
        var children = $(this.getDOMNode()).find('#slideshow .slide');
        if (children.length > 1) {
          for (var i = 0; i < children.length; i++) {
            other.push(children[i]);
          }
          function recurse (x) {
            SlideShowTimeout = setTimeout(function () {
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
    return <GalleryItem path={path} active={active} title={title}/>;
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
    return <GalleryNav path={path} position={position} name={name}/>;
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
        <div className="content-container pure-g">
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