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
              <div className="pure-control-group">
                <label htmlFor="img_title">Image Title</label>
                <input name="img_title" type="text"
                  placeholder="Image Title" />
              </div>

                <input type="file" name="file" accept="image/*" />
              </div>

              <button type="submit" className="pure-button pure-button-primary">
                Submit
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
});

var ManageGallery = React.createClass({
  render: function () {
    return (
      <div></div>
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
  componentWillUnmount: function() {

  },
  generateItem: function (item) {
    return <NavListItem text={item.text} url={item.url} />
  },
  render: function () {
    var items
      , route
      , user
      , AdminChild
    ;

    items = [
      {"text": "Create Gallery", "url": "#/create"},
      {"text": "Manage Gallery", "url": "#/manage"},
      {"text": "Home", "url": "/"},
    ].map(this.generateItem);

    route = window.location.hash.split('#/').filter(Boolean)[0];

    switch (route) {
      case 'create':
        AdminChild = CreateGallery;
        break;
      case 'manage':
        AdminChild = ManageGallery;
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
            <AdminChild />
          </div>
        </div>
      </div>
    );
  }
});