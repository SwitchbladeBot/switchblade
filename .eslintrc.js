module.exports = {
    'env': {
        'es2021': true,
        'node': true,
    },
    'extends': [
        'google',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module',
    },
    'plugins': [
        '@typescript-eslint',
    ],
    'rules': {
        'indent': [2, 4],
        'object-curly-spacing': [2, 'always', {
            'objectsInObjects': true,
            'arraysInObjects': true,
        }],
        'require-jsdoc': 0,
        'semi': [2, 'always'],
        'max-len': [1, 120],
    },
};