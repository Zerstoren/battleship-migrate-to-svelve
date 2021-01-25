export interface ValidationData<T> {
  dirty: boolean,
  touch: boolean,
  valid: boolean,
  message?: string | boolean | Validator<T>
}

export type Validator<T> = (value: T) => string | boolean;

function buildValidator<V>(validators: Validator<V>[]) {
  return (value: V, dirty: boolean, touch: boolean) : ValidationData<V> => {
    if (!validators || validators.length === 0) {
      return { dirty, valid: true, touch: touch };
    }

    const failing = validators.find((v) => v(value) !== true)

    return {
      dirty,
      valid: !failing,
      touch: touch,
      message: failing && failing(value)
    }
  }
}

export { buildValidator }