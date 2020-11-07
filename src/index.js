import path from 'path'
import { getOptions, interpolateName } from 'loader-utils'
import { validate } from 'schema-utils'

import pgk from '../package.json'
import schema from './options.json'
import { normalizePath } from './utils'
import S3Interface from './interface'

let s3

export default function loader(content) {
	const callback = this.async()
	const options = getOptions(this)

	const isProduction = process.env.NODE_ENV === 'production'

	validate(schema, options, {
		name: pgk.name,
		baseDataPath: 'options'
	})

	const context = options.context || this.rootContext
	const name = options.name || '[contenthash].[ext]'

	const url = interpolateName(this, name, {
		context,
		content,
		regExp: options.regExp
	})

	let outputPath = url
	if (options.outputPath) {
		if (typeof options.outputPath === 'function') {
			outputPath = options.outputPath(url, this.resourcePath, context)
		} else {
			outputPath = path.posix.join(options.outputPath, url)
		}
	}

	let publicPath = isProduction ? outputPath : `__webpack_public_path__ + ${ JSON.stringify(outputPath) }`
	if (options.publicPath) {
		if (typeof options.publicPath === 'function') {
			publicPath = options.publicPath(url, this.resourcePath, context)
		} else {
			publicPath = `${
				options.publicPath.endsWith('/') ? options.publicPath : `${ options.publicPath }/`
			}${ url }`
		}

		if (!isProduction) {
			publicPath = JSON.stringify(publicPath)
		}
	}

	const esModule = typeof options.esModule !== 'undefined' ? options.esModule : true

	if (isProduction) {
		if (s3 === undefined) {
			const config = {
				endpoint: options.endpoint,
				bucket: options.bucket,
				access_key: options.access_key,
				secret_key: options.secret_key,
				permission: options.permission || 'public-read'
			}
			s3 = new S3Interface(config)
		}

		s3.upload(content, publicPath)
			.then((data) => {
				let location = data['Location']
				if (options.cdn) {
					location = `${ options.cdn }/${ data['key'] }`
				}
				callback(null, `${ esModule ? 'export default' : 'module.exports =' } ${ JSON.stringify(location) };`)
			})
			.catch((err) => {
				callback(err)
			})
		return
	}

	const assetInfo = {}
	if (typeof name === 'string') {
		let normalizedName = name

		const idx = normalizedName.indexOf('?')

		if (idx >= 0) {
			normalizedName = normalizedName.substr(0, idx)
		}

		const isImmutable = (/\[([^:\]]+:)?(hash|contenthash)(:[^\]]+)?]/gi).test(normalizedName)

		if (isImmutable === true) {
			assetInfo.immutable = true
		}
	}

	assetInfo.sourceFilename = normalizePath(
		path.relative(this.rootContext, this.resourcePath)
	)

	this.emitFile(outputPath, content, null, assetInfo)

	callback(null, `${ esModule ? 'export default' : 'module.exports =' } ${ publicPath };`)
	return
}

export const raw = true