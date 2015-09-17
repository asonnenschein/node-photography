var AdminLogin = React.createClass({displayName: "AdminLogin",
  render: function () {
    return (
      React.createElement("div", {className: "content-container"}, 
        React.createElement("div", {className: "auth-form-container"}, 
          React.createElement("form", {method: "post", action: "/admin/login/", 
            className: "pure-form pure-form-stacked"}, 
            React.createElement("fieldset", null, 
              React.createElement("legend", null, "Admin Login"), 
              React.createElement("label", {htmlFor: "username"}, "Username"), 
              React.createElement("input", {name: "username", type: "text", placeholder: "Username"}), 
              React.createElement("label", {htmlFor: "email"}, "Email"), 
              React.createElement("input", {name: "email", type: "email", placeholder: "Email"}), 
              React.createElement("label", {htmlFor: "password"}, "Password"), 
              React.createElement("input", {name: "password", type: "password", placeholder: "Password"}), 
              React.createElement("button", {type: "submit", className: "pure-button pure-button-primary"}, 
                "Sign in"
              )
            )
          )
        )
      )
    );
  }
});

var AdminRegister = React.createClass({displayName: "AdminRegister",
  render: function () {
    return (
      React.createElement("div", {className: "content-container"}, 
        React.createElement("div", {className: "auth-form-container"}, 
          React.createElement("form", {method: "post", action: "/admin/register/", 
            className: "pure-form pure-form-stacked"}, 
            React.createElement("fieldset", null, 
              React.createElement("legend", null, "Admin Register"), 
              React.createElement("label", {htmlFor: "username"}, "Username"), 
              React.createElement("input", {name: "username", type: "text", placeholder: "Username"}), 
              React.createElement("label", {htmlFor: "email"}, "Email"), 
              React.createElement("input", {name: "email", type: "email", placeholder: "Email"}), 
              React.createElement("label", {htmlFor: "password"}, "Password"), 
              React.createElement("input", {name: "password", type: "password", placeholder: "Password"}), 
              React.createElement("button", {type: "submit", className: "pure-button pure-button-primary"}, 
                "Sign in"
              )
            )
          )
        )
      )
    );
  }
});

var CreateGallery = React.createClass({displayName: "CreateGallery",
  render: function () {
    return (
      React.createElement("div", {className: "content-container"}, 
        React.createElement("div", {className: "create-gallery-container"}, 
          React.createElement("form", {method: "post", action: "/galleries/", encType: "multipart/form-data", 
            className: "pure-form pure-form-aligned"}, 
            React.createElement("fieldset", null, 
              React.createElement("legend", null, "Create New Gallery"), 
              React.createElement("div", {className: "pure-control-group"}, 
                React.createElement("label", {htmlFor: "title"}, "Gallery Title"), 
                React.createElement("input", {name: "title", type: "text", placeholder: "Gallery Title"})
              ), 
              React.createElement("div", {className: "pure-control-group"}, 
                React.createElement("label", {htmlFor: "description"}, "Short Description"), 
                React.createElement("textarea", {name: "description", type: "text", 
                  placeholder: "Short Description"}
                )
              ), 

              React.createElement("legend", null, "Upload Photo"), 
              React.createElement("div", {className: "pure-control-group"}, 
                React.createElement("label", {htmlFor: "img_title"}, "Image Title"), 
                React.createElement("input", {name: "img_title", type: "text", 
                  placeholder: "Image Title"})
              ), 
              React.createElement("div", {className: "pure-control-group"}, 
                React.createElement("label", {htmlFor: "caption"}, "Image Caption"), 
                React.createElement("textarea", {name: "caption", type: "text", 
                  placeholder: "Image Caption"}
                )
              ), 

              React.createElement("input", {type: "file", name: "file", 
                accept: "application/x-zip-compressed,image/*"}), 

              React.createElement("button", {type: "submit", name: "submit", 
                className: "pure-button pure-button-primary"}, 
                "Submit"
              )
            )
          )
        )
      )
    );
  }
});

var ManageGalleryItem = React.createClass({displayName: "ManageGalleryItem",
  render: function () {
    return (
      React.createElement("div", {className: "pure-u-1-3 pure-u-lg-1-5"}, 
        React.createElement("a", {href: this.props.filepath}, 
          React.createElement("img", {className: "pure-img", src: this.props.thumbpath})
        )
      )
    );
  }
});

var ManageGallery = React.createClass({displayName: "ManageGallery",
  loadImagesFromServer: function () {
    $.ajax({
      url: '/galleries/',
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
  generateManageGalleryItem: function (gallery) {
    return React.createElement(ManageGalleryItem, {
      filepath: '/galleries/' + gallery.url_path, 
      thumbpath: '/thumbnails/' + gallery.galleriesImages[0].name})
  },
  render: function () {
    var images = this.state.data.map(this.generateManageGalleryItem);
    return (
      React.createElement("div", {className: "content-container pure-g"}, 
        React.createElement("div", {className: "pure-u-1-1 pure-u-lg-1-1"}, 
          images
        )
      )
    );
  }
});

var AdminNull = React.createClass({displayName: "AdminNull",
  render: function () {
    return null;
  }
});

var AdminUser = React.createClass({displayName: "AdminUser",
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
    return React.createElement(NavListItem, {text: item.text, url: item.url})
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
      React.createElement("div", {id: "layout", ref: "layout"}, 
        React.createElement("a", {href: "#menu", id: "menuLink", ref: "menuLink", className: "menu-link"}, 
          React.createElement("span", null)
        ), 
        React.createElement("div", {id: "menu", ref: "menu"}, 
          React.createElement("div", {className: "pure-menu"}, 
            React.createElement("a", {href: "#", className: "pure-menu-heading"}, "Tools")
          ), 
          React.createElement("ul", {className: "pure-menu-list"}, 
            items
          )
        ), 
        React.createElement("div", {id: "main", ref: "main"}, 
          React.createElement("div", {className: "header"}, 
            React.createElement("h1", null, "Welcome Back, ", user, "!")
          ), 
          React.createElement("div", {className: "content"}, 
            React.createElement(AdminChild, null)
          )
        )
      )
    );
  }
});