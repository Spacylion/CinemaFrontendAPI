export type BuildNode = "production" | "development"

export interface BuildPaths {
  build: string
  entry: string
  output: string
  html: string
}

export interface BuildOptions {
  mode: BuildNode
  paths: BuildPaths
  isDev: boolean
}
