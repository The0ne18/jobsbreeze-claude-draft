/**
 * Utility functions for formatting data
 */

/**
 * Converts a snake_case string to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts a camelCase string to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Converts an object with snake_case keys to camelCase keys
 */
export function snakeToCamelObject<T extends Record<string, any>>(obj: T): Record<string, any> {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamelObject(item));
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const camelKey = snakeToCamel(key);
      const camelValue = typeof value === 'object' && value !== null
        ? snakeToCamelObject(value)
        : value;
      return [camelKey, camelValue];
    })
  );
}

/**
 * Converts an object with camelCase keys to snake_case keys
 */
export function camelToSnakeObject<T extends Record<string, any>>(obj: T): Record<string, any> {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => camelToSnakeObject(item));
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const snakeKey = camelToSnake(key);
      const snakeValue = typeof value === 'object' && value !== null
        ? camelToSnakeObject(value)
        : value;
      return [snakeKey, snakeValue];
    })
  );
} 