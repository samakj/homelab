/** @format */
import { GroupBase, Props } from 'react-select';
import Select from 'react-select/base';

export interface SelectPropsType<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends Props<Option, IsMulti, Group>,
    React.RefAttributes<Select<Option, IsMulti, Group>> {}
