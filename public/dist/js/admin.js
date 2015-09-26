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
          React.createElement("form", {method: "post", action: "/galleries/", 
            encType: "multipart/form-data", 
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

var ManageGalleryThumb = React.createClass({displayName: "ManageGalleryThumb",
  render: function () {
    return (
      React.createElement("div", {className: "pure-u-1-3 pure-u-lg-1-5"}, 
        React.createElement("a", {href: this.props.filepath}, 
          React.createElement("img", {className: "pure-img", src: this.props.thumbpath}), 
          React.createElement("span", null, this.props.title)
        )
      )
    );
  }
});

var ManageEditGallery = React.createClass({displayName: "ManageEditGallery",
  render: function () {
    var editPath = "/galleries/" + this.props.data.url_path + "/";
    return (
      React.createElement("div", {className: "content-container"}, 
        React.createElement("div", {className: "create-gallery-container"}, 
          React.createElement("form", {method: "post", action: editPath, 
            className: "pure-form pure-form-aligned"}, 
            React.createElement("fieldset", null, 
              React.createElement("legend", null, "Edit Existing Gallery"), 
              React.createElement("div", {className: "pure-control-group"}, 
                React.createElement("label", {htmlFor: "title"}, "Edit Gallery Title"), 
                React.createElement("input", {name: "title", type: "text", 
                  placeholder: this.props.data.title, 
                  defaultValue: this.props.data.title})
              ), 
              React.createElement("div", {className: "pure-control-group"}, 
                React.createElement("label", {htmlFor: "description"}, "Edit Short Description"), 
                React.createElement("textarea", {name: "description", type: "text", 
                  placeholder: this.props.data.description, 
                  defaultValue: this.props.data.description}
                )
              ), 
              React.createElement("button", {type: "submit", 
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

var GenerateSelectOptions = React.createClass({displayName: "GenerateSelectOptions",
  render: function () {
    if (this.props.selected === this.props.number) {
      return (
        React.createElement("option", {selected: "selected"}, this.props.number)
      );
    }
    else {
      return (
        React.createElement("option", null, this.props.number)
      );
    }
  }
});

var EditImagesThumb = React.createClass({displayName: "EditImagesThumb",
  generateSelectOptions: function (number) {
    return (
      React.createElement(GenerateSelectOptions, {selected: this.props.order, number: number})
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
      React.createElement("div", {className: "content-container"}, 
        React.createElement("div", {className: "pure-u-1-1 pure-u-lg-1-1"}, 
          React.createElement("img", {className: "pure-img center-image", src: this.props.thumbpath}), 
          React.createElement("form", {method: "post", action: this.props.action, 
          className: "pure-form pure-form-aligned"}, 
            React.createElement("fieldset", null, 
              React.createElement("div", {className: "pure-control-group"}, 
                React.createElement("label", {htmlFor: "img_title"}, "Image Title"), 
                React.createElement("input", {name: "img_title", type: "text", 
                placeholder: this.props.title})
              ), 
              React.createElement("div", {className: "pure-control-group"}, 
                React.createElement("label", {htmlFor: "caption"}, "Caption"), 
                React.createElement("textarea", {name: "caption", type: "text", 
                  placeholder: this.props.caption}
                )
              ), 
              React.createElement("div", {className: "pure-control-group"}, 
                React.createElement("label", {htmlFor: "order_number"}, "Order"), 
                React.createElement("select", {name: "order_number"}, 
                  selectOptions
                )
              ), 
              React.createElement("button", {type: "submit", name: "submit", 
                className: "pure-button pure-button-primary"}, 
                "Submit"
              )
            )
          ), 
          React.createElement("div", {className: "delete-image-container"}, 
            React.createElement("form", {method: "post", action: this.props.action, 
              className: "pure-form pure-form-aligned"}, 
              React.createElement("fieldset", null, 
                React.createElement("input", {type: "hidden", name: "_method", value: "DELETE"}), 
                React.createElement("button", {type: "submit", 
                  className: "button-error pure-button"}, 
                  "Delete"
                )
              )
            )
          )
        )
      )
    );
  }
});

var ManageEditImages = React.createClass({displayName: "ManageEditImages",
  generateEditImageThumbs: function (gallery) {
    return React.createElement(EditImagesThumb, {
      thumbpath: '/images/' + gallery.name, 
      action: '/galleries/' + gallery.gallery_path + '/images/'
        + gallery.url_path + '/', 
      title: gallery.img_title, 
      order: gallery.order_number, 
      length: gallery.gallery_length, 
      caption: gallery.caption})
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
      React.createElement("div", {className: "content-container pure-g"}, 
        React.createElement("div", {className: "pure-u-1-1 pure-u-lg-1-1"}, 
          images
        )
      )
    );
  }
});

var ManageDeleteGallery = React.createClass({displayName: "ManageDeleteGallery",
  render: function () {
    var editPath = "/galleries/" + this.props.data.url_path + "/";
    return (
      React.createElement("div", {className: "content-container"}, 
        React.createElement("div", {className: "delete-gallery-container"}, 
          React.createElement("form", {method: "post", action: editPath, 
            className: "pure-form pure-form-aligned"}, 
            React.createElement("fieldset", null, 
              React.createElement("input", {type: "hidden", name: "_method", value: "DELETE"}), 
              React.createElement("legend", null, "Delete Gallery"), 
              React.createElement("button", {type: "submit", 
                className: "button-error pure-button"}, 
                "Delete"
              )
            )
          )
        )
      )
    );
  }
});

var ManageAddImages = React.createClass({displayName: "ManageAddImages",
  render: function () {
    return (
      React.createElement("div", null)
    );
  }
});

var ManageGalleryItems = React.createClass({displayName: "ManageGalleryItems",
  loadImagesFromServer: function () {
    $.ajax({
      url: '/galleries/' + this.props.gallery + '/',
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
    return React.createElement(NavListItem, {text: item.text, url: item.url})
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
      React.createElement("div", {className: "pure-menu pure-menu-horizontal"}, 
        React.createElement("ul", {className: "pure-menu-list"}, 
          items
        ), 
        React.createElement("div", {className: "content"}, 
          React.createElement(EditChild, {data: this.state.data})
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
    return React.createElement(ManageGalleryThumb, {
      filepath: '#/manage/?gallery=' + gallery.url_path, 
      thumbpath: '/thumbnails/' + gallery.galleriesImages[0].name, 
      title: gallery.title})
  },
  render: function () {
    var images = this.state.data.map(this.generateManageGalleryThumb);
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
  generateItem: function (item) {
    return React.createElement(NavListItem, {text: item.text, url: item.url})
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
            React.createElement(AdminChild, {gallery: gallery})
          )
        )
      )
    );
  }
});