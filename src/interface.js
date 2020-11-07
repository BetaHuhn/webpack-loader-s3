const AWS = require('aws-sdk')

class S3Interface {
	constructor(config) {
		this.bucket = config.bucket
		this.permission = config.permission

		const endpoint = new AWS.Endpoint(config.endpoint)
		const s3 = new AWS.S3({
			endpoint: endpoint,
			accessKeyId: config.access_key,
			secretAccessKey: config.secret_key
		})

		this.s3 = s3
	}

	async upload(file, path) {
		return new Promise((resolve, reject) => {

			const options = {
				Body: file,
				Bucket: this.bucket,
				Key: path,
				ACL: this.permission
			}

			this.s3.upload(options, (err, data) => {
				if (err) {
					return reject(err)
				}

				resolve(data)
			})
		})
	}
}

module.exports = S3Interface