var NavListLink = React.createClass({displayName: "NavListLink",
  render: function () {
    return (
      React.createElement("a", {href: this.props.url, className: "pure-menu-link"}, this.props.text)
    );
  }
});

var NavListItem = React.createClass({displayName: "NavListItem",
  generateLink: function () {
    return React.createElement(NavListLink, {url: this.props.url, text: this.props.text});
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
  componentDidMount: function () {
    var route = window.location.pathname.split('/').filter(Boolean)[1]
      , active = React.findDOMNode(this.refs[route])
    ;
    if (active) {
      this.toggleClass(active, 'active');
    }
  },
  render: function () {
    var content = this.generateLink();
    return (React.createElement("li", {id: this.props.path, ref: this.props.path, className: "pure-menu-item"}, content, " "));
  }
});

var NavList = React.createClass({displayName: "NavList",
  getInitialState: function () {
    this.props.source = "/galleries/" + "?mime=json";
    return {data: null};
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
    $.ajax({
      url: this.props.source,
      type: 'GET',
      success: function (data) {
        if (this.isMounted()) {
          this.setState({data: data})
        };
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.source, status, error.toString());
      }.bind(this)
    });
    var self = this
      , layout = React.findDOMNode(this.refs.layout)
      , menu = React.findDOMNode(this.refs.menu)
      , menuLink = React.findDOMNode(this.refs.menuLink)
      , projectsCtrl = React.findDOMNode(this.refs.projectsCtrl)
      , projectsList = React.findDOMNode(this.refs.projectsList)
      , route = window.location.pathname.split('/').filter(Boolean)
      , specialRoute = ['all', 'recent'].indexOf(route[0]) > -1
    ;

    if (route[0] === 'galleries' && route[1] || specialRoute) {
      self.toggleClass(projectsList, 'hidden');
    }

    projectsCtrl.addEventListener('click', function (e) {
      e.preventDefault();
      self.toggleClass(projectsList, 'hidden');
    });

    menuLink.addEventListener('click', function (e) {
      e.preventDefault();
      self.toggleClass(layout, 'active');
      self.toggleClass(menu, 'active');
      self.toggleClass(menuLink, 'active');
    });
  },
  generateItem: function (item) {
    var text = item.title
      , url = "/galleries/" + item.url_path + "/"
    ;

    if (!item.hasOwnProperty('galleries_id')) {
      url = "/" + item.url_path + "/";
    }

    return React.createElement(NavListItem, {text: text, url: url, path: item.url_path})
  },
  render: function () {
    if (this.state.data) {
      var items = this.state.data.map(this.generateItem);
      return (
        React.createElement("div", {id: "layout", ref: "layout"}, 
          React.createElement("a", {href: "#menu", id: "menuLink", ref: "menuLink", className: "menu-link"}, 
            React.createElement("span", null)
          ), 
          React.createElement("div", {id: "menu", ref: "menu"}, 
            React.createElement("div", {className: "pure-menu"}, 
              React.createElement("a", {href: "/", className: "pure-menu-heading"}, "Images")
            ), 
            React.createElement("a", {href: "#", id: "projectsCtrl", ref: "projectsCtrl", className: "pure-menu-heading"}, "Work"), 
            React.createElement("ul", {id: "projectsList", ref: "projectsList", className: "pure-menu-list hidden"}, 
              items
            ), 
            React.createElement("a", {href: "/about/", className: "pure-menu-heading"}, "About"), 
            React.createElement("a", {href: "/contact/", className: "pure-menu-heading"}, "Contact")
          )
        )
      );
    }
    return (
      React.createElement("div", {id: "layout", ref: "layout"}, 
        React.createElement("a", {href: "#menu", id: "menuLink", ref: "menuLink", className: "menu-link"}, 
          React.createElement("span", null)
        ), 
        React.createElement("div", {id: "menu", ref: "menu"}, 
          React.createElement("div", {className: "pure-menu"}, 
            React.createElement("a", {href: "#", className: "pure-menu-heading"}, "Images")
          ), 
          React.createElement("a", {href: "#", id: "projectsCtrl", ref: "projectsCtrl", className: "pure-menu-heading"}, "Work"), 
          React.createElement("ul", {id: "projectsList", ref: "projectsList", className: "pure-menu-list hidden"}
          ), 
          React.createElement("a", {href: "/about/", className: "pure-menu-heading"}, "About"), 
          React.createElement("a", {href: "/contact/", className: "pure-menu-heading"}, "Contact")
        )
      )
    );
  }
});

var App = React.createClass({displayName: "App",
  render: function () {
    var special;

    switch (this.props.route) {
      case 'login':
        Child = AdminLogin;
        break;
      case 'register':
        Child = AdminRegister;
        break;
      case 'users':
        Child = AdminUser;
        break;
      case 'home':
        Child = Home;
        break;
      case 'galleries':
        Child = Gallery;
        break;
      case 'all':
        Child = Gallery;
        break;
      case 'recent':
        Child = Gallery;
        break;
      default:
        Child = Home;
        break;
    }

    special = ['galleries', 'all', 'recent'].indexOf(this.props.route) > -1;

    if (!this.props.route || special) {
      return (
        React.createElement("div", {id: "layout", ref: "layout"}, 
          React.createElement(NavList, null), 
          React.createElement("div", {id: "main", ref: "main"}, 
            React.createElement("div", {className: "content"}, 
              React.createElement(Child, null)
            )
          )
        )
      );
    }
    else {
      return (
        React.createElement("div", null, 
          React.createElement(Child, null)
        )
      );
    }
  }
});

function render () {
  var route = window.location.pathname.split('/').filter(Boolean)[0];
  React.render(React.createElement(App, {route: route}), document.body);
}

window.addEventListener('hashchange', render);
render();