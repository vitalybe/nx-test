import { useCallback } from "react";
import * as yup from "yup";
import { loggerCreator } from "../../../../utils/logger";
import { useMountedRef } from "../../../../utils/hooks/useMountedRef";
import { ResolverResult } from "react-hook-form/dist/types/resolvers";

const logger = loggerCreator("__filename");

export function useYupValidationResolver<T extends object = {}>(
  validationSchema: yup.ObjectSchema<yup.Shape<T, object>>
) {
  const isMountedRef = useMountedRef();
  return useCallback(
    async (data) => {
      if (isMountedRef.current) {
        return await runAsyncYupValidation<T>(data, validationSchema);
      }
      return {
        values: data,
        errors: {},
      };
    },
    [isMountedRef, validationSchema]
  );
}

export async function runAsyncYupValidation<T extends object>(
  data: T,
  validationSchema: yup.ObjectSchema<yup.Shape<T, object>>
): Promise<ResolverResult<T>> {
  try {
    const values = await validationSchema.validate(data, {
      abortEarly: false,
    });
    return {
      values,
      errors: {},
    } as ResolverResult<T>;
  } catch (errors) {
    logger.warn("[YUP]: Validation errors for scheme: ");
    // eslint-disable-next-line no-console
    logger.debug(errors);

    return {
      values: {},
      errors: (errors as yup.ValidationError).inner.reduce(
        (allErrors, currentError) => ({
          ...allErrors,
          [currentError.path]: {
            type: currentError.type ?? "validation",
            message: currentError.message,
          },
        }),
        {}
      ),
    } as ResolverResult<T>;
  }
}
