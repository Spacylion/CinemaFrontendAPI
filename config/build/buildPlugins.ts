import HTMLWebpackPlugin from "html-webpack-plugin"
import path from "path"
import webpack, { ProgressPlugin } from "webpack"
import { BuildOptions } from "./types/config"

export function buildPlugins({
  paths,
}: BuildOptions): webpack.WebpackPluginInstance[] {
  return [
    new HTMLWebpackPlugin({
      template: paths.html,
    }),
    new ProgressPlugin(),
  ]
}
