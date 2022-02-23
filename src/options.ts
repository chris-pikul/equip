import { InvalidOptionArgumentError } from 'commander';

/**
 * Used to parse optional numbers from Commander.
 * 
 * The value will be parsed as a float if supplied, otherwise undefined is
 * returned.
 * 
 * @param value Incoming value
 * @returns number, or undefined
 */
export function optNumber(value:any):(number|undefined) {
  if(value) {
    const num = parseFloat(value);

    if(isNaN(num))
      throw new InvalidOptionArgumentError('supplied value could not be parsed as a number');

    return num;
  }
}
