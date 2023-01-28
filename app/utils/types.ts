export type Field<T> = {
  value: T;
  onChange: (v: T) => void;
};

export type Option<T = string> = {
  value: T;
  label: string;
};

export type IndeterminateBool = boolean | "indeterminate";

export type MarriageType = "diamond" | "club" | "spade" | "heart";
