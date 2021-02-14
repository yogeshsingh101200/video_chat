const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = function override(config, env) {
    config.plugins.push(
        new FilterWarningsPlugin({
            exclude: /Critical dependency:/
        })
    );
    return config;
};