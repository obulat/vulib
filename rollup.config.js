import vue from 'rollup-plugin-vue'
export default [
  // ESM build to be used with webpack/rollup.
  {
    input: 'src/index.js',
    output: {
      format: 'esm',
      file: 'dist/library.esm.js'
    },
    plugins: [
      vue()
    ]
  },
  // Browser build.
  {
    input: 'main.js',
    output: {
      format: 'iife',
      file: 'dist/library.js'
    },
    plugins: [
      vue()
    ]
  }
]
