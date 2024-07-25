import sharp, { FormatEnum } from 'sharp';
import { DouFileUtil } from "./DouFileUtil";
import _ from "lodash";


/**
 * 	@class
 */
export class DouImageUtil
{
	/**
	 *	@param inputPath	{string}
	 *	@param outputFormat	{string}
	 *	@param outputPath	{string}
	 *	@returns {Promise< boolean >}
	 */
	public static convert( inputPath : string, outputFormat : string, outputPath : string ) : Promise< boolean >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( inputPath ) || _.isEmpty( inputPath ) )
				{
					return reject( `DouImageUtil.convert :: invalid inputPath` );
				}
				if ( ! await DouFileUtil.fileExists( inputPath ) )
				{
					return reject( `DouImageUtil.convert :: inputPath not found` );
				}
				if ( ! this.isSupportedFormat( outputFormat ) )
				{
					return reject( `DouImageUtil.convert :: not supported outputFormat` );
				}

				//	...
				sharp( inputPath )
					.toFormat( outputFormat as keyof FormatEnum )
					.toFile( outputPath, ( err, _info ) =>
					{
						if ( err )
						{
							//console.error( 'Error converting image:', err );
							return reject( err );
						}
						else
						{
							//console.log( 'Image converted successfully:', info );
							return resolve( true );
						}
					} );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 *	check if the input format was supported by Sharp
	 *	@param format	{string}
	 *	@returns {boolean}
	 */
	public static isSupportedFormat( format : string ) : boolean
	{
		if ( ! _.isString( format ) || _.isEmpty( format ) )
		{
			return false;
		}

		format = format.trim().toLocaleString();
		return _.has( sharp.format, format );
	}
}