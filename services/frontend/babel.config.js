/** @format */

module.exports = (api) => {
  api.cache(true);

  return {
    presets: ['react-app'],
    plugins: [
      'babel-plugin-styled-components',
      [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'automatic',
          importSource: 'preact/compat',
        },
      ],
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            react: 'preact/compat',
            'react-dom/test-utils': 'preact/test-utils',
            'react-dom': 'preact/compat',
            'react/jsx-runtime': 'preact/jsx-runtime',
          },
        },
      ],
    ],
  };
};
