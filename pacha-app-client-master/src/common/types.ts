export type FunctionComponent = React.ReactElement | null;

type HeroIconSVGProps = React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> &
  React.RefAttributes<SVGSVGElement>;
type IconProps = HeroIconSVGProps & {
  title?: string;
  titleId?: string;
};
export type Heroicon = React.FC<IconProps>;

import { LucideIcon } from 'lucide-react';

export type NavLinkType = {
  title: string;
  path?: string;
  label?: string;
  icon: LucideIcon;
};

export interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: Option[];
  advance?: boolean;
  dateRange?: boolean;
  numberOptition?: NumberOptions;
}
export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}
export interface NumberOptions {
  maxNumber?: number;
  rangeMax?: number;
  rangeMin?: number;
  key?: string;
}
export interface DataTableFilterOption<TData> {
  dateRange: boolean;
  id: string;
  label: string;
  value: keyof TData;
  options: Option[];
  filterValues?: string[];
  filterOperator?: string;
  isMulti?: boolean;
  numberOptition?: NumberOptions;
}
export interface ImageType {
  _id: string;
  imagePath: string;
}
