var About = React.createClass({displayName: "About",
  getInitialState: function () {
    this.props.source = location.pathname + "?mime=json";
    return {data: null};
  },
  loadAboutFromServer: function () {
    $.ajax({
      url: this.props.source,
      type: 'GET',
      success: function (data) {
        if (this.isMounted()) {
          this.setState({data: data});
        }
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.source, status, error.toString());
      }.bind(this)
    });
  },
  componentDidMount: function () {
    this.loadAboutFromServer();
  },
  render: function () {
    var about;
    if (this.state.data) {
      if (this.state.data[0].hasOwnProperty('about')) {
        about = this.state.data[0].about;
      }
      else {
        about = '';
      }
      return (
        React.createElement("div", {className: "content-container pure-g"}, 
          React.createElement("div", {className: "pure-u-1 pure-u-md-1-1"}, 
            React.createElement("div", {className: "about header"}, 
              React.createElement("h2", null, "About")
            )
          ), 
          React.createElement("div", {className: "pure-u-1 pure-u-md-1-1"}, 
            React.createElement("p", null, 
              about
            )
          )
        )
      );
    }
    return React.createElement("div", null)
  }
});
