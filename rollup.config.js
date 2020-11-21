import vue from 'rollup-plugin-vue'
import node from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

import fs from 'fs'
import path from 'path'

import pack from './package.json'

const babelConfig = {
  exclude: 'node_modules/**',
  babelHelpers: 'runtime',
  babelrc: false,
  presets: [['@babel/preset-env', { modules: false }]]
}

const bannerTxt = `/*! Vue Vocabulary v${pack.version} | MIT License | github.com/creativecommons/vocabulary */`

const baseFolder = './src/'
const componentsFolder = 'elements/'

const components = fs
  .readdirSync(baseFolder + componentsFolder)
  .filter((f) =>
    fs.statSync(path.join(baseFolder + componentsFolder, f)).isDirectory()
  )
console.log('Components: ', components)

// TODO: components will not be extracted if the component name doesn't match the folder name
const entries = {
  'index': './src/index.js',
  'helpers': './src/utilities/helpers.js',
  ...components.reduce((obj, name) => {
    obj[name] = (baseFolder + componentsFolder + name + `${path.sep}${name}.vue`)
    return obj
  }, {})
}
console.log('Entries: ', entries)

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const vuePluginConfig = {
  template: {
    isProduction: true,
    compilerOptions: {
      whitespace: 'condense'
    }
  },
  style: {
    preprocessOptions: {
      scss: {
        includePaths: ['node_modules'],
      }
    }
  },
  include: [/\.vue$/i, 'src/utilities', 'src/mixins']
}

export default () => {
  const mapComponent = (name) => {
    return [
      {
        input: baseFolder + componentsFolder + `${name}/${name}.vue`,
        external: ['vue'],
        output: {
          format: 'umd',
          name: capitalize(name),
          file: `dist/components/${name}/${name}.js`,
          banner: bannerTxt,
          exports: 'named',
          globals: {
            vue: 'Vue',
            "@": 'src'
          }
        },
        plugins: [
          node({
            extensions: ['.vue', '.js'],
            preferBuiltins: false
          }),
          cjs(),
          vue(vuePluginConfig),
          babel(babelConfig)
        ]
      }
    ]
  }

  let config = [
    {
      input: entries,
      external: ['vue'],
      output: {
        format: 'esm',
        dir: `dist/esm`
      },
      plugins: [
        node({
          extensions: ['.vue', '.js']
        }),
        vue(vuePluginConfig),
        babel(babelConfig),
        cjs()
      ]
    },
    {
      input: entries,
      external: ['vue'],
      output: {
        format: 'cjs',
        dir: 'dist/cjs',
        exports: 'named'
      },
      plugins: [
        node({
          extensions: ['.vue', '.js']
        }),
        vue(vuePluginConfig),
        babel(babelConfig),
        cjs()
      ]
    },
    {
      input: 'src/index.js',
      external: ['vue'],
      output: {
        format: 'umd',
        name: capitalize('vue-vocabulary'),
        file: 'dist/vue-vocabulary.js',
        exports: 'named',
        banner: bannerTxt,
        globals: {
          vue: 'Vue'
        }
      },
      plugins: [
        node({
          extensions: ['.vue', '.js']
        }),
        vue(vuePluginConfig),
        babel(babelConfig),
        cjs()
      ]
    },
    {
      input: 'src/index.js',
      external: ['vue'],
      output: {
        format: 'esm',
        file: 'dist/vue-vocabulary.esm.js',
        banner: bannerTxt
      },
      plugins: [
        node({
          extensions: ['.vue', '.js']
        }),
        vue(vuePluginConfig),
        babel(babelConfig),
        cjs()
      ]
    },
    // individual components
    ...components.map((f) => mapComponent(f)).reduce((r, a) => r.concat(a), [])
  ]

  if (process.env.MINIFY === 'true') {
    config = config.filter((c) => !!c.output.file)
    config.forEach((c) => {
      c.output.file = c.output.file.replace(/\.js/g, '.min.js')
      c.plugins.push(terser({
        output: {
          comments: '/^!/'
        }
      }))
    })
  }
  return config
}
