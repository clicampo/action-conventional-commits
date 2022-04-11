import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: [{
        input: './src/main.ts',
        format: 'cjs',
        ext: 'cjs',
    }],
    outDir: 'dist',
    rollup: {
        inlineDependencies: true,
        commonjs: {

        },
    },

})
