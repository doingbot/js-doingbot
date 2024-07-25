import { promises as fs } from "fs";
import _ from "lodash";


/**
 * 	@class
 */
export class DouFileUtil
{
	/**
	 *	delete a file
	 *
	 *	@param filePath		{string}	file path
	 *	@returns {Promise< boolean >}
	 */
	public static deleteFile( filePath : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await fs.unlink( filePath );
				resolve( true );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	check if the input value is a valid existing file on disk
	 *	@param filePath	{string}	file path
	 *	@returns {Promise< boolean >}
	 */
	public static fileExists( filePath : any ) : Promise< boolean >
	{
		return new Promise( async ( resolve, __ ) =>
		{
			try
			{
				if ( ! _.isString( filePath ) || _.isEmpty( filePath ) )
				{
					return resolve( false );
				}

				await fs.access( filePath );

				//	file exists
				resolve( true );
			}
			catch ( err )
			{
				//	file does not exist
				resolve( false );
			}
		} );
	}
}