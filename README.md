<div align="center">
  
# webpack-loader-s3

[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/BetaHuhn/webpack-loader-s3/blob/master/LICENSE) ![David](https://img.shields.io/david/betahuhn/webpack-loader-s3) [![npm](https://img.shields.io/npm/v/webpack-loader-s3)](https://www.npmjs.com/package/webpack-loader-s3)

Webpack loader which uploads local file references in HTML and other files to an S3 bucket and replaces them with a CDN endpoint in the production build.

</div>

## 👋 Introduction

During development, [webpack-loader-s3](https://github.com/BetaHuhn/webpack-loader-s3) copies all your assets to the output directory on your local machine. When `NODE_ENV` is set to `production` the assets will be uploaded to a S3 Bucket and all references (js imports or in HTML) will be replaced with the S3 location or an optional CDN endpoint.

## 🚀 Get started

Install [webpack-loader-s3](https://github.com/BetaHuhn/webpack-loader-s3) via npm:
```shell
npm install webpack-loader-s3
```

## 📚 Usage

Add `webpack-loader-s3` to your `webpack.config.js` file:

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
                loader: 'webpack-loader-s3',
                options: {
                    // options (more info below)
                },
            }
        ]
    }
}
```

Then run `webpack-loader-s3` via your preferred method.

## ⚙️ Configuration

**Required options:**

- *endpoint* - domain of your S3 endpoint ([more info](#endpoint))
- *bucket* - your S3 bucket name ([more info](#bucket))
- *access_key* - your S3 access key ([more info](#access_key))
- *secret_key* - your S3 secret key ([more info](#secret_key))

**Optional:**

- *cdn* - endpint of your cdn ([more info](#cdn))
- *region* - region of your S3 bucket ([more info](#region))
- *permission* - ACL file permission (default: public-read) ([more info](#permission))
- *name* - filename template for the target file(s) ([more info](#name))
- *outputPath* - a filesystem path where the target file(s) will be placed ([more info](#outputpath))
- *context* - a custom file context ([more info](#context))
- *regExp* - a Regular Expression to one or many parts of the target file path ([more info](#regexp))
- *esModule* - generate JS modules that use the ES modules syntax (default: true) ([more info](#esmodule))

**Detailed:**

### `endpoint`

Type: `String`
Required: *true*

Specifies the endpoint of your S3 bucket. For example if you are using DigitalOcean Spaces:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'webpack-loader-s3',
        options: {
          endpoint: 'fra1.digitaloceanspaces.com',
        },
      },
    ],
  },
};
```

### `bucket`

Type: `String`
Required: *true*

Specifies the name of your S3 bucket:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'webpack-loader-s3',
        options: {
          bucket: 'bucket-name',
        },
      },
    ],
  },
};
```

### `access_key`

Type: `String`
Required: *true*

Specifies your S3 Access Key, sometimes also called `accessKeyId`:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'webpack-loader-s3',
        options: {
          access_key: 'bucket-name',
        },
      },
    ],
  },
};
```

### `secret_key`

Type: `String`
Required: *true*

Specifies your S3 Secret Access Key:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'webpack-loader-s3',
        options: {
          secret_key: 'bucket-name',
        },
      },
    ],
  },
};
```

### `cdn`

Type: `String`
Required: *false*

Specify a different domain which will be used instead of your S3 endpoint. If you use DigitalOcean Spaces, this can be your CDN endpoint:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'webpack-loader-s3',
        options: {
          cdn: 'fra1.cdn.digitaloceanspaces.com',
        },
      },
    ],
  },
};
```

### `region`

Type: `String`
Required: *false*

If your S3 endpoint doesn't include a region and you are using Amazon's S3, specify the region like this:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'webpack-loader-s3',
        options: {
          region: 'nyc3',
        },
      },
    ],
  },
};
```

### `permission`

Type: `String`
Required: *false*
Default: `public-read`

Specifies the ACL file permission which will be set when your files are uploaded to your Bucket. If you want to make your files private:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'webpack-loader-s3',
        options: {
          permission: 'private',
        },
      },
    ],
  },
};
```

### `name`

Type: `String|Function`
Default: `'[contenthash].[ext]'`

Specifies a custom filename template for the target file(s) using the query
parameter `name`. For example, to emit a file from your `context` directory into
the output directory retaining the full directory structure, you might use:

#### `String`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'webpack-loader-s3',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'webpack-loader-s3',
        options: {
          name(resourcePath, resourceQuery) {
            // `resourcePath` - `/absolute/path/to/file.js`
            // `resourceQuery` - `?foo=bar`

            if (process.env.NODE_ENV === 'development') {
              return '[path][name].[ext]';
            }

            return '[contenthash].[ext]';
          },
        },
      },
    ],
  },
};
```

> ℹ️ By default the path and name you specify will output the file in that same directory, and will also use the same URI path to access the file.

### `outputPath`

Type: `String|Function`
Default: `undefined`

Specify a filesystem path where the target file(s) will be placed.

#### `String`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'webpack-loader-s3',
        options: {
          outputPath: 'images',
        },
      },
    ],
  },
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'webpack-loader-s3',
        options: {
          outputPath: (url, resourcePath, context) => {
            // `resourcePath` is original absolute path to asset
            // `context` is directory where stored asset (`rootContext`) or `context` option

            // To get relative path you can use
            // const relativePath = path.relative(context, resourcePath);

            if (/my-custom-image\.png/.test(resourcePath)) {
              return `other_output_path/${url}`;
            }

            if (/images/.test(context)) {
              return `image_output_path/${url}`;
            }

            return `output_path/${url}`;
          },
        },
      },
    ],
  },
};
```

### `context`

