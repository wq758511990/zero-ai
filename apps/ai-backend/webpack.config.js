const fs = require('fs');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const appDirectory = fs.realpathSync(process.cwd());
module.exports = function (options, webpack) {
  return {
    ...options,
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        src: path.resolve(appDirectory, 'src'),
      },
    },
    externals: [
      nodeExternals({
        allowlist: ['@repo/shared-constants'],
      }),
    ],
  };
};
