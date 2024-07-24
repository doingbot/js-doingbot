import { describe, expect } from '@jest/globals';
import { DouParser } from "../src/services/DouParser";
import { ParseResult } from "../src/model/ParseModel";



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

	describe( "DouParser", () =>
	{
		it( "should return a video url", async () =>
		{
			const douDownload = new DouParser();
			const shareUrls = [
				`https://v.douyin.com/iMSsEgUJ/`,
				`https://v.douyin.com/iM58L5P3/`,
				`https://v.douyin.com/iMU8r7VJ/`
			];
			for ( const sUrl of shareUrls )
			{
				const result = await douDownload.parse( sUrl );
				//console.log( `[${ sUrl }] video result :`, result );
				//
				//    [https://v.douyin.com/iMU8r7VJ/] video result : {
				//       type: 'video',
				//       list: [
				//         [
				//           'https://aweme.snssdk.com/aweme/v1/play/?video_id=v0d00fg10000cqf5plfog65gu75kr900&ratio=720p&line=0'
				//         ]
				//       ]
				//     }
				expect( result ).toBeDefined();
				expect( result ).not.toBeNull();
				expect( result ).toHaveProperty( `type` );
				expect( result ).toHaveProperty( `list` );
				expect( result.type ).toBe( `video` );
				expect( Array.isArray( result.list ) ).toBeTruthy();
				expect( result.list.length ).toBeGreaterThan( 0 );
				for ( const items of result.list )
				{
					expect( Array.isArray( items ) ).toBeTruthy();
					expect( items.length ).toBeGreaterThan( 0 );
				}
			}


		}, 60 * 10e3 );

		it( "should return an empty array because the video does not exist", async () =>
		{
			const douDownload = new DouParser();
			const shareUrl = `https://v.douyin.com/iM5DbQpq/`;
			const result = await douDownload.parse( shareUrl );
			//console.log( `video result :`, result );
			//	video result : { type: 'video', list: [] }
			expect( result ).toBeDefined();
			expect( result ).not.toBeNull();
			expect( result ).toHaveProperty( `type` );
			expect( result ).toHaveProperty( `list` );
			expect( result.type ).toBe( `video` );
			expect( Array.isArray( result.list ) ).toBeTruthy();
			expect( result.list.length ).toBe( 0 );

		}, 60 * 10e3 );

		it( "should return a list of images", async () =>
		{
			const douDownload = new DouParser();
			const shareUrl = `https://v.douyin.com/iMrRowf3/`;
			const result : ParseResult = await douDownload.parse( shareUrl );
			//console.log( `image result :`, result );
			//	    image result : {
			//       type: 'images',
			//       list: [
			//         [
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813c001/oQgAEBAFuEAfC7AAZ6BMLqIZPpzeDfPEGVGNWY~tplv-dy-lqen-new:1024:8194:q80.webp?x-expires=1724439600&x-signature=PwrTcjz6qsGKYJmWUczTAqAr0SI%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072503261012EBB9526B6FE32CB9D4',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/oQgAEBAFuEAfC7AAZ6BMLqIZPpzeDfPEGVGNWY~tplv-dy-lqen-new:1024:8194:q80.webp?x-expires=1724439600&x-signature=MPovoYAgHQgVgYAoHdeNsXiEHdY%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072503261012EBB9526B6FE32CB9D4',
			//           'https://p9-sign.douyinpic.com/tos-cn-i-0813c001/oQgAEBAFuEAfC7AAZ6BMLqIZPpzeDfPEGVGNWY~tplv-dy-lqen-new:1024:8194:q80.webp?x-expires=1724439600&x-signature=cp5CWJSeDAfOdwGxQ5gELoqdbZM%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072503261012EBB9526B6FE32CB9D4',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813c001/oQgAEBAFuEAfC7AAZ6BMLqIZPpzeDfPEGVGNWY~tplv-dy-lqen-new:1024:8194:q80.jpeg?x-expires=1724439600&x-signature=Jfa3pY4B213h%2FmZiSVSWWDaZx%2Fc%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072503261012EBB9526B6FE32CB9D4'
			//         ],
			//         [
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/oozZNBIfqADuAgAeE5CBEnWYqGFV7MLEvAxZfA~tplv-dy-lqen-new:1024:8194:q80.webp?x-expires=1724439600&x-signature=ftCg9QBsT7Ly3NFQ9lHQ8AbpsQc%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072503261012EBB9526B6FE32CB9D4',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813c001/oozZNBIfqADuAgAeE5CBEnWYqGFV7MLEvAxZfA~tplv-dy-lqen-new:1024:8194:q80.webp?x-expires=1724439600&x-signature=9hOCeZqohvwyiuLsR%2FHuph19pRs%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072503261012EBB9526B6FE32CB9D4',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813c001/oozZNBIfqADuAgAeE5CBEnWYqGFV7MLEvAxZfA~tplv-dy-lqen-new:1024:8194:q80.webp?x-expires=1724439600&x-signature=r%2FUxqHYyUT0B4xxnc%2BpmEhyuVzk%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072503261012EBB9526B6FE32CB9D4',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/oozZNBIfqADuAgAeE5CBEnWYqGFV7MLEvAxZfA~tplv-dy-lqen-new:1024:8194:q80.jpeg?x-expires=1724439600&x-signature=64G6x09kteAuYZq0kislOoasZYw%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072503261012EBB9526B6FE32CB9D4'
			//         ],
			//         [
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/okI7BvQxeEHtAeGcEAeWLyAGAqIXrA09BZMNmB~tplv-dy-lqen-new:1024:8194:q80.webp?x-expires=1724439600&x-signature=hSsqqgt0mWVpyfUqYudqOwr92M4%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072503261012EBB9526B6FE32CB9D4',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813c001/okI7BvQxeEHtAeGcEAeWLyAGAqIXrA09BZMNmB~tplv-dy-lqen-new:1024:8194:q80.webp?x-expires=1724439600&x-signature=sDpOO22b67oWEmbc%2ByuBkI6bvw4%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072503261012EBB9526B6FE32CB9D4',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813c001/okI7BvQxeEHtAeGcEAeWLyAGAqIXrA09BZMNmB~tplv-dy-lqen-new:1024:8194:q80.webp?x-expires=1724439600&x-signature=L5Mu3odSaYZtZ6Q527%2FDfZFBQDM%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072503261012EBB9526B6FE32CB9D4',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/okI7BvQxeEHtAeGcEAeWLyAGAqIXrA09BZMNmB~tplv-dy-lqen-new:1024:8194:q80.jpeg?x-expires=1724439600&x-signature=CUUhSppPnxQj35vfvZ%2Bx9UGqY%2Fk%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072503261012EBB9526B6FE32CB9D4'
			//         ]
			//       ]
			//     }
			expect( result ).toBeDefined();
			expect( result ).not.toBeNull();
			expect( result ).toHaveProperty( `type` );
			expect( result ).toHaveProperty( `list` );
			expect( result.type ).toBe( `images` );
			expect( Array.isArray( result.list ) ).toBeTruthy();
			expect( result.list.length ).toBeGreaterThan( 0 );
			for ( const items of result.list )
			{
				expect( Array.isArray( items ) ).toBeTruthy();
				expect( items.length ).toBeGreaterThan( 0 );
			}

		}, 60 * 10e3 );

		it( "should return a video url by a share string", async () =>
		{
			const douDownload = new DouParser();
			const shareString = `6.92 复制打开抖音，看看【任白的作品】能不能别再听那些悲伤的歌～ # 歌曲别听悲伤的歌 ... https://v.douyin.com/iMDawST4/ 09/07 i@P.xF OxF:/ `;
			const result = await douDownload.parse( shareString );
			console.log( `video result :`, result );
			//
			//    [https://v.douyin.com/iMU8r7VJ/] video result : {
			//       type: 'video',
			//       list: [
			//         [
			//           'https://aweme.snssdk.com/aweme/v1/play/?video_id=v0d00fg10000cqf5plfog65gu75kr900&ratio=720p&line=0'
			//         ]
			//       ]
			//     }
			expect( result ).toBeDefined();
			expect( result ).not.toBeNull();
			expect( result ).toHaveProperty( `type` );
			expect( result ).toHaveProperty( `list` );
			expect( result.type ).toBe( `video` );
			expect( Array.isArray( result.list ) ).toBeTruthy();
			expect( result.list.length ).toBeGreaterThan( 0 );
			for ( const items of result.list )
			{
				expect( Array.isArray( items ) ).toBeTruthy();
				expect( items.length ).toBeGreaterThan( 0 );
			}

		}, 60 * 10e3 );
	} );
} );
