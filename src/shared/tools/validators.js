export const validate = (value, input_type) => {
  let is_valid = true;

  switch (input_type) {
    case "username":
    case "first_name":
    case "last_name": {
      is_valid = is_valid && validate_required(value) && validate_name(value);
      break;
    }
    case "email": {
      is_valid = is_valid && validate_email(value);
      break;
    }
    case "phone_number": {
      is_valid = is_valid && validate_phone_number(value);
      break;
    }
    case "zip": {
      is_valid = is_valid && validate_zip(value);
      break;
    }
    case "password_confirmation":
    case "password": {
      is_valid = is_valid && validate_password(value);
      break;
    }
    default:
      break;
  }

  return is_valid;
};

const validate_required = (value) => {
  return value.trim().length > 0;
};

const validate_name = (value) => {
  let regex_head = new RegExp("[0-9\\s]");
  let regex_body = new RegExp("^[0-9a-zA-Z]+$");

  if (regex_head.test(value[0])) {
    // 現在先管好return true or false就好
    // 把這些error message都先祝解掉，之後要更新再加進這個feature
    // display_name_field.setCustomValidity(
    //   "The first character can't be a number or a blank"
    // );
    // display_name_field.reportValidity();
    return false;
  } else if (!regex_body.test(value)) {
    // display_name_field.setCustomValidity(
    //   "The account name shouldn't contain any blank or symbol"
    // );
    // display_name_field.reportValidity();
    return false;
  } else {
    // display_name_field.setCustomValidity("");
    // display_name_field.reportValidity();
    return true;
  }
};

const validate_email = (value) => {
  // TODO regex won't care about invalid symbols after the email is valid
  let regex = new RegExp(
    "([a-zA-Z0-9-.])+@+[a-zA-Z0-9]{1,}[.]{1}[a-zA-Z0-9]{1,}"
  );

  if (regex.test(value)) {
    return true;
  } else {
    return false;
  }

  // if (email_address_field.validity.patternMismatch) {
  //   email_address_field.setCustomValidity(
  //     "Expect alphabet, number, or symbols like '-' and '.' before the '@' symbol.\nOnly alphabet, number, and exactly one '.' are accepted after the '@' symbol."
  //   );
  //   email_address_field.reportValidity();
  //   return false;
  // } else {
  //   email_address_field.setCustomValidity("");
  //   email_address_field.reportValidity();
  //   return true;
  // }
};

const validate_phone_number = (value) => {
  let regex = new RegExp("[0-9]{3}-[0-9]{3}-[0-9]{4}");

  // TODO regex won't care about words that are over index 12.
  if (regex.test(value) && value.length <= 12) {
    // console.log("valid");
    return true;
  } else {
    // console.log("invalid!");
    return false;
  }

  // if (phone_number_field.validity.patternMismatch) {
  //   phone_number_field.setCustomValidity(
  //     "Expect a format of 111-111-1111. Only numbers allowed."
  //   );
  //   phone_number_field.reportValidity();
  //   return false;
  // } else {
  //   phone_number_field.setCustomValidity("");
  //   phone_number_field.reportValidity();
  //   return true;
  // }
};

const validate_zip = (value) => {
  let regex = new RegExp("[0-9]{5}");

  // TODO regex won't care about words that are over index 5.
  if (regex.test(value) && value.length === 5) {
    // console.log("valid");
    return true;
  } else {
    // console.log("invalid!");
    return false;
  }

  // if (zipcode_field.validity.patternMismatch) {
  //   zipcode_field.setCustomValidity("Expect 5 numbers\nExample: 11111");
  //   zipcode_field.reportValidity();
  //   return false;
  // } else {
  //   zipcode_field.setCustomValidity("");
  //   zipcode_field.reportValidity();
  //   return true;
  // }
};

const validate_password = (value) => {
  return value.trim().length > 0;
  // pass1 = document.getElementById("password_field");
  // pass2 = document.getElementById("password_confirmation_field");
  // if (pass1.value !== pass2.value || !pass1.value || !pass2.value) {
  //   pass2.setCustomValidity("Passwords don't match");
  //   pass2.reportValidity();
  //   return false;
  // } else {
  //   pass2.setCustomValidity("");
  //   return true;
  // }
};
