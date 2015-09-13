var AdminLogin = React.createClass({displayName: "AdminLogin",
  render: function () {
    return (
      React.createElement("form", {className: "pure-form pure-form-stacked", method: "post", 
        action: "/admin/login/"}, 
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
    );
  }
});

var AdminRegister = React.createClass({displayName: "AdminRegister",
  render: function () {
    return (
      React.createElement("form", {className: "pure-form pure-form-stacked", method: "post", 
        action: "/admin/register/"}, 
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
    );
  }
});

var AdminUser = React.createClass({displayName: "AdminUser",
  render: function () {
    return (
      React.createElement("div", null, 
        React.createElement("h1", null, "HELLO")
      )
    );
  }
});