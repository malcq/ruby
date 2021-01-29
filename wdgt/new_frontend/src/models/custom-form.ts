export interface IListOption {
  id: string,
  title: string,
}

/**
 * Custom Rules definitions
 */
export interface ICustomFormRule {
  type: string,
  error?: string,
  id: string,
  [key: string]: any,
}

export interface ICustomFormRuleRegex extends ICustomFormRule {
  regex: string,
};

export interface ICustomFormRuleList extends ICustomFormRule {
  values: IListOption[],
  fileName: string,
};

export interface ICustomFormRuleLength extends ICustomFormRule {
  length: number,
}

/**
 * Main custom 
 */
export interface ICustomFormField {
  id: string,
  data_type: string,
  placeholder?: string,
  rules: ICustomFormRule[],
}
