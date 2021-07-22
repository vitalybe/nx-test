import * as yup from "yup";
import { ValidationError } from "yup";

export class FormikUtils {
  static performSchemaValidation<T>(schema: yup.ObjectSchema, formData: T) {
    const errors: Record<string, string> = {};

    try {
      schema.validateSync(formData, { abortEarly: false });
    } catch (e) {
      if (e instanceof ValidationError) {
        const validationErrors = Object.fromEntries(e.inner.map(e => [e.path, e.message]));
        Object.assign(errors, validationErrors);
      }
    }

    return errors;
  }
}
