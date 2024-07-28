import { DatabaseOptions, Level } from 'level';
import _ from "lodash";


/**
 * 	@class
 */
export class LevelDbManager
{
	protected static db : Level< string, any >;
	protected static dbName : string = `levelDb`;
	protected static dbOptions : DatabaseOptions<string, string> = { valueEncoding : 'json' };


	/**
	 * 	initialize database
	 *	@protected
	 */
	protected static initDB( dbName ? : string ) : void
	{
		if ( _.isString( dbName ) && ! _.isEmpty( dbName ) )
		{
			this.dbName = _.cloneDeep( dbName );
		}

		if ( ! this.db )
		{
			this.db = new Level( this.dbName, this.dbOptions );
		}
	}

	/**
	 * 	get database name
	 * 	@returns {string}
	 */
	public static getDbName() : string
	{
		return this.dbName;
	}

	/**
	 * 	get database instance
	 * 	@returns {Level}
	 */
	public static getDB( dbName ?: string ) : Level
	{
		if ( ! this.db )
		{
			this.initDB( dbName );
		}
		return this.db;
	}
}