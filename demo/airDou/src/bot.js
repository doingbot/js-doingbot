import clipboardy from 'clipboardy';
import _ from "lodash";
import { TestUtil } from "debeem-utils";
import { DouDownloader } from "doingbot";
import { DouParser } from "doingbot";
import { DouImageUtil, DouNetworkUtil } from "doingbot";
import { DouFileUtil } from "doingbot";
import { PersistentQueue } from "doingbot";

let lastText = null;
const downloadQueue = new PersistentQueue();



async function downloadFromQueue()
{
	let success = false;

	const douParser = new DouParser();
	const clipboardElement = await downloadQueue.dequeue();
	if ( ! clipboardElement ||
		! _.isString( clipboardElement.value ) || _.isEmpty( clipboardElement.value ) )
	{
		return false;
	}

	const clipboardText = clipboardElement.value;
	const result = await douParser.parse( clipboardText );
	if ( ! result || ! result.type || ! Array.isArray( result.list ) )
	{
		return printLog( `downloadFromQueue :: failed to parse` );
	}
	if ( 0 === result.list.length )
	{
		return printLog( `downloadFromQueue :: empty download url list` );
	}

	if ( 'video' === result.type )
	{
		success = await downloadVideo( result );
	}
	else if ( `images` === result.type )
	{
		success = await downloadImage( result );
	}

	if ( success )
	{
		printLog( `downloadFromQueue :: download successfully : ${ clipboardText }` );
	}
	else
	{
		//	下载失败
		printLog( `downloadFromQueue :: failed to download : ${ clipboardText }` );
		await downloadQueue.enqueue( clipboardElement );
	}

	await TestUtil.sleep( 1000 );
}

async function downloadVideo( result )
{
	if ( ! result || ! result.type || 'video' !== result.type )
	{
		printLog( `downloadVideo :: invalid result` );
		return false;
	}
	if ( ! Array.isArray( result.list ) || 0 === result.list.length )
	{
		printLog( `downloadVideo :: empty result.list` );
		return false;
	}

	const urlToDownload = result.list[ 0 ][ 0 ];
	let filePathVideo = await DouNetworkUtil.computeFilenameByUrl( urlToDownload, undefined, true );
	//console.log( `will download ${ urlToDownload } to file ${ filename }` );
	if ( ! _.isString( filePathVideo ) || _.isEmpty( filePathVideo ) )
	{
		printLog( `downloadVideo :: failed to compute filePathVideo` );
		return false;
	}
	if ( filePathVideo.includes( '.unknown' ) )
	{
		printLog( `downloadVideo :: failed to compute filePathVideo unknown` );
		return false;
	}

	filePathVideo = `downloads/${ filePathVideo }`;
	if ( await DouFileUtil.fileExists( filePathVideo ) )
	{
		await DouFileUtil.deleteFile( filePathVideo );
	}

	printLog( `downloadVideo :: start download ${ urlToDownload }` );
	printLog( `downloadVideo :: save to ${ filePathVideo }` );
	const downloader = new DouDownloader({
		url: urlToDownload,
		outputPath: filePathVideo,
		numberOfThreads: 4,
		timeout: 30000,
	});
	try
	{
		await downloader.downloadWithSingleThreaded();
	}
	catch ( err ){}

	//	...
	return await DouFileUtil.fileExists( filePathVideo );
}

