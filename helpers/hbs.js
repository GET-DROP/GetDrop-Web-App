const moment = require("moment");
const { options } = require("../routes");
module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },
  editIcon: function (airdropsUser, loggedUser, airdropsId, floating = true) {
    if (airdropsUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/airdrops/edit/${airdropsId}" class="btn-floating halfway-fab blue "><i class="fas fa-edit fa-small"></i></a>`;
      } else {
        return `<a href="/airdrops/edit/${airdropsId}"><i class="fas fa-edit"></i></a>`;
      }
    } else {
      return "";
    }
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected = "selected"'
      )
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected = "selected"$&'
      );
  },
  navUserimage: function (loggedUser) {
    if (loggedUser) {
      return ` <img src="${loggedUser.image}" alt="" class="circle responsive-img img-small">`;
    } else {
      return "GETDROP";
    }
  },
  sidenavUserimage: function (loggeduser) {
    if (loggeduser) {
      return `<li>
      <div class="user-view">
          <div class="background">
              <img src="https://picsum.photos/440/250">
          </div>
          <img class="circle" src=${loggeduser.image}>
          <span class="white-text name"><p>Hi, ${loggeduser.displayName}</p></span>
          <p><span class="white-text email">You have 0 airdrops running</span></p>
      </div>
  </li>`;
    } else {
      return "";
    }
  },
  displayingerrors: function (errors, success_msg) {
    if (typeof errors != "undefined") {
      errors.forEach(error => {
         `<div class="chip">${error.msg}
        <i class="close material-icons">close</i>
        </div>  <p>thisisiiiis it<p>`;
      });
    } else {
      return "";
    }
  },
};
