/* eslint-disable */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtrackPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
    const config = {
        entry: {
            index: __dirname + "/src/index.tsx"
        },
        devtool: "source-map",
        output: {
            path: __dirname + "/dist",
            filename: "[name].bundle.js"
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/i,
                    use: [MiniCssExtrackPlugin.loader, "css-loader"]
                }
            ]
        },
        resolve: {
            extensions: [ ".ts", ".tsx", ".js", ".jsx" ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtrackPlugin(),
            new HtmlWebpackPlugin({
                template: "src/note_ui.html",
                filename: "note_ui.html",
                chunks: ["index"],
            }),
            new copyWebpackPlugin({
                patterns: [
                    { from: "node_modules/quill/dist/quill.min.js", to: "third-party/quill.min.js" },
                    { from: "node_modules/quill/dist/quill.min.js.map", to: "third-party/quill.min.js.map" },
                    { from: "node_modules/react/umd/" + (argv.mode === "production" ? "react.production.min.js" : "react.development.js"), to: "third-party/react.js"},
                    { from: "node_modules/react-dom/umd/" + (argv.mode === "production" ? "react-dom.production.min.js" : "react-dom.development.js"), to: "third-party/react-dom.js"}
                ]
            })
            // new copyWebpackPlugin({
            //     patterns: [
            //         { from: "src/manifest.json" },
            //         {
            //             from: "src/icons/",
            //             to: "icons",
            //             toType: "dir"
            //         },
            //         {
            //             from: "src/_locales/",
            //             to: "_locales",
            //             toType: "dir"
            //         },
            //         { from: "node_modules/webextension-polyfill/dist/browser-polyfill.min.js" },
            //         { from: "node_modules/webextension-polyfill/dist/browser-polyfill.min.js.map" }
            //     ]
            // })
        ],
        externals: {
            "webextension-polyfill": "browser",
            "quill": "Quill",
            "react": "React",
            "react-dom": "ReactDOM",
        },
        optimization: {
            usedExports: true,
            minimizer: [
                new CssMinimizerWebpackPlugin(),
                new TerserWebpackPlugin()
            ]
        }
    }

    return config;
}
