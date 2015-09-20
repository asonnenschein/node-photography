var AdminLogin = React.createClass({
  render: function () {
    return (
      <div className="content-container">
        <div className="auth-form-container">
          <form method="post" action="/admin/login/"
            className="pure-form pure-form-stacked">
            <fieldset>
              <legend>Admin Login</legend>
              <label htmlFor="username">Username</label>
              <input name="username" type="text" placeholder="Username" />
              <label htmlFor="email">Email</label>
              <input name="email" type="email" placeholder="Email" />
              <label htmlFor="password">Password</label>
              <input name="password" type="password" placeholder="Password" />
              <button type="submit" className="pure-button pure-button-primary">
                Sign in
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
});

var AdminRegister = React.createClass({
  render: function () {
    return (
      <div className="content-container">
        <div className="auth-form-container">
          <form method="post" action="/admin/register/"
            className="pure-form pure-form-stacked">
            <fieldset>
              <legend>Admin Register</legend>
              <label htmlFor="username">Username</label>
              <input name="username" type="text" placeholder="Username" />
              <label htmlFor="email">Email</label>
              <input name="email" type="email" placeholder="Email" />
              <label htmlFor="password">Password</label>
              <input name="password" type="password" placeholder="Password" />
              <button type="submit" className="pure-button pure-button-primary">
                Sign in
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
});

var CreateGallery = React.createClass({
  render: function () {
    return (
      <div className="content-container">
        <div className="create-gallery-container">
          <form method="post" action="/galleries/" encType="multipart/form-data"
            className="pure-form pure-form-aligned">
            <fieldset>
              <legend>Create New Gallery</legend>
              <div className="pure-control-group">
                <label htmlFor="title">Gallery Title</label>
                <input name="title" type="text" placeholder="Gallery Title" />
              </div>
              <div className="pure-control-group">
                <label htmlFor="description">Short Description</label>
                <textarea name="description" type="text"
                  placeholder="Short Description">
                </textarea>
              </div>

              <legend>Upload Photo</legend>
              <div className="pure-control-group">
                <label htmlFor="img_title">Image Title</label>
                <input name="img_title" type="text"
                  placeholder="Image Title" />
              </div>
              <div className="pure-control-group">
                <label htmlFor="caption">Image Caption</label>
                <textarea name="caption" type="text"
                  placeholder="Image Caption">
                </textarea>
              </div>

              <input type="file" name="file"
                accept="application/x-zip-compressed,image/*"/>

              <button type="submit" name="submit"
                className="pure-button pure-button-primary">
                Submit
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
});

var ManageGalleryThumb = React.createClass({
  render: function () {
    return (
      <div className="pure-u-1-3 pure-u-lg-1-5">
        <a href={this.props.filepath}>
          <img className="pure-img" src={this.props.thumbpath} />
          <span>{this.props.title}</span>
        </a>
      </div>
    );
  }
});

var ManageEditGallery = React.createClass({
  render: function () {
    console.log(this.props.data);
    return (
      <div></div>
    );
  }
});

var ManageEditImages = React.createClass({
  render: function () {
    return (
      <div></div>
    );
  }
});

var ManageAddImages = React.createClass({
  render: function () {
    return (
      <div></div>
    );
  }
});

var ManageGalleryItems = React.createClass({
  loadImagesFromServer: function () {
    $.ajax({
      url: '/galleries/' + this.props.gallery + '/',
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
  getInitialState: function () {
    return {data: []};
  },
  componentDidMount: function () {
    this.loadImagesFromServer();
  },
  generateLink: function (item) {
    return <NavListItem text={item.text} url={item.url} />
  },
  render: function () {
    var EditChild
      , route
      , items
    ;

    route = window.location.hash.split('#/').filter(Boolean)[0];
    action = route.split('action=').filter(Boolean)[1];

    if (action) {
      route = route.split('&action').filter(Boolean)[0];
    }

    items = [
      {"text": "Edit Gallery", "url": "#/" + route + "&action=editgallery"},
      {"text": "Edit Images", "url": "#/" + route + "&action=editimages"},
      {"text": "Add Images", "url": "#/" + route + "&action=addimages"},
    ].map(this.generateLink);

    switch (action) {
      case 'editgallery':
        EditChild = ManageEditGallery;
        break;
      case 'editimages':
        EditChild = ManageEditImages;
        break;
      case 'addimages':
        EditChild = ManageAddImages;
        break;
      default:
        EditChild = ManageEditGallery;
        break;
    }

    return (
      <div className="pure-menu pure-menu-horizontal">
        <ul className="pure-menu-list">
          {items}
        </ul>
        <div className="content">
          <EditChild data={this.state.data} />
        </div>
      </div>
    );
  }
});

var ManageGallery = React.createClass({
  loadImagesFromServer: function () {
    $.ajax({
      url: '/galleries/',
      type: 'GET',
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.source, status, error.toString());
      }.bind(this)
    });
  },
  getInitialState: function () {
    return {data: []};
  },
  componentDidMount: function () {
    this.loadImagesFromServer();
  },
  generateManageGalleryThumb: function (gallery) {
    return <ManageGalleryThumb
      filepath={'#/manage/?gallery=' + gallery.url_path}
      thumbpath={'/thumbnails/' + gallery.galleriesImages[0].name}
      title={gallery.title} />
  },
  render: function () {
    var images = this.state.data.map(this.generateManageGalleryThumb);
    return (
      <div className="content-container pure-g">
        <div className="pure-u-1-1 pure-u-lg-1-1">
          {images}
        </div>
      </div>
    );
  }
});

var AdminNull = React.createClass({
  render: function () {
    return null;
  }
});

var AdminUser = React.createClass({
  getInitialState: function () {
    return {};
  },
  toggleClass: function (element, className) {
    var classes = element.className.split(/\s+/)
      , length = classes.length
      , i = 0
    ;

    for (i; i < length; i++) {
      if (classes[i] === className) {
        classes.splice(i, 1);
        break;
      }
    }
    if (length === classes.length) {
      classes.push(className);
    }
    element.className = classes.join(' ');
  },
  componentDidMount: function() {
    var self = this
      , layout = React.findDOMNode(this.refs.layout)
      , menu = React.findDOMNode(this.refs.menu)
      , menuLink = React.findDOMNode(this.refs.menuLink)
    ;

    menuLink.addEventListener('click', function (e) {
      e.preventDefault();
      self.toggleClass(layout, 'active');
      self.toggleClass(menu, 'active');
      self.toggleClass(menuLink, 'active');
    });

  },
  generateItem: function (item) {
    return <NavListItem text={item.text} url={item.url} />
  },
  render: function () {
    var items
      , route
      , user
      , gallery
      , AdminChild
    ;

    items = [
      {"text": "Create Gallery", "url": "#/create"},
      {"text": "Manage Gallery", "url": "#/manage"},
      {"text": "Home", "url": "/"},
    ].map(this.generateItem);

    route = window.location.hash.split('#/').filter(Boolean)[0];

    if (route && route.indexOf('=') > -1) {
      gallery = route.split('=').filter(Boolean)[1];
      route = 'queryparams';
    }
    else {
      gallery = null;
    }

    switch (route) {
      case 'create':
        AdminChild = CreateGallery;
        break;
      case 'manage':
        AdminChild = ManageGallery;
        break;
      case 'queryparams':
        AdminChild = ManageGalleryItems;
        break;
      default:
        AdminChild = AdminNull;
    }

    user = window.location.pathname.split('/').filter(Boolean)[1];
    user = user.charAt(0).toUpperCase() + user.slice(1)

    return (
      <div id="layout" ref="layout">
        <a href="#menu" id="menuLink" ref="menuLink" className="menu-link">
          <span></span>
        </a>
        <div id="menu" ref="menu">
          <div className="pure-menu">
            <a href="#" className="pure-menu-heading">Tools</a>
          </div>
          <ul className="pure-menu-list">
            {items}
          </ul>
        </div>
        <div id="main" ref="main">
          <div className="header">
            <h1>Welcome Back, {user}!</h1>
          </div>
          <div className="content">
            <AdminChild gallery={gallery} />
          </div>
        </div>
      </div>
    );
  }
});