import { Web3Digester } from "debeem-id";
import _ from "lodash";
import axios from "axios";
import { ifError } from "assert";


/**
 * 	@class
 */
export class DouNetworkUtil
{
	/**
	 *	compute file hash by url
	 *
	 * 	@param url			{string}
	 * 	@param [specifiedExtension]	{string} use user specified file extension
	 * 	@returns {Promise< string >}
	 */
	public static computeFilenameByUrl( url : string, specifiedExtension ?: string ) : Promise<string>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( url ) || _.isEmpty( url ) )
				{
					return reject( `DouNetworkUtil.computeFileHashByUrl :: invalid url` );
				}

				//	"https://p26-sign.douyinpic.com/tos-cn-i-0813c001/oQgAEBAFuEAfC7AAZ6BMLqIZPpzeDfPEGVGNWY~tplv-dy-lqen-new:1024:8194:q80.webp?x-expires=1724439600&x-signature=PwrTcjz6qsGKYJmWUczTAqAr0SI%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072503261012EBB9526B6FE32CB9D4";
				const parsedUrl = new URL( url );

				//	"/tos-cn-i-0813c001/oQgAEBAFuEAfC7AAZ6BMLqIZPpzeDfPEGVGNWY~tplv-dy-lqen-new:1024:8194:q80.webp"
				const pathname : string = parsedUrl.pathname;
				if ( ! _.isString( pathname ) || _.isEmpty( pathname ) )
				{
					return reject( `DouNetworkUtil.computeFileHashByUrl :: failed to parse url` );
				}
				//	...
				const keccakHash = ( await Web3Digester.hashObject( {
					timestamp : 1,
					wallet : `0x47b506704da0370840c2992a3d3d301fd3c260d3`,
					pathname : pathname
				} ) ).replace( /^0x/, '' ).trim().toLowerCase();
				let filename : string = ``;
				if ( _.isString( specifiedExtension ) && ! _.isEmpty( specifiedExtension ) )
				{
					filename = `${ keccakHash }.${ specifiedExtension.trim().toLowerCase() }`;
				}
				else
				{
					// 	发送 HEAD 请求来获取响应头
					const contentType : string | null = await this.detectContentTypeByUrl( url );
					const fileExt : string = this.getFileExtensionByContentType( contentType );

					filename = `${ keccakHash }.${ fileExt }`;
				}

				//	will return a string having a length of 64
				resolve( filename );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	detect content type by url
	 *	@param url	{string}
	 *	@returns {Promise< string >}
	 */
	public static detectContentTypeByUrl( url : string ) : Promise< string >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			let contentType = ``;
			try
			{
				const response = await axios.head( url );
				contentType = response.headers[ 'content-type' ];
			}
			catch ( err )
			{
			}

			resolve( contentType );
		});
	}

	/**
	 *	get file extension by ContentType
	 *	@param contentType	{string}
	 *	@returns {string}
	 */
	public static getFileExtensionByContentType( contentType : string ) : string
	{
		const mimeToExtensions: Record<string, string> =
		{
			//	视频文件
			'video/mp4': 'mp4',
			'video/webm': 'webm',
			'video/ogg': 'ogv',
			'video/quicktime': 'mov',
			'video/x-matroska': 'mkv',
			'video/x-flv': 'flv',
			'video/x-msvideo': 'avi',
			'video/x-ms-wmv': 'wmv',

			//	图片文件
			'image/jpeg': 'jpg',
			'image/png': 'png',
			'image/gif': 'gif',
			'image/bmp': 'bmp',
			'image/svg+xml': 'svg',
			'image/tiff': 'tif',
			'image/webp': 'webp',

			//	音频文件
			'audio/mpeg': 'mp3',
			'audio/wav': 'wav',
			'audio/ogg': 'ogg',
			'audio/aac': 'aac',
			'audio/mp4': 'm4a',
			'audio/x-midi': 'midi',

			//	文档文件
			'application/pdf': 'pdf',
			'application/msword': 'doc',
			'application/vnd.ms-excel': 'xls',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
			'application/zip': 'zip',
			'application/x-rar-compressed': 'rar',
			'application/x-tar': 'tar',

			//	其他常见类型
			'text/plain': 'txt',
			'text/html': 'html',
			'text/css': 'css',
			'text/javascript': 'js',
			'application/json': 'json',
			'application/xml': 'xml',
			'application/x-shockwave-flash': 'swf',
		};

		if ( _.isString( contentType ) && ! _.isEmpty( contentType ) )
		{
			contentType = contentType.trim().toLocaleString();
			if ( _.has( mimeToExtensions, contentType ) )
			{
				return mimeToExtensions[ contentType ];
			}
		}

		return 'unknown';
	}
}