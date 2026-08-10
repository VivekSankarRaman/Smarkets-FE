import { defineConfig } from "@rspack/cli";
import { rspack, type SwcLoaderOptions } from "@rspack/core";
import { ReactRefreshRspackPlugin } from "@rspack/plugin-react-refresh";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  entry: {
    main: "./src/main.tsx",
  },
  target: ["browserslist:last 2 versions, > 0.2%, not dead, Firefox ESR"],
  output: {
    publicPath: "/",
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: "asset",
      },
      {
        test: /\.css$/,
        type: "css/auto",
      },
      {
        test: /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              detectSyntax: "auto",
              jsc: {
                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
            } satisfies SwcLoaderOptions,
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true, // ← add this
    proxy: [
      {
        context: ["/api"],
        target: "https://api.smarkets.com",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
        on: {
          proxyReq: (proxyReq) => {
            proxyReq.removeHeader("origin");
            proxyReq.removeHeader("referer");
          },
        },
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    isDev && new ReactRefreshRspackPlugin(),
  ],
});
