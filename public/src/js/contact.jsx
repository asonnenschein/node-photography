var Contact = React.createClass({
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
    var contact;
    if (this.state.data) {
      if (this.state.data[0].hasOwnProperty('contact')) {
        contact = this.state.data[0].contact;
      }
      else {
        contact = '';
      }
      return (
        <div className="content-container pure-g">
          <div className="pure-u-1 pure-u-md-1-1">
            <div className="contact header">
              <h2>Contact</h2>
            </div>
          </div>
          <div className="pure-u-1 pure-u-md-1-1">
            <p>
              {contact}
            </p>
          </div>
        </div>
      );
    }
    return <div></div>
  }
});
