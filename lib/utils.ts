// utils.ts
type ClassValue = string | undefined | null | false;

export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(' ');
}

// Variant helper (basic)
type VariantOptions<T extends string> = {
  [K in T]?: string;
};

type VariantProps<T extends string> = {
  variant?: T;
};

export function withVariant<T extends string>(
  baseClass: string,
  variants: VariantOptions<T>
) {
  return ({ variant, className }: VariantProps<T> & { className?: string } = {}) => {
    return cn(baseClass, variant ? variants[variant] : undefined, className);
  };
}
