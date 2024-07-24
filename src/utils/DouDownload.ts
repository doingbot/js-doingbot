import axios from "axios";
import { JSDOM } from 'jsdom';
import _ from "lodash";


//export const userAgent = 'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Mobile Safari/537.36';
export const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

export class DouDownload
{
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

	down3( url : string )
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				//	使用 axios 获取网页内容，并处理重定向
				const response = await axios.get( url, {
					maxRedirects : 5 // 设置允许的最大重定向次数
				} );
				// 	创建一个 JSDOM 实例，并提供获取到的 HTML 内容
				const dom = new JSDOM( response.data, {
					runScripts : "dangerously",
					resources : "usable",
					url : response.request.res.responseUrl // 使用最终的 URL 作为来源
				} );

				// 	等待脚本执行完成
				dom.window.addEventListener( 'load', () =>
				{
					// 	获取 document 对象
					const document = dom.window.document;
					const loc = dom.window.location;
					const routerData = dom.window._ROUTER_DATA;

					//	打印最终的 HTML 内容
					//console.log( loc, loc.href );
					let resultUrlList = [];
					const itemList = routerData?.[ 'loaderData' ]?.[ 'video_(id)/page' ]?.[ 'videoInfoRes' ]?.[ 'item_list' ];
					if ( Array.isArray( itemList ) )
					{
						for ( const item of itemList )
						{
							const urlList = item?.['video']?.['play_addr']?.[ 'url_list' ];
							if ( Array.isArray( urlList ) )
							{
								for ( const url of urlList )
								{
									resultUrlList.push( url );
								}
							}
						}
					}

					//    [
					//       'https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0300fg10000cqee10vog65lf7o431eg&ratio=720p&line=0'
					//     ]
					console.log( resultUrlList );

					resolve( null );
				} );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	down2( url : string )
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				// 使用 axios 获取网页内容，并处理重定向
				const response = await axios.get( url, {
					maxRedirects : 5 // 设置允许的最大重定向次数
				} );
				// 创建一个 JSDOM 实例，并提供获取到的 HTML 内容
				const dom = new JSDOM( response.data, {
					runScripts : "dangerously",
					resources : "usable",
					url : response.request.res.responseUrl // 使用最终的 URL 作为来源
				} );

				// 等待脚本执行完成
				dom.window.addEventListener( 'load', async () =>
				{
					// 获取 document 对象
					const document = dom.window.document;
					const loc = dom.window.location;

					// 打印最终的 HTML 内容
					//console.log( document );
					console.log( loc, loc.href );
					//console.log( dom.serialize() );
					await this.down3( loc.href );

					resolve( null );
				} );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	downloadVideo( shareUrl : string )
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				console.log( `downloadVideo :: start : ${ shareUrl }` );
				//	1.根据分享的视频地址，通过重定向获取整个html信息
				const { data : html } = await this.request( shareUrl );
				const dom = new JSDOM(
					html,
					{
						runScripts : "dangerously",
						resources : "usable",
						url : shareUrl,
					}
				);
				dom.window.addEventListener( 'load', () =>
				{
					// const doc = dom.window.document;
					// const domHtml = dom.serialize();
					// console.log( domHtml );
					// //console.log( doc );

					// 获取 sessionStorage 对象
					const sessionStorage = dom.window.sessionStorage;

					// 迭代 sessionStorage 中的所有键值对并打印
					for ( let i = 0; i < sessionStorage.length; i++ )
					{
						const key = sessionStorage.key( i );
						if ( !_.isString( key ) )
						{
							continue;
						}

						const value = sessionStorage.getItem( key );
						console.log( `${ key }: ${ value }` );
					}
				} );


				//	2.截取itemId， dytk 发起二次请求获取uriId
				const itemId = html.match( /(?<=itemId:\s\")\d+(?=\")/g )[ 0 ];
				const dytk = html.match( /(?<=dytk:\s\")(.*?)(?=\")/g )[ 0 ];
				const long_url = `https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${ itemId }&dytk=${ dytk }`;

				console.log( `itemId : `, itemId );
				console.log( `dytk : `, dytk );
				console.log( `long_url : `, long_url );

				const { data : videoJson } = await this.request( long_url );

				// 3.最后通过uri参数来调用视频下载接口
				const uriId = videoJson.item_list[ 0 ].video.play_addr.uri;
				const share_title = videoJson.item_list[ 0 ].share_info.share_title;
				const noWatermarkUrl = `https://aweme.snssdk.com/aweme/v1/play/?video_id=${ uriId }&line=0&ratio=540p&media_type=4&vr_type=0&improve_bitrate=0&is_play_url=1&is_support_h265=0&source=PackSourceEnum_PUBLISH`;
				const { data : videoStream } = await this.request( noWatermarkUrl, 'stream' );
				return { videoStream, share_title };
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}
}