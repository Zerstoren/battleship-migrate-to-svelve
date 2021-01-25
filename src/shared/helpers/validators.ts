const requiredValidator = <V extends string>() => {
  return (value: V) => {
    return (value !== undefined && value !== null && value !== '') || 'This field is required'
  }
}

interface TFormData {
  name: string,
  x: number,
  y: number,
  ships4n: number,
  ships3n: number,
  ships2n: number,
  ships1n: number,
}

const calculateRequredFieldSize = (
  ships4n: number,
  ships3n: number,
  ships2n: number,
  ships1n: number,
) : number => Number(((ships4n * 4) + (ships3n * 3) + (ships2n * 2) + (ships1n * 1)) * 1.65);

const validateShipsCount = <V extends TFormData>() => {
  return (fields: V) => {
    if (
      (fields.x * fields.y) < calculateRequredFieldSize(fields.ships4n, fields.ships3n, fields.ships2n, fields.ships1n)
    ) {
      return 'Need less ships';
    }
  
    return true;
  }
}

const validateFieldSize = <V extends number>() => {
  return (field: V) => {
    if (field <= 4) {
      return 'Field is too short';
    } else if (field >= 50) {
      return 'Field is too long';
    }

    return true;
  }
}

export {
  requiredValidator,
  validateShipsCount,
  validateFieldSize,
}