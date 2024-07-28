import { describe, expect } from '@jest/globals';
import { PersistentQueue } from "../src/storage/PersistentQueue";
import { TestUtil } from "debeem-utils";



/**
 *	unit test
 */
describe( "PersistentQueue", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	beforeEach( async () =>
	{
		const persistentQueue = new PersistentQueue();
		await persistentQueue.clear();
	} );

	describe( "PersistentQueue", () =>
	{
		it( "should return the front value", async () =>
		{
			const persistentQueue = new PersistentQueue();
			const element = {
				timestamp: new Date().getTime(),
				value: `1.79 复制打开抖音，看看【憨憨老板的作品】一款朴实无华的飞行器 # 镜域双华飞行器 # 和平... https://v.douyin.com/iMmV5NVq/ t@r.eB SYM:/ 08/14`,
			};
			await persistentQueue.enqueue( element );
			const front = await persistentQueue.front();
			expect( front ).not.toBeNull();
			expect( front.timestamp ).toBe( element.timestamp );
			expect( front.value ).toBe( element.value );

		}, 60 * 10e3 );

		it( "should return the first value", async () =>
		{
			const persistentQueue = new PersistentQueue();

			//	insert element 1
			const element1 = {
				timestamp: new Date().getTime(),
				value: `111`,
			};
			await persistentQueue.enqueue( element1 );

			//	insert element 2
			await TestUtil.sleep( 1000 );
			const element2 = {
				timestamp: new Date().getTime(),
				value: `222`,
			};
			await persistentQueue.enqueue( element2 );

			//	...
			const front = await persistentQueue.front();
			expect( front ).not.toBeNull();
			expect( front.timestamp ).toBe( element1.timestamp );
			expect( front.value ).toBe( element1.value );

		}, 60 * 10e3 );

		it( "should return the first value and remove it", async () =>
		{
			const persistentQueue = new PersistentQueue();

			//	insert element 1
			const element1 = {
				timestamp: new Date().getTime(),
				value: `111`,
			};
			await persistentQueue.enqueue( element1 );

			//	insert element 2
			await TestUtil.sleep( 1000 );
			const element2 = {
				timestamp: new Date().getTime(),
				value: `222`,
			};
			await persistentQueue.enqueue( element2 );

			//	...
			const front1 = await persistentQueue.dequeue();
			expect( front1 ).not.toBeNull();
			expect( front1.timestamp ).toBe( element1.timestamp );
			expect( front1.value ).toBe( element1.value );

			//	...
			const front2 = await persistentQueue.dequeue();
			expect( front2 ).not.toBeNull();
			expect( front2.timestamp ).toBe( element2.timestamp );
			expect( front2.value ).toBe( element2.value );

			//	...
			const front3 = await persistentQueue.front();
			expect( front3 ).toBeNull();

		}, 60 * 10e3 );

		it( "should return the front value and remove it", async () =>
		{
			const persistentQueue = new PersistentQueue();
			const element = {
				timestamp: new Date().getTime(),
				value: `1.79 复制打开抖音，看看【憨憨老板的作品】一款朴实无华的飞行器 # 镜域双华飞行器 # 和平... https://v.douyin.com/iMmV5NVq/ t@r.eB SYM:/ 08/14`,
			};
			await persistentQueue.enqueue( element );
			const front1 = await persistentQueue.dequeue();
			expect( front1 ).not.toBeNull();
			expect( front1.timestamp ).toBe( element.timestamp );
			expect( front1.value ).toBe( element.value );

			const front2 = await persistentQueue.front();
			expect( front2 ).toBeNull();

		}, 60 * 10e3 );
	} );
} );
