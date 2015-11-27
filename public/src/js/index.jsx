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
    return (<li id={this.props.path} ref={this.props.path} className="pure-menu-item">{content} </li>);
  }
});

var NavList = React.createClass({
  getInitialState: function () {
    this.props.source = "/galleries/";
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
    ;

    if (route[0] === 'galleries' && route[1]) {
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
    return <NavListItem text={text} url={url} path={item.url_path} />
  },
  render: function () {
    if (this.state.data) {
      this.state.data.unshift({"title": "Recent", "url_path": "new_images"}
        , {"title": "All", "url_path": "all_images"})
      ;
      var items = this.state.data.map(this.generateItem);
      return (
        <div id="layout" ref="layout">
          <a href="#menu" id="menuLink" ref="menuLink" className="menu-link">
            <span></span>
          </a>
          <div id="menu" ref="menu">
            <div className="pure-menu">
              <a href="/" className="pure-menu-heading">Images</a>
            </div>
            <a href="#" id="projectsCtrl" ref="projectsCtrl" className="pure-menu-heading">Projects</a>
            <ul id="projectsList" ref="projectsList" className="pure-menu-list hidden">
              {items}
            </ul>
            <a href="/about/" className="pure-menu-heading">About</a>
            <a href="/contact/" className="pure-menu-heading">Contact</a>
          </div>
        </div>
      );
    }
    return (
      <div id="layout" ref="layout">
        <a href="#menu" id="menuLink" ref="menuLink" className="menu-link">
          <span></span>
        </a>
        <div id="menu" ref="menu">
          <div className="pure-menu">
            <a href="#" className="pure-menu-heading">Images</a>
          </div>
          <a href="#" id="projectsCtrl" ref="projectsCtrl" className="pure-menu-heading">Projects</a>
          <ul id="projectsList" ref="projectsList" className="pure-menu-list hidden">
          </ul>
          <a href="/about/" className="pure-menu-heading">About</a>
          <a href="/contact/" className="pure-menu-heading">Contact</a>
        </div>
      </div>
    );
  }
});

var App = React.createClass({
  render: function () {
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
      default:
        Child = Home;
        break;
    }

    if (!this.props.route || this.props.route === 'galleries') {
      return (
        <div id="layout" ref="layout">
          <NavList />
          <div id="main" ref="main">
            <div className="content">
              <Child />
            </div>
          </div>
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