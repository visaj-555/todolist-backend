import Joi from "joi";

export const taskValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
      "string.base": "Title should be a string",
      "string.empty": "Title cannot be empty",
      "string.min": "Title should be at least 3 characters",
      "string.max": "Title should be at most 100 characters",
      "any.required": "Title is required",
    }),
    description: Joi.string().optional().messages({
      "string.base": "Description should be a string",
    }),
    status: Joi.string()
      .valid("Pending", "In Progress", "Completed")
      .optional()
      .messages({
        "string.base": "Status should be a string",
        "any.only":
          "Status must be one of 'Pending', 'In Progress', or 'Completed'",
      }),
    priority: Joi.string().valid("Low", "Medium", "High").optional().messages({
      "string.base": "Priority should be a string",
    }),

    dueDate: Joi.date().optional().messages({
      "date.base": "Due date should be a valid date",
    }),
    userId: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      statusCode: 400,
      message: "Validation error",
      errors,
    });
  }
  next();
};