async function downloadImage( result )
{
	if ( ! result || ! result.type || 'images' !== result.type )
	{
		printLog( `downloadImage :: invalid result` );
		return false;
	}
	if ( ! Array.isArray( result.list ) || 0 === result.list.length )
	{
		printLog( `downloadImage :: empty result.list` );
		return false;
	}

	let successList = [];
	for ( const urlItemArray of result.list )
	{
		if ( ! Array.isArray( urlItemArray ) || 0 === urlItemArray.length )
		{
			continue;
		}

		for ( const urlToDownload of urlItemArray )
		{
			try
			{
				printLog( `downloadImage :: computeFilenameByUrl ${ urlToDownload }` );
				let filePathWebp = await DouNetworkUtil.computeFilenameByUrl( urlToDownload );
				let filePathPng = await DouNetworkUtil.computeFilenameByUrl( urlToDownload, `png` );
				//console.log( `will download ${ urlToDownload } to file ${ filePathWebp }` );
				//	    will download https://p3-sign.douyinpic.com/tos-cn-i-0813c001/ogCIdKafAn232Ngewo8GgnQD9A2dAnXbAAClAt~tplv-dy-aweme-images:q75.webp?x-expires=1724479200&x-signature=RWK%2FA9XEG0L6mNpoQfkmMDYI8Es%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=202407251430076C6CB98B85FA5C01CDFC to file downloads/3c539ad99facde7324fa53921fbe5c10e991dcd9061cd20463c1fe6828a6b121.webp
				if ( ! _.isString( filePathWebp ) || _.isEmpty( filePathWebp ) )
				{
					printLog( `downloadImage :: failed to compute filePathWebp` );
					continue;
				}
				if ( filePathWebp.includes( '.unknown' ) )
				{
					printLog( `downloadImage :: failed to compute filePathWebp unknown` );
					return false;
				}

				if ( ! _.isString( filePathPng ) || _.isEmpty( filePathPng ) )
				{
					printLog( `downloadImage :: failed to compute filePathPng` );
					continue;
				}
				if ( filePathPng.includes( '.unknown' ) )
				{
					printLog( `downloadImage :: failed to compute filePathPng unknown` );
					return false;
				}

				filePathWebp = `downloads/${ filePathWebp }`;
				filePathPng = `downloads/${ filePathPng }`;

				if ( await DouFileUtil.fileExists( filePathWebp ) )
				{
					await DouFileUtil.deleteFile( filePathWebp );
				}
				if ( await DouFileUtil.fileExists( filePathPng ) )
				{
					await DouFileUtil.deleteFile( filePathPng );
				}

				printLog( `downloadVideo :: start download ${ urlToDownload }` );
				const downloader = new DouDownloader({
					url: urlToDownload,
					outputPath: filePathWebp,
					numberOfThreads: 4,
					timeout: 30000,
				});
				try
				{
					await downloader.downloadWithSingleThreaded();
				}
				catch ( err ){}
				if ( ! await DouFileUtil.fileExists( filePathWebp ) )
				{
					printLog( `downloadImage :: failed to download image: ${ filePathWebp }` );
					continue;
				}

				await DouImageUtil.convert( filePathWebp, 'png', filePathPng );
				await DouFileUtil.deleteFile( filePathWebp );

				//	...
				successList.push( filePathWebp );
				break;
			}
			catch ( err )
			{
				//console.error( err );
			}
		}

		await TestUtil.sleep( 1000 );
	}

	//	...
	return successList.length === result.list.length;
}

function printLog( text )
{
	console.log( `[${ formatDateTime( new Date() ) }] ${ text }` );
}

function formatDateTime( date )
{
	const year = date.getFullYear();
	const month = String( date.getMonth() + 1 ).padStart( 2, '0' ); // 月份从 0 开始
	const day = String( date.getDate() ).padStart( 2, '0' );
	const hours = String( date.getHours() ).padStart( 2, '0' );
	const minutes = String( date.getMinutes() ).padStart( 2, '0' );
	const seconds = String( date.getSeconds() ).padStart( 2, '0' );

	return `${ year }-${ month }-${ day } ${ hours }:${ minutes }:${ seconds }`;
}



async function threadClipboardMonitor()
{
	const douParser = new DouParser();

	//	...
	const currentText = clipboardy.readSync();
	if ( currentText !== lastText )
	{
		lastText = currentText;
		if ( _.isString( lastText ) && !_.isEmpty( lastText ) && lastText.length < 256 )
		{
			const douUrl = douParser.extractDouYinUrl( lastText );
			if ( _.isString( douUrl ) && !_.isEmpty( douUrl ) )
			{
				await downloadQueue.enqueue({
					timestamp: new Date().getTime(),
					value: lastText,
				} );
				printLog( `detected ${ lastText }` );
			}
		}
	}
}

async function threadDownloader()
{
	await downloadFromQueue();
	setTimeout( threadDownloader, 100 );
}



/**
 * 	start
 */
(async () =>
{
	printLog( `start monitoring the clipboard` );
	setInterval( threadClipboardMonitor, 1000 );	//	每秒检查一次剪切板内容
	await threadDownloader();

})();