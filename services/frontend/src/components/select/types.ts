/** @format */

import { GroupBase, Props } from 'react-select';

export interface SelectPropsType<
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends Omit<Props<Option, IsMulti, Group>, 'theme'> {
  label?: string;
}
