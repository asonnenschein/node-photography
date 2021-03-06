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
          <form method="post" action="/galleries/"
            encType="multipart/form-data"
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
      <div className="manage-thumb pure-u-1-2 pure-u-lg-1-2">
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
    var editPath = "/galleries/" + this.props.data.url_path + "/";
    return (
      <div className="content-container">
        <div className="create-gallery-container">
          <form method="post" action={editPath}
            className="pure-form pure-form-aligned">
            <fieldset>
              <legend>Edit Existing Gallery</legend>
              <div className="pure-control-group">
                <label htmlFor="title">Edit Gallery Title</label>
                <input name="title" type="text"
                  placeholder={this.props.data.title}
                  defaultValue={this.props.data.title} />
              </div>
              <div className="pure-control-group">
                <label htmlFor="description">Edit Short Description</label>
                <textarea name="description" type="text"
                  placeholder={this.props.data.description}
                  defaultValue={this.props.data.description}>
                </textarea>
              </div>
              <button type="submit"
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

var GenerateSelectOptions = React.createClass({
  render: function () {
    if (this.props.selected === this.props.number) {
      return (
        <option selected="selected">{this.props.number}</option>
      );
    }
    else {
      return (
        <option>{this.props.number}</option>
      );
    }
  }
});

var EditImagesThumb = React.createClass({
  generateSelectOptions: function (number) {
    return (
      <GenerateSelectOptions selected={this.props.order} number={number} />
    );
  },
  render: function () {
    var numbers = []
      , selectOptions
    ;
    for (var i = 0; i < this.props.length; i++) {
      numbers.push(i);
    }
    numbers.shift()
    selectOptions = numbers.map(this.generateSelectOptions);
    return (
      <div className="content-container">
        <div className="edit-image-container">
          <div className="pure-u-1-1 pure-u-lg-1-1">
            <img className="pure-img center-image"
              src={this.props.thumbpath} />
            <form method="post" action={this.props.action}
            className="pure-form pure-form-aligned">
              <fieldset>
                <div className="pure-control-group">
                  <label htmlFor="img_title">Image Title</label>
                  <input name="img_title" type="text"
                  placeholder={this.props.title} />
                </div>
                <div className="pure-control-group">
                  <label htmlFor="caption">Caption</label>
                  <textarea name="caption" type="text"
                    placeholder={this.props.caption}>
                  </textarea>
                </div>
                <div className="pure-control-group">
                  <label htmlFor="order_number">Order</label>
                  <select name="order_number">
                    {selectOptions}
                  </select>
                </div>
                <button type="submit"
                  className="pure-button pure-button-primary">
                  Submit
                </button>
              </fieldset>
            </form>
            <div className="delete-image-container">
              <form method="post" action={this.props.action}
                className="pure-form pure-form-aligned">
                <fieldset>
                  <input type="hidden" name="_method" value="DELETE" />
                  <button type="submit"
                    className="button-error pure-button">
                    Delete
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var ManageEditImages = React.createClass({
  generateEditImageThumbs: function (gallery) {
    return <EditImagesThumb
      thumbpath={'/images/' + gallery.name}
      action={'/galleries/' + gallery.gallery_path + '/images/'
        + gallery.url_path + '/'}
      title={gallery.img_title}
      order={gallery.order_number}
      length={gallery.gallery_length}
      caption={gallery.caption} />
  },
  render: function () {
    var images = this.props.data.galleriesImages
      , self = this
    ;

    images.map(function (image) {
      image.gallery_path = self.props.data.url_path;
      image.gallery_length = self.props.data.galleriesImages.length + 1;
    });

    images = images.map(this.generateEditImageThumbs);

    return (
      <div className="content-container pure-g">
        <div className="pure-u-1-1 pure-u-lg-1-1">
          {images}
        </div>
      </div>
    );
  }
});

var ManageDeleteGallery = React.createClass({
  render: function () {
    var editPath = "/galleries/" + this.props.data.url_path + "/";
    return (
      <div className="content-container">
        <div className="delete-gallery-container">
          <form method="post" action={editPath}
            className="pure-form pure-form-aligned">
            <fieldset>
              <input type="hidden" name="_method" value="DELETE" />
              <legend>Delete Gallery</legend>
              <button type="submit"
                className="button-error pure-button">
                Delete
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
});

var ManageAddImages = React.createClass({
  render: function () {

    var action = '/galleries/' + this.props.data.url_path + '/images/';

    return (
      <div className="content-container">
        <div className="add-image-container">
          <form method="post" action={action}
            encType="multipart/form-data"
            className="pure-form pure-form-aligned">
            <fieldset>
              <legend>Add New Photo</legend>
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

var ManageGalleryItems = React.createClass({
  loadImagesFromServer: function () {
    $.ajax({
      url: '/galleries/' + this.props.gallery + '/?mime=json',
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
      {"text": "Delete Gallery", "url": "#/" + route + "&action=deletegallery"},
      {"text": "Edit Images", "url": "#/" + route + "&action=editimages"},
      {"text": "Add Images", "url": "#/" + route + "&action=addimages"},
    ].map(this.generateLink);

    switch (action) {
      case 'editgallery':
        EditChild = ManageEditGallery;
        break;
      case 'deletegallery':
        EditChild = ManageDeleteGallery;
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
      <div className="content">
        <div className="pure-menu pure-menu-horizontal">
          <ul className="pure-menu-list">
            {items}
          </ul>
        </div>
        <EditChild data={this.state.data} />
      </div>
    );
  }
});

var ManageGallery = React.createClass({
  loadImagesFromServer: function () {
    $.ajax({
      url: "/galleries/" + "?mime=json",
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
    if (gallery.hasOwnProperty('galleriesImages')) {
      return <ManageGalleryThumb
        filepath={'#/manage/?gallery=' + gallery.url_path}
        thumbpath={'/thumbnails/' + gallery.galleriesImages[0].name}
        title={gallery.title} />
    }
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

var EditAbout = React.createClass({
  render: function () {
    return (
      <div className="content-container">
        <div className="create-gallery-container">
          <form method="post" action="/about/"
            className="pure-form pure-form-aligned">
            <fieldset>
              <legend>Edit About Page</legend>
              <div className="pure-control-group">
                <textarea name="about" type="text">
                </textarea>
              </div>
              <button type="submit"
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

var EditContact = React.createClass({
  render: function () {
    return (
      <div className="content-container">
        <div className="create-gallery-container">
          <form method="post" action="/contact/"
            className="pure-form pure-form-aligned">
            <fieldset>
              <legend>Edit Contact Page</legend>
              <div className="pure-control-group">
                <textarea name="contact" type="text">
                </textarea>
              </div>
              <button type="submit"
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
      {"text": "Edit About", "url": "#/about"},
      {"text": "Edit Contact", "url": "#/contact"},
      {"text": "Home", "url": "/"},
    ].map(this.generateItem);

    route = window.location.hash.split('#/').filter(Boolean)[0];

    if (route && route.indexOf('=') > -1) {
      gallery = route.split('=').filter(Boolean)[1];
      route = 'queryparams';
    }
    else if (['about', 'contact'].indexOf(route) > -1) {
      gallery = route;
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
      case 'about':
        AdminChild = EditAbout;
        break;
      case 'contact':
        AdminChild = EditContact;
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
