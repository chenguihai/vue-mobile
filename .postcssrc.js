// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
	plugins: {
		'postcss-import': {},
		'postcss-url': {},
		// to edit target browsers: use "browserslist" field in package.json
		autoprefixer: {
			browsers: ['Android >= 4.0', 'iOS >= 7']
		},
		'postcss-plugin-px2rem': {
			rootValue: 75,
			minPixelValue: 3,
			// mediaQuery: true,
			exclude: '/node_modules/i',
			selectorBlackList: ['van-']
			// propBlackList: ['border']
		}
	}
}
