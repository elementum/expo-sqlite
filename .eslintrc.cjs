module.exports = {
    extends: './node_modules/@elementum/linter/.eslintrc.js',
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    ignorePatterns: ['.eslintrc.js', '.eslintrc.cjs'],
}
