import { describe, expect } from '@jest/globals';
import { DouParser } from "../src/services/DouParser";
import { ParseResult } from "../src/model/ParseModel";



/**
 *	unit test
 */
describe( "DouParser", () =>
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
			const douParser = new DouParser();
			const shareUrls = [
				`5.38 复制打开抖音，看看【憨憨老板的作品】可爱的软软马卡龙 # 软软马卡龙 # 和平精英 #... https://v.douyin.com/iMaE4Jrk/ B@g.OX AGV:/ 03/08 `,
			];
			for ( const sUrl of shareUrls )
			{
				const result = await douParser.parse( sUrl );
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
			//console.log( `video result :`, result );
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

		it( "should return a set of image urls by a share string", async () =>
		{
			const douDownload = new DouParser();
			const shareString = `4.84 复制打开抖音，看看【憨憨老板的图文作品】和平精英元宵打卡 # 和平精英元宵打卡 # 火箭少... https://v.douyin.com/iMaW3tCp/ U@l.pd rEH:/ 05/07 `;
			const result = await douDownload.parse( shareString );
			//console.log( `images result :`, result );
			//	images result : {
			//       type: 'images',
			//       list: [
			//         [
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/oYCgfAnXI8AnQMC3gADNAsAAA2tIb929lf6Gga~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=tgXMqD%2FrrbF2EJf3SBVVX%2F8mX%2Bs%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p9-sign.douyinpic.com/tos-cn-i-0813c001/oYCgfAnXI8AnQMC3gADNAsAAA2tIb929lf6Gga~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=mykQpuiVrGZVEFLWm6gGUjYEqng%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813c001/oYCgfAnXI8AnQMC3gADNAsAAA2tIb929lf6Gga~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=wbG2SQI8YGl%2F0DnpYgsbPlI3UFQ%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/oYCgfAnXI8AnQMC3gADNAsAAA2tIb929lf6Gga~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=e3iUdsglWyeyTaIDid4PsVSiu38%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF'
			//         ],
			//         [
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813/o829Xag3bAIeSnGtAn9lf6CisDAN8AAgCtAQB2~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=m1CdP0Shu0RvYcw4xDJpy7FJsjk%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/o829Xag3bAIeSnGtAn9lf6CisDAN8AAgCtAQB2~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=IWhXj84Sk1O4NFO5efE9wj0J2BU%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813/o829Xag3bAIeSnGtAn9lf6CisDAN8AAgCtAQB2~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=waF9gFZppAJ7RiL4zLw3UJ%2F0jE0%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813/o829Xag3bAIeSnGtAn9lf6CisDAN8AAgCtAQB2~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=POGCZkK2E5vYFaLiQfD8zdfWSq4%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF'
			//         ],
			//         [
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/ocGAndnd8AaX32eWA9FkACgAC22IQNAbgltfgD~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=PcDwSjpO5B3M%2BPzXJm6umS0VOX0%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813/ocGAndnd8AaX32eWA9FkACgAC22IQNAbgltfgD~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=LvQu7gOz5PfdqJwEfRekHq2qNDI%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813/ocGAndnd8AaX32eWA9FkACgAC22IQNAbgltfgD~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=MDgGD28tcOdXwk3nlwXu2Fb1jfw%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/ocGAndnd8AaX32eWA9FkACgAC22IQNAbgltfgD~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=mSVAweYqFpsDZ%2FVY7ICZ3apcR58%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF'
			//         ],
			//         [
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/ogtCN8ne9AA6aQAXN9DIfnCAsAgg62A23lbmaG~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=cj%2BcodpOCgqLGgS%2BZ1BfiZw8tDM%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813/ogtCN8ne9AA6aQAXN9DIfnCAsAgg62A23lbmaG~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=ZcvtzdSawHyb%2BxYr4UvWS%2F0RC28%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p9-sign.douyinpic.com/tos-cn-i-0813/ogtCN8ne9AA6aQAXN9DIfnCAsAgg62A23lbmaG~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=DfRh5cWutFVT%2FMi28avLQbyNy6c%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/ogtCN8ne9AA6aQAXN9DIfnCAsAgg62A23lbmaG~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=NAPidW6Kxjp5LVkRi56BTsFgVpw%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF'
			//         ],
			//         [
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/ogCIdKafAn232Ngewo8GgnQD9A2dAnXbAAClAt~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=SZNuyLKywVxmPdMo%2FtnnyG3HJwA%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813c001/ogCIdKafAn232Ngewo8GgnQD9A2dAnXbAAClAt~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=IfJS9%2FoYc05ED1pR6JLcrD4Sgfk%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813c001/ogCIdKafAn232Ngewo8GgnQD9A2dAnXbAAClAt~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=dmmha%2F05k53wvGlnTFN41vI0GhQ%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/ogCIdKafAn232Ngewo8GgnQD9A2dAnXbAAClAt~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=%2BgQSBwWtRJ6%2Foq47oOWKx%2BMLvSI%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF'
			//         ],
			//         [
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813/ocDAQNwbtdaI2lA9X23lCA8nqAYnfGgAAg2ceC~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=NF6cUSzw0Kfpw3ktSoTnMbvVqoU%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/ocDAQNwbtdaI2lA9X23lCA8nqAYnfGgAAg2ceC~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=vgmV2cyU5uU0t7c9T4eabRgq6ZA%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813/ocDAQNwbtdaI2lA9X23lCA8nqAYnfGgAAg2ceC~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=MIYLdZ%2F%2BKMCmWYbP%2B42sUwUZKos%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813/ocDAQNwbtdaI2lA9X23lCA8nqAYnfGgAAg2ceC~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=nQ1g4%2BfvyUKbg7nxiWF991qZolo%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF'
			//         ],
			//         [
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/o0lGI9aAAnD7ggAAsssCb862nANtXQfC9t32eA~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=gab5Tz4JwtEaBZDj9O3CNaSUIxU%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813c001/o0lGI9aAAnD7ggAAsssCb862nANtXQfC9t32eA~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=Mpy0KdiTpNleE%2FW8eGM4pqhqqaQ%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813c001/o0lGI9aAAnD7ggAAsssCb862nANtXQfC9t32eA~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=i9ctT%2FAMlaJjXggfHAusSIzKSQU%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/o0lGI9aAAnD7ggAAsssCb862nANtXQfC9t32eA~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=fXi%2BH56vkc1PAZUzmnw0GTJXrM8%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF'
			//         ],
			//         [
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/o0NnuAGADGJAQd8glcaA22tbCn29CXA3eIAjfg~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=ub493LSKsx8Jrq5sddeDuilWDKQ%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813/o0NnuAGADGJAQd8glcaA22tbCn29CXA3eIAjfg~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=FoVtkKdb2%2F%2FgWs9x0itOEDPIsGE%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p9-sign.douyinpic.com/tos-cn-i-0813/o0NnuAGADGJAQd8glcaA22tbCn29CXA3eIAjfg~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=In88l8hnJBRhAodbPPSWxdeb0Us%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/o0NnuAGADGJAQd8glcaA22tbCn29CXA3eIAjfg~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=00%2FjOGgp4VoIF6%2F01ye1swhp5ng%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF'
			//         ],
			//         [
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813c001/oMA2stfCnQG6w92nAg8AN89XaCbglAAID7gfA3~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=ePHzRcOyoel5QH1xEcQoRudPlKg%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/oMA2stfCnQG6w92nAg8AN89XaCbglAAID7gfA3~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=zMSbYoELo3uNF9Oe5M9wLBMyevk%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813c001/oMA2stfCnQG6w92nAg8AN89XaCbglAAID7gfA3~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=QlYy2woBW7YRJCRyCa9QQZHuw4Q%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813c001/oMA2stfCnQG6w92nAg8AN89XaCbglAAID7gfA3~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=serBUOJ0i9l6LeEncCrTTlkB%2Fls%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072513391055E1CFA7A2D4F10285CF'
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
	} );
} );
