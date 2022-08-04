const plugins = []
if (process.env.NODE_ENV === 'production') {
  plugins.push('transform-remove-console')
}
plugins.push([
  'import',
  {
    libraryName: 'vant',
    libraryDirectory: 'es',
    style: true
  },
  'vant'
])
plugins.push('@babel/plugin-transform-runtime')
module.exports = {
  presets: [
    ['@vue/app'],
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage'
      }
    ]
  ],
  plugins: plugins
}
