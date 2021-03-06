/*database.html*/
$(() => {
  let id = -1, // contains the number of IDs there are starting at 0
    tempID = -1, // used as a temporary ID when a new user is added
    del = false, // is true when the delete button is pressed
    data = []; // stores the users

  // Checks whether all fields are filled
  function checkEmpty(array) {
    const validate = array.every(item => item.fName && item.lName &&
      item.username && item.email && item.password);
    return validate;
  };
  // Checks whether all emails are in a valid format
  function validateEmail(array) {
    let pattern = /\S+@\S+\.\S+/;
    let validate = array.filter(item => {
      return !pattern.test(item.email);
    });
    if (validate.length > 0) validate = validate.map(item => { return item.ID });
    return validate;
  };
  // Checks whether all passwords are between 8 and 16 characters
  function validatePassword(array) {
    let validate = array.filter(item => {
      return item.password.length < 8 || item.password.length > 16;
    });
    if (validate.length > 0) validate = validate.map(item => { return item.ID });
    return validate;
  };
  // Checks whether two users do not have the same username
  function checkDuplicateUsername(array) {
    let seen = new Set();
    let hasDuplicates = array.filter(item => {
      return seen.size === seen.add(item.username).size;
    });
    if (hasDuplicates.length > 0) hasDuplicates = hasDuplicates.map(item => { return item.ID });
    return hasDuplicates;
  };
  // Checks whether there are no duplicate emails
  function checkDuplicateEmail(array) {
    let seen = new Set();
    let hasDuplicates = array.filter(item => {
      return seen.size === seen.add(item.email).size;
    });
    if (hasDuplicates.length > 0) hasDuplicates = hasDuplicates.map(item => { return item.ID });
    return hasDuplicates;
  };

  if (localStorage.length > 0) {
    data = JSON.parse(localStorage.getItem("users") || "[]");

    data.forEach(element => {
      let ID = "<p class='user-ID'>" + element.ID + "</p>";
      let fname = " <input name='fName' type='text' value='" + element.fName + "'> ";
      let lname = " <input name='lName' type='text' value='" + element.lName + "'> ";
      let user = " <input name='username' type='text' value='" + element.username + "'> ";
      let email = " <input name='email' type='text' value='" + element.email + "'> ";
      let password = " <input name='password' type='text' value='"
        + element.password + "'> ";

      $('.button').before("<div class='data' id='" + element.ID + "'>" + ID + fname + lname + user +
        email + password + "</div>");
      id++;
    }); // end forEach
    tempID = id;
  }; // end if

  $('#user-form').change(() => {
    $('#update-btn').prop('disabled', false);
    $('#save-btn').prop('disabled', true);
  });

  // Updates the database based on the new, changed, or deleted inputs
  $("#update-btn").click(() => {
    if (tempID != id) id++;
    data.length = 0;

    if (del) {
      let val = 0;

      $('#user-form').change(() => {
        $('#update-btn').prop('disabled', false);
      });

      $('input[name="delete"]:checked').each((i, element) => {
        $(element).parents('div[class="data"]').remove();
        id--;
      });

      $('input[name="delete"]').remove();

      $('.user-ID').show();

      $('.user-ID').each((i, element) => {
        let parent = $(element).parents('div[class="data"]');
        parent[0].id = val;
        $(element).text(val);
        val++;
      });

      $('input').prop('readonly', false);
      $('input[name="ID"]').prop('readonly', true);
    };  // end if

    for (let i = 0; i <= id; i++) {
      data[i] = {
        ID: i,
        fName: $('#' + i + ' input[name="fName"]').val(),
        lName: $('#' + i + ' input[name="lName"]').val(),
        username: $('#' + i + ' input[name="username"]').val(),
        email: $('#' + i + ' input[name="email"]').val(),
        password: $('#' + i + ' input[name="password"]').val()
      };
    };

    tempID = id;
    $('#delete-btn').prop('disabled', false);
    $('#add-btn').prop('disabled', false);
    $('#save-btn').prop('disabled', false);
    $('#update-btn').prop('disabled', true);
  }); // end click

  // Resets the database to the last update
  $('#reset-btn').click(() => {
    if (tempID != id) {
      $('#' + tempID).remove();
      data.pop();
    };
    tempID = id;

    if (del) {
      $('input[name="delete"]').remove();

      $('.user-ID').show();

      $('#user-form').change(() => {
        $('#update-btn').prop('disabled', false);
      });
    }; // end if

    data.forEach(element => {
      $('#' + element.ID + ' input[name="fName"]').val(element.fName);
      $('#' + element.ID + ' input[name="lName"]').val(element.lName);
      $('#' + element.ID + ' input[name="username"]').val(element.username);
      $('#' + element.ID + ' input[name="email"]').val(element.email);
      $('#' + element.ID + ' input[name="password"]').val(element.password);
    });

    $('input').prop('readonly', false);
    $('input[name="ID"]').prop('readonly', true);
    $('#add-btn').prop('disabled', false);
    $('#delete-btn').prop('disabled', false);
    $('#update-btn').prop('disabled', true);
  }); // end click

  // Adds a new user to the database
  $('#add-btn').click(() => {
    tempID++;
    data.push({
      ID: tempID,
      fName: " ",
      lName: " ",
      username: " ",
      email: " ",
      password: " "
    });

    let ID = "<p class='user-ID'>" + tempID + "</p>";
    let fname = " <input name='fName' type='text'> ";
    let lname = " <input name='lName' type='text'> ";
    let user = " <input name='username' type='text'> ";
    let email = " <input name='email' type='text'> ";
    let password = " <input name='password' type='text'>";

    rId = tempID - 1;
    $('#' + rId).after("<div class='data' id='" + tempID + "'>" + ID + fname + lname + user +
      email + password + "</div>");

    $('#add-btn').prop('disabled', true);
    $('#delete-btn').prop('disabled', true);
    $('#save-btn').prop('disabled', true);
    $('#update-btn').prop('disabled', false);
  }); // end click

  // Deletes specified users on an update
  $('#delete-btn').click(() => {
    if (data.length < 1) { alert("nothing to delete"); return }
    alert('Select the rows you would like to delete');
    $('input').prop('readonly', true);
    $('.user-ID').hide();
    $('.user-ID').before('<input name="delete" type="checkbox">');
    $('#delete-btn').prop('disabled', true);
    $('#add-btn').prop('disabled', true);
    $('#save-btn').prop('disabled', true);
    del = true;
    $('#user-form').change(() => {
      if ($('input[type="checkbox"]:checked').length < 1) $('#update-btn').prop('disabled', true);
    });
  }); // end click

  // Saves all the updated changes to a localStorage object
  $('#save-btn').click((evt) => {
    if (!checkEmpty(data)) {
      alert('All fields must be filled out!');
      $('#save-btn').prop('disabled', true);
      evt.preventDefault();

    } else if (validateEmail(data).length > 0) {
      alert('The email(s) on row(s): ' + validateEmail(data).join(', ') + ' are in improper format');
      $('#save-btn').prop('disabled', true);
      evt.preventDefault();

    } else if (validatePassword(data).length > 0) {
      alert('The password(s) on row(s): ' + validatePassword(data).join(', ') + ' need to be between 8 and 16 characters long');
      $('#save-btn').prop('disabled', true);
      evt.preventDefault();

    } else if (checkDuplicateUsername(data).length > 0) {
      alert('The username(s) on row(s): ' + checkDuplicateUsername(data).join(', ') + ' have already been entered');
      $('#save-btn').prop('disabled', true);
      evt.preventDefault();

    } else if (checkDuplicateEmail(data).length > 0) {
      alert('The email(s) on row(s): ' + checkDuplicateEmail(data).join(', ') + ' have already been entered');
      $('#save-btn').prop('disabled', true);
      evt.preventDefault();

    } else {
      localStorage.setItem("users", JSON.stringify(data));
      alert("Saved");
      location.reload();
    };
  }); // end click 

}); // end ready