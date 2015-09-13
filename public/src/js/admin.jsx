var AdminLogin = React.createClass({
  render: function () {
    return (
      <form className="pure-form pure-form-stacked" method="post"
        action="/admin/login/">
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
    );
  }
});

var AdminRegister = React.createClass({
  render: function () {
    return (
      <form className="pure-form pure-form-stacked" method="post"
        action="/admin/register/">
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
    );
  }
});

var AdminUser = React.createClass({
  render: function () {
    return (
      <div>
        <h1>HELLO</h1>
      </div>
    );
  }
});