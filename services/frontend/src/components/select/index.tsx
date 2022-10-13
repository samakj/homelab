/** @format */

import { transparentize } from 'polished';
import React, { useCallback, useMemo } from 'react';
import _Select, { GroupBase, ThemeConfig } from 'react-select';
import { useTheme } from 'styled-components';
import { ContainerElement, LabelElement } from './elements';
import { SelectPropsType } from './types';

export const Select = <
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  label,
  styles: _styles,
  ...rest
}: React.PropsWithChildren<SelectPropsType<Option, IsMulti, Group>>) => {
  const theme = useTheme();
  const styles: typeof _styles = useMemo(
    () => ({
      ..._styles,
      control: (provided, state) => ({
        ...provided,
        borderRadius: 0,
        border: 'none',
        borderBottom: `1px solid ${transparentize(0.75, theme.colours.foreground)}`,
        color: theme.colours.foreground,
        background: theme.colours.background,
        boxShadow: 'none',
        fontSize: '1rem',

        '&:hover': {
          borderBottom: `1px solid ${theme.colours.foreground}`,
        },
        ..._styles?.container?.(provided, state),
      }),
      indicatorSeparator: (provided, state) => ({
        ...provided,
        display: 'none',
        ..._styles?.container?.(provided, state),
      }),
      menu: (provided, state) => ({
        ...provided,
        borderRadius: 0,
        border: `1px solid ${transparentize(0.75, theme.colours.foreground)}`,
        color: theme.colours.foreground,
        background: theme.colours.background,
        ..._styles?.container?.(provided, state),
      }),
      option: (provided, state) => ({
        ...provided,
        background: 'transparent',
        transition: 'background 300ms',

        '&:hover': {
          background: transparentize(0.75, theme.colours.foreground),
        },
        ..._styles?.container?.(provided, state),
      }),
      multiValue: (provided, state) => ({
        ...provided,
        background: theme.colours.foreground,
        color: theme.colours.background,
        transition: 'background 300ms',
        borderRadius: 0,
        fontSize: '0.675rem',
        padding: '0.25rem 0.5rem',
        margin: '0.125rem 0.25rem 0.125rem 0',
        fontWeight: 'bold',
        ..._styles?.container?.(provided, state),
      }),
      multiValueLabel: (provided, state) => ({
        ...provided,
        padding: '0',
        paddingRight: '0.125rem',
        ..._styles?.container?.(provided, state),
      }),
      multiValueRemove: (provided, state) => ({
        ...provided,
        padding: '0',
        ..._styles?.container?.(provided, state),
      }),
    }),
    [_styles]
  );
  const themeConfig: ThemeConfig = useCallback(
    (original) => ({
      ...original,
      primary: theme.colours.foreground,
      primary75: transparentize(0.25, theme.colours.foreground),
      primary50: transparentize(0.5, theme.colours.foreground),
      primary25: transparentize(0.75, theme.colours.foreground),
      danger: theme.colours.red,
      dangerLight: transparentize(0.5, theme.colours.red),
      neutral0: theme.colours.foreground,
      neutral5: transparentize(5, theme.colours.foreground),
      neutral10: transparentize(10, theme.colours.foreground),
      neutral20: transparentize(20, theme.colours.foreground),
      neutral30: transparentize(30, theme.colours.foreground),
      neutral40: transparentize(40, theme.colours.foreground),
      neutral50: transparentize(50, theme.colours.foreground),
      neutral60: transparentize(60, theme.colours.foreground),
      neutral70: transparentize(70, theme.colours.foreground),
      neutral80: transparentize(80, theme.colours.foreground),
      neutral90: transparentize(90, theme.colours.foreground),
    }),
    []
  );
  return (
    <ContainerElement>
      <LabelElement>{label}</LabelElement>
      <_Select styles={styles} theme={themeConfig} {...rest} />
    </ContainerElement>
  );
};
