/** @format */

export interface RouterPropsType {
  location?: string;
}

export interface AuthorisePropsType {
  scopes: string[];
}

export interface AuthorisationContextType {
  checkingToken: boolean;
  setCheckingToken: (checkingToken: boolean) => void;
}
