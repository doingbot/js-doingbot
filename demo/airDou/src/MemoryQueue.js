export class MemoryQueue
{
	constructor()
	{
		this.items = [];
	}

	/**
	 * 	向队列添加元素
	 *	@param element
	 */
	enqueue( element )
	{
		this.items.push( element );
	}

	/**
	 * 	从队列移除元素
	 *	@returns {*}
	 */
	dequeue()
	{
		if ( this.isEmpty() )
		{
			//	Queue is empty
			return null;
		}

		return this.items.shift();
	}

	/**
	 * 	查看队列的第一个元素
	 *	@returns {*}
	 */
	front()
	{
		if ( this.isEmpty() )
		{
			//	Queue is empty
			return null;
		}
		return this.items[ 0 ];
	}

	/**
	 * 	检查队列是否为空
	 *	@returns {boolean}
	 */
	isEmpty()
	{
		return this.items.length === 0;
	}

	/**
	 * 	获取队列的长度
	 *	@returns {number}
	 */
	size()
	{
		return this.items.length;
	}

	/**
	 * 	清空队列
	 */
	clear()
	{
		this.items = [];
	}
}