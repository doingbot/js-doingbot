import { describe, expect } from '@jest/globals';
import { DouParser } from "../src/services/DouParser";
import { ParseResult } from "../src/model/ParseModel";
import { DouNetworkUtil } from "../src/utils/DouNetworkUtil";
import _ from "lodash";



/**
 *	unit test
 */
describe( "DouNetworkUtil", () =>
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

	describe( "DouNetworkUtil", () =>
	{
		it( "should return the contentType by a url", async () =>
		{
			const douParser = new DouParser();
			const shareUrl = `1.79 复制打开抖音，看看【憨憨老板的作品】一款朴实无华的飞行器 # 镜域双华飞行器 # 和平... https://v.douyin.com/iMmV5NVq/ t@r.eB SYM:/ 08/14 `;
			const result = await douParser.parse( shareUrl );
			//console.log( result );
			//    {
			//       type: 'video',
			//       list: [
			//         [
			//           'https://aweme.snssdk.com/aweme/v1/play/?video_id=v0d00fg10000cpjjdkvog65gure1vv10&ratio=720p&line=0'
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
			const videoUrl = result.list[ 0 ][ 0 ];

			const contentType : string = await DouNetworkUtil.detectContentTypeByUrl( videoUrl );
			const extName : string = DouNetworkUtil.getFileExtensionByContentType( contentType );
			//console.log( contentType, extName );
			//	    video/mp4 mp4
			expect( contentType ).toBe( `video/mp4` );
			expect( extName ).toBe( `mp4` );

		}, 60 * 10e3 );

		it( "should return a keccakHash value of a url", async () =>
		{
			const url : string = `https://p26-sign.douyinpic.com/tos-cn-i-0813c001/oQgAEBAFuEAfC7AAZ6BMLqIZPpzeDfPEGVGNWY~tplv-dy-lqen-new:1024:8194:q80.webp?x-expires=1724439600&x-signature=PwrTcjz6qsGKYJmWUczTAqAr0SI%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=2024072503261012EBB9526B6FE32CB9D4`;
			const hash : string = await DouNetworkUtil.computeFilenameByUrl( url );
			//console.log( `hash : `, hash );
			//	hash :  587f186f263694cb9f874f6fbfaf2bfbcfc87a47aac644fe5c8b5d00dad11e67
			expect( hash ).not.toBeNull();
			expect( _.isString( hash ) ).toBeTruthy();
			expect( _.isEmpty( hash ) ).toBeFalsy();

		}, 60 * 10e3 );
	} );
} );
