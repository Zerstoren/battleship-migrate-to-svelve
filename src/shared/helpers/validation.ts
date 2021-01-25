import { Writable, writable } from 'svelte/store'
import { buildValidator, ValidationData, Validator } from './validate'

const createFieldValidator = <V> (...validators: Validator<V>[]) => {
  const { subscribe, set } = writable<ValidationData<V>>({ dirty: false, valid: false, message: undefined, touch: false })
  const validator = buildValidator(validators)

  const action = (node: HTMLElement, binding: V) => {
    let touch = false;

    const onFocus = () => {
      touch = true;
    };

    node.addEventListener('focus', onFocus);

    function validate (value: V, dirty: boolean, touch: boolean) {
      const result = validator(value, dirty, touch);
      set(result)
    }
    
    validate(binding, false, false)

    return {
      update (value: V) : void {
        validate(value, true, touch)
      }
    }
  }

  return {
    data: {subscribe}, 
    validate: action
  };
}

export default createFieldValidator;