Type: `String`
Default: [`context`](https://webpack.js.org/configuration/entry-context/#context)

Specifies a custom file context.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'webpack-loader-s3',
            options: {
              context: 'project',
            },
          },
        ],
      },
    ],
  },
};
```

### `regExp`

Type: `RegExp`
Default: `undefined`

Specifies a Regular Expression to one or many parts of the target file path.
The capture groups can be reused in the `name` property using `[N]`
[placeholder](https://github.com/webpack-contrib/webpack-loader-s3#placeholders).

**photo.png**

```html
<img src="./assets/photo.png">
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'webpack-loader-s3',
            options: {
              regExp: /\/([a-z0-9]+)\/[a-z0-9]+\.png$/i,
              name: '[1]-[name].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

> ℹ️ If `[0]` is used, it will be replaced by the entire tested string, whereas `[1]` will contain the first capturing parenthesis of your regex and so on...

### `esModule`

Type: `Boolean`
Default: `true`

By default, `webpack-loader-s3` generates JS modules that use the ES modules syntax.
There are some cases in which using ES modules is beneficial, like in the case of [module concatenation](https://webpack.js.org/plugins/module-concatenation-plugin/) and [tree shaking](https://webpack.js.org/guides/tree-shaking/).

You can enable a CommonJS module syntax using:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'webpack-loader-s3',
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
};
```

## 🏷️ Placeholders

Find more information about placeholders [here](https://github.com/webpack/loader-utils#interpolatename).

### `[ext]`

Type: `String`
Default: `file.extname`

The file extension of the target file/resource.

### `[name]`

Type: `String`
Default: `file.basename`

The basename of the file/resource.

### `[path]`

Type: `String`
Default: `file.directory`

The path of the resource relative to the webpack/config `context`.

### `[folder]`

Type: `String`
Default: `file.folder`

The folder of the resource is in.

### `[query]`

Type: `String`
Default: `file.query`

The query of the resource, i.e. `?foo=bar`.

### `[emoji]`

Type: `String`
Default: `undefined`

A random emoji representation of `content`.

### `[emoji:<length>]`

Type: `String`
Default: `undefined`

Same as above, but with a customizable number of emojis

### `[hash]`

Type: `String`
Default: `md4`

Specifies the hash method to use for hashing the file content.

### `[contenthash]`

Type: `String`
Default: `md4`

Specifies the hash method to use for hashing the file content.

### `[<hashType>:hash:<digestType>:<length>]`

Type: `String`

The hash of options.content (Buffer) (by default it's the hex digest of the hash).

#### `digestType`

Type: `String`
Default: `'hex'`

The [digest](https://en.wikipedia.org/wiki/Cryptographic_hash_function) that the
hash function should use. Valid values include: base26, base32, base36,
base49, base52, base58, base62, base64, and hex.

#### `hashType`

Type: `String`
Default: `'md4'`

The type of hash that the has function should use. Valid values include: `md4`, `md5`, `sha1`, `sha256`, and `sha512`.

#### `length`

Type: `Number`
Default: `undefined`

Users may also specify a length for the computed hash.

### `[N]`

Type: `String`
Default: `undefined`

The n-th match obtained from matching the current file name against the `regExp`.


## 🛠️ Examples

Here are some examples on how to use [webpack-loader-s3](https://github.com/BetaHuhn/webpack-loader-s3):

`logo.png` file stored locally in the working directory under `/assets`.

Reference it in the HTML page:

```html
<img src="./assets/logo.png">
```

### Basic

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'webpack-loader-s3',
        options: {
            endpoint: 'fra1.digitaloceanspaces.com',
            access_key: 'xxxxxxxxxxxxxxxxxxx',
            secret_key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            bucket: 'bucket-name'
        },
      },
    ],
  },
};
```

When `NODE_ENV` is set to `production`, the file `logo.png` is uploaded to the S3 bucket and the relative path is replaced with the URL of file stored in S3:

```html
<img src="https://bucket-name.fra1.digitaloceanspaces.com/assets/26bd867dd65e26dbc77d1e151ffd36e0.png">
```

---

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'webpack-loader-s3',
        options: {
            name: '[name].[ext]',
            outputPath: 'images',
            endpoint: 'fra1.digitaloceanspaces.com',
            access_key: 'xxxxxxxxxxxxxxxxxxx',
            secret_key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            bucket: 'bucket-name'
        },
      },
    ],
  },
};
```

Result:

```html
<img src="https://bucket-name.fra1.digitaloceanspaces.com/images/logo.png">
```

### CDN

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'webpack-loader-s3',
        options: {
            endpoint: 'fra1.digitaloceanspaces.com',
            cdn: 'cdn.example.com',
            access_key: 'xxxxxxxxxxxxxxxxxxx',
            secret_key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            bucket: 'bucket-name'
        },
      },
    ],
  },
};
```

When `NODE_ENV` is set to `production`, the file `logo.png` is uploaded to the S3 bucket and the relative path is replaced with the URL of file stored in S3 and served via the CDN endpoint:

```html
<img src="https://cdn.example.com/assets/26bd867dd65e26dbc77d1e151ffd36e0.png">
```

## 📝 To do

Here is what's currently planned for [webpack-loader-s3](https://github.com/BetaHuhn/webpack-loader-s3):

- **Optimize images:** convert images to next-gen formats like webp in production mode

## 💻 Development

Issues and PRs are very welcome!

Please check out the [contributing guide](CONTRIBUTING.md) before you start.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). To see differences with previous versions refer to the [CHANGELOG](CHANGELOG.md).

## ❔ About

This library was developed by me ([@betahuhn](https://github.com/BetaHuhn)) in my free time. If you want to support me:

[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=394RTSBEEEFEE)

### Credits

The loader is based on [file-loader](https://github.com/webpack-contrib/file-loader).

## License

Copyright 2020 Maximilian Schiller

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
