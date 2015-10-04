var NavListLink = React.createClass({
  render: function () {
    return (
      <a href={this.props.url} className="pure-menu-link">{this.props.text}</a>
    );
  }
});

var NavListItem = React.createClass({
  generateLink: function () {
    return <NavListLink url={this.props.url} text={this.props.text} />;
  },
  render: function () {
    var content = this.generateLink();
    return (<li className="pure-menu-item">{content}</li>);
  }
});

var NavList = React.createClass({
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
    var items = [
      {"text": "About", "url": "/about"},
      {"text": "Galleries", "url": "/galleries"}
    ].map(this.generateItem);
    return (
      <div id="layout" ref="layout">
        <a href="#menu" id="menuLink" ref="menuLink" className="menu-link">
          <span></span>
        </a>
        <div id="menu" ref="menu">
          <div className="pure-menu">
            <a href="#" className="pure-menu-heading">Galleries</a>
          </div>
          <ul className="pure-menu-list">
            {items}
          </ul>
        </div>
        <div id="main" ref="main">
          <div className="header">
            <h1>Heading</h1>
          </div>
          <div className="content">
            <Home />
          </div>
        </div>
      </div>
    );
  }
});

var App = React.createClass({
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
        <div>
          <NavList />
        </div>
      );
    }
    else {
      return (
        <div>
          <Child />
        </div>
      );
    }
  }
});

function render () {
  var route = window.location.pathname.split('/').filter(Boolean)[0];
  React.render(<App route={route} />, document.body);
}

window.addEventListener('hashchange', render);
render();