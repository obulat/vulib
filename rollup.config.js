import vue from 'rollup-plugin-vue'
// import peerDepsExternal from "rollup-plugin-peer-deps-external";
import babel from '@rollup/plugin-babel';
import node from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import packageJson from "./package.json";
import fs from 'fs';
import path from 'path';


const bannerTxt = `/*! Vue Vocabulary v${packageJson.version} | MIT License | github.com/creativecommons/vocabulary */`

const baseFolder = './src/'
const componentsFolder = 'elements/'

const components = fs
  .readdirSync(baseFolder + componentsFolder)
  .filter((f) =>
    fs.statSync(path.join(baseFolder + componentsFolder, f)).isDirectory()
  )

const entries = {
  'index': './src/index.js',
  'helpers': './src/utils/helpers.js',
  ...components.reduce((obj, name) => {
    obj[name] = (baseFolder + componentsFolder + name)
    return obj
  }, {})
}

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
  }
}
const babelConfig = {
  exclude: 'node_modules/**',
  babelHelpers: 'runtime',
  babelrc: false,
  presets: [['@babel/preset-env', { modules: false }]]
}

export default () => {
  const mapComponent = (name) => {
    return [
      {
        input: baseFolder + componentsFolder + `${name}/index.js`,
        external: ['vue'],
        output: {
          format: 'umd',
          name: capitalize(name),
          file: `dist/components/${name}/index.js`,
          banner: bannerTxt,
          exports: 'named',
          globals: {
            vue: 'Vue'
          }
        },
        plugins: [
          node({
            extensions: ['.vue', '.js']
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
        name: capitalize('VueVocabulary'),
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

  return config
}
