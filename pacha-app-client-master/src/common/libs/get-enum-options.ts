type EnumType = { [key: string]: string | number };

export const getEnumOptions = <T extends EnumType>(enumObject: T) => {
  return Object.values(enumObject).map((value) => {
    const label = String(value)
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return {
      label,
      value: value as T[keyof T],
    };
  });
};
