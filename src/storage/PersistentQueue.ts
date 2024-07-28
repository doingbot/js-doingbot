import { LevelDbManager } from "./LevelDbManager";
import _ from "lodash";

export interface PersistentQueueElement
{
	timestamp: number;
	value: string;
}


/**
 * 	@class
 */
export class PersistentQueue extends LevelDbManager
{
	public prefix : string = `persistent_queue:`;


	/**
	 * 	向队列添加元素
	 *	@param element	{PersistentQueueElement}
	 *	@returns {Promise< void >}
	 */
	enqueue( element : PersistentQueueElement ) : Promise< void >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await LevelDbManager.getDB().put( `${ this.prefix }:${ element.timestamp }`, element as any );
				resolve();
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	从队列尾部移除一个元素
	 *	@returns { Promise< PersistentQueueElement | null > }
	 */
	dequeue() : Promise< PersistentQueueElement | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const lastKey = await this.getFirstKey();
				if ( _.isString( lastKey ) && ! _.isEmpty( lastKey ) )
				{
					const db = LevelDbManager.getDB();
					const element : any = await db.get< string, any >( lastKey, {} );
					if ( element )
					{
						//	delete the element
						await db.del( lastKey );

						//	resolve
						return resolve( element );
					}
				}

				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	查看队列的第一个元素
	 *	@returns { Promise< PersistentQueueElement | null > }
	 */
	front() : Promise< PersistentQueueElement | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const lastKey = await this.getFirstKey();
				if ( _.isString( lastKey ) && ! _.isEmpty( lastKey ) )
				{
					const db = LevelDbManager.getDB();
					const element : any = await db.get< string, any >( lastKey, {} );
					if ( element )
					{
						//	resolve
						return resolve( element );
					}
				}

				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	检查队列是否为空
	 *	@returns {boolean}
	 */
	isEmpty() : Promise< boolean >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const db = LevelDbManager.getDB();
				const options = {
					gte: this.prefix,
					lt: `${ this.prefix }\xFF`,
					limit: 1,
					reverse: false,
				};
				const keys : Array< string > = await db.keys( options ).all();
				resolve( ! ( Array.isArray( keys ) && keys.length > 0 ) );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	获取队列的长度
	 *	@returns { Promise< number > }
	 */
	size() : Promise< number >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const db = LevelDbManager.getDB();
				const options = {
					gte: this.prefix,
					lt: `${ this.prefix }\xFF`
				};
				const keys : Array< string > = await db.keys( options ).all();
				resolve( Array.isArray( keys ) ? keys.length : 0 );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	清空队列
	 * 	@returns { Promise< void > }
	 */
	clear() : Promise< void >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const db = LevelDbManager.getDB();
				const options = {
					gte: this.prefix,
					lt: `${ this.prefix }\xFF`
				};
				await db.clear( options );
				resolve();
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	get the key of the first element
	 *
	 * 	@returns { Promise< string | null > }
	 *	@private
	 */
	private getFirstKey() : Promise< string | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const db = LevelDbManager.getDB();
				const options = {
					gte: this.prefix,
					lt: `${ this.prefix }\xFF`,
					limit: 1,
					reverse: false,
				};
				const keys : Array< string > = await db.keys( options ).all();
				if ( Array.isArray( keys ) && keys.length > 0 )
				{
					const key : string = keys[ 0 ];
					if ( _.isString( key ) && ! _.isEmpty( key ) )
					{
						return resolve( key );
					}
				}

				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}