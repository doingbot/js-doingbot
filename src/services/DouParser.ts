import axios from "axios";
import { JSDOM, VirtualConsole } from 'jsdom';
import * as _ from "lodash";
import { ParseResult } from "../model/ParseModel";


//export const userAgent = 'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Mobile Safari/537.36';
export const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

export class DouParser
{
	virtualConsole = new VirtualConsole();

	constructor()
	{
		this.virtualConsole.on( 'error', ( error ) =>
		{
			//console.error( 'VirtualConsole error:', error );
		} );
		this.virtualConsole.on( 'log', ( message ) =>
		{
			//console.log( 'VirtualConsole log:', message );
		} );
		this.virtualConsole.on( 'warn', ( message ) =>
		{
			//console.warn( 'VirtualConsole warn:', message );
		} );
	}


	request( url : string, type ? : string ) : Promise<any>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				let option : any = {
					url,
					method : 'get',
					headers : {
						'user-agent' : userAgent,
					},
				};
				if ( type )
				{
					option.responseType = type;
				}

				resolve( axios( option ) );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}


	public parse( url : string ) : Promise<ParseResult>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( !_.isString( url ) || _.isEmpty( url ) )
				{
					return reject( `${ this.constructor.name }.parse :: invalid url` );
				}

				const pureUrl : string | null = this.extractDouYinUrl( url );
				if ( null === pureUrl )
				{
					return reject( `${ this.constructor.name }.parse :: invalid pureUrl` );
				}

				//	使用 axios 获取网页内容，并处理重定向
				const response = await axios.get( pureUrl, {
					maxRedirects : 5 // 设置允许的最大重定向次数
				} );
				//	创建一个 JSDOM 实例，并提供获取到的 HTML 内容
				const dom = new JSDOM( response.data, {
					runScripts : "dangerously",
					resources : "usable",
					url : response.request.res.responseUrl, // 使用最终的 URL 作为来源
					virtualConsole : this.virtualConsole
				} );

				dom.window.onerror = ( message, source, lineno, colno, error ) =>
				{
					//console.error( 'Global error handler:', message, source, lineno, colno, error );
					return true; // 阻止错误的默认处理
				};

				//	等待脚本执行完成
				dom.window.addEventListener( 'load', async () =>
				{
					//	获取 document 对象
					const document = dom.window.document;
					const loc = dom.window.location;

					//	打印最终的 HTML 内容
					//console.log( document );
					//console.log( loc, loc.href );
					//console.log( dom.serialize() );
					const nextUrl = _.cloneDeep( loc?.href );

					//	销毁 JSDOM 实例以释放内存
					//(dom.window as any) = null;
					//	强制垃圾回收（需要启用 Node.js 垃圾回收标志）
					//(global as any).gc && (global as any).gc();

					//	...
					const result = await this.parseResource( nextUrl );
					resolve( result );
				} );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	public extractDouYinUrl( text : string ) : string | null
	{
		if ( ! _.isString( text ) || _.isEmpty( text ) )
		{
			return null;
		}

		//	定义要匹配的 URL 前缀
		const urlPrefix : string = 'https://v.douyin.com/';

		//	创建正则表达式来匹配包含特定前缀的 URL
		const urlPattern : RegExp = new RegExp( `(${urlPrefix}[\\w/]+)`, 'i' );

		//	在文本中查找匹配的 URL
		const match = text.match( urlPattern );

		//	如果找到了匹配的 URL，则返回它；否则返回 null
		return ( Array.isArray( match ) && match.length > 0 ) ? match[ 0 ] : null;
	}

	private parseResource( url : string ) : Promise<ParseResult>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( !_.isString( url ) || _.isEmpty( url ) )
				{
					return reject( `${ this.constructor.name }.parseResource :: invalid url` );
				}

				//	使用 axios 获取网页内容，并处理重定向
				const response = await axios.get( url, {
					maxRedirects : 5 // 设置允许的最大重定向次数
				} );
				// 	创建一个 JSDOM 实例，并提供获取到的 HTML 内容
				const dom = new JSDOM( response.data, {
					runScripts : "dangerously",
					resources : "usable",
					url : response.request.res.responseUrl, // 使用最终的 URL 作为来源
					virtualConsole : this.virtualConsole
				} );

				// 	等待脚本执行完成
				dom.window.addEventListener( 'load', async () =>
				{
					// 	获取 document 对象
					const document = dom.window.document;
					const loc = dom.window.location;
					const routerData = dom.window._ROUTER_DATA;

					//	打印最终的 HTML 内容
					//console.log( loc, loc.href );
					let resType = `unknown`;
					let resultUrlList : string[][] = [];
					let videoPage : any = undefined;
					let notePage : any = undefined;

					if ( ! routerData ||
						! _.has( routerData, `loaderData` ) ||
						! routerData[ 'loaderData' ] )
					{
						return resolve({
							type : resType,
							list : [],
						});
					}

					const loaderData = routerData[ 'loaderData' ];
					if ( _.has( loaderData, `video_(id)/page` ) )
					{
						videoPage = loaderData[ 'video_(id)/page' ];
					}
					if ( _.has( loaderData, `note_(id)/page` ) )
					{
						notePage = loaderData[ 'note_(id)/page' ];
					}

					if ( videoPage )
					{
						resType = `video`;
						resultUrlList = await this.extractVideoList( videoPage );
					}
					else if ( notePage )
					{
						resType = `images`;
						resultUrlList = await this.extractImageList( notePage );
					}

					//	销毁 JSDOM 实例以释放内存
					//(dom.window as any) = null;
					//	强制垃圾回收（需要启用 Node.js 垃圾回收标志）
					//(global as any).gc && (global as any).gc();

					resolve( {
						type : resType,
						list : resultUrlList,
					} );
				} );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	private extractVideoList( videoPage : any ) : Promise<Array<Array<string>>>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! videoPage )
				{
					return reject( `${ this.constructor.name }.extractVideoList :: invalid videoPage` );
				}
				if ( ! videoPage[ 'videoInfoRes' ] )
				{
					return reject( `${ this.constructor.name }.extractVideoList :: invalid videoPage.videoInfoRes` );
				}

				let urlList : Array<Array<string>> = [];
				const itemList = videoPage[ 'videoInfoRes' ][ 'item_list' ];
				if ( !Array.isArray( itemList ) || 0 === itemList.length )
				{
					return resolve( [] );
				}

				for ( const item of itemList )
				{
					if ( ! item ||
						! item[ 'video' ] ||
						! item[ 'video' ][ 'play_addr' ] )
					{
						continue;
					}

					const videoUrlList = item[ 'video' ][ 'play_addr' ][ 'url_list' ];
					if ( !Array.isArray( videoUrlList ) || 0 === videoUrlList.length )
					{
						continue;
					}
					for ( const videoUrl of videoUrlList )
					{
						const newVUrl = videoUrl.replace( "playwm", "play" );
						urlList.push( [ newVUrl ] );
					}
				}

				resolve( urlList );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	private extractImageList( notePage : any ) : Promise<Array<Array<string>>>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! notePage )
				{
					return reject( `${ this.constructor.name }.extractImageList :: invalid notePage` );
				}
				if ( ! notePage[ 'videoInfoRes' ] )
				{
					return reject( `${ this.constructor.name }.extractImageList :: invalid notePage.videoInfoRes` );
				}

				let urlList : Array<Array<string>> = [];
				const itemList = notePage[ 'videoInfoRes' ][ 'item_list' ];
				if ( !Array.isArray( itemList ) || 0 === itemList.length )
				{
					return resolve( [] );
				}
				for ( const item of itemList )
				{
					if ( ! item )
					{
						continue;
					}

					const images = item[ 'images' ];
					if ( ! Array.isArray( images ) || 0 === images.length )
					{
						continue;
					}
					for ( const imageItem of images )
					{
						const imageItemUrlList = imageItem[ 'url_list' ];
						if ( !Array.isArray( imageItemUrlList ) || 0 === imageItemUrlList.length )
						{
							continue;
						}

						urlList.push( imageItemUrlList );
					}
				}

				resolve( urlList );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}
}