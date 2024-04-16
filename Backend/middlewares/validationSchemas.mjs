const createUserValidator = {
  firstname: {
    notEmpty: {
      errorMessage: "firstname should not be empty",
    },
    isString: {
      errorMessage: "firstname should be a string",
    },
  },
  lastname: {
    notEmpty: {
      errorMessage: "lastname should not be empty",
    },
    isString: {
      errorMessage: "lastname should be a string",
    },
  },
  email: {
    notEmpty: {
      errorMessage: "email should not be empty",
    },
    isEmail: {
      errorMessage: "email should be a valid email",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "password should not be empty",
    },
    isString: {
      errorMessage: "password should be a string",
    },
    isLength: {
      options: {
        max: 10,
        min: 6,
      },
      errorMessage: "password should have 6 to 10 characters",
    },
  },
};

export { createUserValidator };
