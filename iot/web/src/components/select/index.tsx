/** @format */
import { useMemo } from 'react';
import ReactSelect, { ClassNamesConfig, GroupBase } from 'react-select';

import styles from './styles.module.scss';
import { SelectPropsType } from './types';

export const Select = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  classNames = {},
  ...rest
}: SelectPropsType<Option, IsMulti, Group>) => {
  const _classNames = useMemo(
    (): ClassNamesConfig<Option, IsMulti, Group> => ({
      container: (state) => `${styles.select} ${classNames?.container?.(state) || ''}`,
      control: (state) => `${styles.control} ${classNames?.control?.(state) || ''}`,
      indicatorsContainer: (state) =>
        `${styles.indicatorsContainer} ${classNames?.indicatorsContainer?.(state) || ''}`,
      ...classNames,
      indicatorSeparator: (state) =>
        `${styles.indicatorSeparator} ${classNames?.indicatorSeparator?.(state) || ''}`,
      ...classNames,
      input: (state) => `${styles.input} ${classNames?.input?.(state) || ''}`,
      menu: (state) => `${styles.menu} ${classNames?.menu?.(state) || ''}`,
      menuList: (state) => `${styles.menuList} ${classNames?.menuList?.(state) || ''}`,
      option: (state) =>
        `${styles.option} ${state.isSelected ? styles.selected : ''} ${classNames?.option?.(state) || ''}`,
      singleValue: (state) => `${styles.singleValue} ${classNames?.singleValue?.(state) || ''}`,
    }),
    [classNames]
  );

  return <ReactSelect classNames={_classNames} {...rest} />;
};
