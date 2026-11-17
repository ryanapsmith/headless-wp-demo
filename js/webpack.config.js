import path from 'path';
import defaults from '@wordpress/scripts/config/webpack.config.js';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const config = {
    ...defaults,
    entry: {
        scripts: path.resolve(process.cwd(), 'src', 'index.tsx'),
        styles: path.resolve(process.cwd(), 'src', 'index.scss')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(process.cwd(), 'build'),
    },
    module: {
        ...defaults.module,
        rules: [
            ...defaults.module.rules,
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.json',
                            transpileOnly: true,
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', ...(defaults.resolve?.extensions || ['.js', '.jsx'])], // Optional chaining
    },
    plugins: [
        ...defaults.plugins,
        new MiniCssExtractPlugin({
            filename: '[name].css', // Output CSS filenames
        }),
    ],
};

export default config;