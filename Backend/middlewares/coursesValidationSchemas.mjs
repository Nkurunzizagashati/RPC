const createCourseValidator = {
  title: {
    notEmpty: {
      errorMessage: "Title should not be empty",
    },
    isString: {
      errorMessage: "Title should be a string",
    },
  },
  description: {
    notEmpty: {
      errorMessage: "Description should not be empty",
    },
    isString: {
      errorMessage: "Description should be a string",
    },
    isLength: {
      options: {
        max: 400,
        min: 10,
      },
      errorMessage: "Description should have 10 to 400 characters",
    },
  },
  author: {
    notEmpty: {
      errorMessage: "Author field should not empty",
    },
    isString: {
      errorMessage: "Author name should be a string",
    },
  },
  // Validation for courseModules array
  courseModules: {
    isArray: {
      errorMessage: "Course modules should be an array",
    },
    custom: {
      options: (value) => {
        if (!Array.isArray(value)) {
          throw new Error("Course modules should be an array");
        }
        for (const module of value) {
          if (!module.title || typeof module.title !== "string") {
            throw new Error(
              "Title for each module should be a non-empty string"
            );
          }
          if (!module.introduction || typeof module.introduction !== "string") {
            throw new Error(
              "Introduction for each module should be a non-empty string"
            );
          }
          if (!module.body || typeof module.body !== "string") {
            throw new Error(
              "Body for each module should be a non-empty string"
            );
          }
          if (
            !module.contentType ||
            !["tutorial", "video", "course", "article"].includes(
              module.contentType
            )
          ) {
            throw new Error("Invalid content type for each module");
          }
          if (
            module.contentType !== "course" &&
            (!module.additionContentLink ||
              typeof module.additionContentLink !== "string")
          ) {
            throw new Error(
              'Additional content link is required for modules other than "course"'
            );
          }
          if (
            module.completed !== undefined &&
            typeof module.completed !== "boolean"
          ) {
            throw new Error(
              "Completed flag for each module should be a boolean"
            );
          }
        }
        return true;
      },
    },
  },
};

const updateCourseValidator = {
  title: {
    optional: { options: { nullable: true } },
    notEmpty: {
      errorMessage: "Title should not be empty",
    },
    isString: {
      errorMessage: "Title should be a string",
    },
  },
  description: {
    optional: { options: { nullable: true } },
    notEmpty: {
      errorMessage: "Description should not be empty",
    },
    isString: {
      errorMessage: "Description should be a string",
    },
    isLength: {
      options: {
        max: 400,
        min: 10,
      },
      errorMessage: "Description should have 10 to 400 characters",
    },
  },
  author: {
    optional: { options: { nullable: true } },
    notEmpty: {
      errorMessage: "Author field should not empty",
    },
    isString: {
      errorMessage: "Author name should be a string",
    },
  },
  // Validation for courseModules array
  courseModules: {
    optional: { options: { nullable: true } },
    isArray: {
      errorMessage: "Course modules should be an array",
    },
    custom: {
      options: (value) => {
        if (!Array.isArray(value)) {
          throw new Error("Course modules should be an array");
        }
        for (const module of value) {
          if (module.title && typeof module.title !== "string") {
            throw new Error(
              "Title for each module should be a non-empty string"
            );
          }
          if (module.introduction && typeof module.introduction !== "string") {
            throw new Error(
              "Introduction for each module should be a non-empty string"
            );
          }
          if (module.body && typeof module.body !== "string") {
            throw new Error(
              "Body for each module should be a non-empty string"
            );
          }
          if (
            module.contentType &&
            !["tutorial", "video", "course", "article"].includes(
              module.contentType
            )
          ) {
            throw new Error("Invalid content type for each module");
          }
          if (
            module.contentType !== "course" &&
            module.additionContentLink &&
            typeof module.additionContentLink !== "string"
          ) {
            throw new Error(
              'Additional content link is required for modules other than "course"'
            );
          }
          if (
            module.completed !== undefined &&
            typeof module.completed !== "boolean"
          ) {
            throw new Error(
              "Completed flag for each module should be a boolean"
            );
          }
        }
        return true;
      },
    },
  },
};

export { createCourseValidator };
