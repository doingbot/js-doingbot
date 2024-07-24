import { describe, expect } from '@jest/globals';
import { DouDownload } from "../src/utils/DouDownload";



/**
 *	unit test
 */
describe( "DouDownload", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	beforeEach( async () =>
	{
	} );

	describe( "Download", () =>
	{
		it( "should download a video from DouYin", async () =>
		{
			const douDownload = new DouDownload();
			const shareUrl = `https://v.douyin.com/iMSsEgUJ/`;
			const result = await douDownload.down2( shareUrl );


		}, 60 * 10e3 );
	} );
} );
