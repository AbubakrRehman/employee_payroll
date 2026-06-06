import BadRequestError from "../utils/BadRequestError.js";

const validate = (schema) => (req, res, next) => {
  // safeParse returns an object showing if validation succeeded or failed
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    // Extract the exact error messages and join them cleanly
    const errorMessages = result.error.issues
      .map((err) => {
        const field = err.path.join('.');

        // Global override: Fix Zod's robotic "Expected number, received string" message
        if (err.code === 'invalid_type') {
          return `${field}: Invalid data type provided`;
        }

        // Let Zod handle the rest (e.g., "Number must be less than or equal to 12")
        return `${field}: ${err.message}`;
      })
      .join(', ');
    // Throw our custom 400 error with Zod's specific feedback
    throw new BadRequestError(errorMessages);
  }

  // If everything is valid, pass the clean data forward and continue
  req.validatedData = result.data;
  next();
};

export default validate;