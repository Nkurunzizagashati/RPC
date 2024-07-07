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
  isAdmin: {
    optional: { options: { nullable: true } },
    isBoolean: {
      errorMessage: "Is admin should have a boolean value",
    },
  },
};

const loginUserValidator = {
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

const deleteUserValidator = {
  userId: {
    in: ["params"],
    notEmpty: {
      errorMessage: "You need to provide an id for the user you want to delete",
    },
    isString: {
      errorMessage: "Id should be a string",
    },
  },
};

const updateUserValidator = {
  firstname: {
    optional: { options: { nullable: true } },
    notEmpty: {
      errorMessage: "firstname should not be empty",
    },
    isString: {
      errorMessage: "firstname should be a string",
    },
  },
  lastname: {
    optional: { options: { nullable: true } },
    notEmpty: {
      errorMessage: "lastname should not be empty",
    },
    isString: {
      errorMessage: "lastname should be a string",
    },
  },
  email: {
    optional: { options: { nullable: true } },
    notEmpty: {
      errorMessage: "email should not be empty",
    },
    isEmail: {
      errorMessage: "email should be a valid email",
    },
  },
  password: {
    optional: { options: { nullable: true } },
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

export {
  createUserValidator,
  loginUserValidator,
  deleteUserValidator,
  updateUserValidator,
};
