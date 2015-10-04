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
  render: function () {
    var content = this.generateLink();
    return (React.createElement("li", {className: "pure-menu-item"}, content));
  }
});

var NavList = React.createClass({displayName: "NavList",
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
    var items = [
      {"text": "About", "url": "/about"},
      {"text": "Galleries", "url": "/galleries"}
    ].map(this.generateItem);
    return (
      React.createElement("div", {id: "layout", ref: "layout"}, 
        React.createElement("a", {href: "#menu", id: "menuLink", ref: "menuLink", className: "menu-link"}, 
          React.createElement("span", null)
        ), 
        React.createElement("div", {id: "menu", ref: "menu"}, 
          React.createElement("div", {className: "pure-menu"}, 
            React.createElement("a", {href: "#", className: "pure-menu-heading"}, "Galleries")
          ), 
          React.createElement("ul", {className: "pure-menu-list"}, 
            items
          )
        ), 
        React.createElement("div", {id: "main", ref: "main"}, 
          React.createElement("div", {className: "header"}, 
            React.createElement("h1", null, "Heading")
          ), 
          React.createElement("div", {className: "content"}, 
            React.createElement(Home, null)
          )
        )
      )
    );
  }
});

var App = React.createClass({displayName: "App",
  render: function () {
    var Child;
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
      default:
        Child = Home;
    }

    if (!this.props.route || this.props.route === 'galleries') {
      return (
        React.createElement("div", null, 
          React.createElement(NavList, null)
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