import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { createWriteStream, WriteStream } from 'fs';
import { Writable, pipeline as PurePipeline } from 'stream';
import { promisify } from 'util';
import { PassThrough } from 'stream';
import * as fs from "fs";


const pipeline = promisify( PurePipeline );


export interface DouDownloaderOptions
{
	url : string;
	outputPath : string;
	numberOfThreads : number;

	/**
	 * 	in milliseconds
	 */
	timeout : number;
}

export class DouDownloader
{
	private axiosInstance : AxiosInstance;
	private readonly url : string;
	private readonly outputPath : string;
	private readonly numberOfThreads : number;
	private readonly timeout : number;
	private readonly fileStream : WriteStream;

	constructor( options : DouDownloaderOptions )
	{
		if ( ! options )
		{
			throw new Error( `${ this.constructor.name }.constructor :: invalid options` );
		}

		this.url = options.url;
		this.outputPath = options.outputPath;
		this.numberOfThreads = options.numberOfThreads;
		this.timeout = options.timeout;
		this.axiosInstance = axios.create( {
			timeout : this.timeout,
		} );
		this.fileStream = createWriteStream( this.outputPath );
	}

	/**
	 *	@returns {Promise< void >}
	 */
	public downloadWithSingleThreaded() : Promise< void >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const url : string = this.url;
				const response : AxiosResponse<ArrayBuffer> = await axios( {
					url,
					method : 'GET',
					responseType : 'arraybuffer',	//	确保接收到的是二进制数据
				} );

				//	保存文件到本地
				fs.writeFileSync( this.outputPath, Buffer.from( response.data ), 'binary' );
				resolve();
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	@returns {Promise< void >}
	 */
	public downloadWithMultiThreaded()
	{
		return new Promise( async ( resolve, reject ) =>
		{
			let success : boolean = false;
			let err : any = undefined;

			try
			{
				const contentLength = await this.getContentLength();
				await this.downloadFile( 0 );
				success = true;
			}
			catch ( error )
			{
				err = error;
			}
			finally
			{
				this.fileStream.close();

				if ( success )
				{
					resolve( true );
				}
				else
				{
					reject( err );
				}
			}
		} );
	}

	private downloadFile( contentLength : number ) : Promise<void>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( contentLength === 0 )
				{
					console.warn( 'Content length is zero, cannot perform multi-threaded download.' );
					await this.downloadChunk( 0, contentLength );
					return resolve();
				}

				const chunkSize = Math.ceil( contentLength / this.numberOfThreads );
				const downloadPromises : Promise<void>[] = [];

				for ( let i = 0; i < this.numberOfThreads; i++ )
				{
					const start = i * chunkSize;
					const end = i === this.numberOfThreads - 1 ? contentLength - 1 : (i + 1) * chunkSize - 1;

					downloadPromises.push( this.downloadChunk( start, end ) );
				}

				await Promise.all( downloadPromises );
				resolve();
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	private getContentLength() : Promise<number>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			let result : number = 0;
			try
			{
				const response = await this.axiosInstance.head( this.url );
				const length = response.headers[ 'content-length' ];
				result = length ? parseInt( length, 10 ) : 0;
			}
			catch ( error )
			{
			}

			resolve( result );
		} );
	}

	private downloadChunk( start : number, end : number ) : Promise<void>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				// 	Create a PassThrough stream to write each chunk to the file
				const passThrough = new PassThrough();
				passThrough.pipe( this.fileStream, { end : false } );

				const config : AxiosRequestConfig | any = {
					headers : {
						Range : `bytes=${ start }-${ end }`,
					},
					responseType : 'stream',
				};
				const response = await this.axiosInstance.get( this.url, config );
				await pipeline( response.data, passThrough );

				//	...
				resolve();
			}
			catch ( err )
			{
				//console.error( `Error downloading chunk ${ start }-${ end }:`, err );
				reject( err );
			}
		} );
	}


}

