import typescript from '@rollup/plugin-typescript'
// import typescript from 'rollup-plugin-typescript2' // npm install rollup-plugin-typescript2 typescript tslib --save-dev
import clear from 'rollup-plugin-clear'
import { terser } from "rollup-plugin-terser"

export default {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm'
    },
    external: [ 'recoil', 'immer', 'uuid' ],
    plugins: [
        terser(),
        typescript({
            tsconfig: 'tsconfig.build.json',
    }),
        clear({
            targets: ['dist']
        })
    ]
  };