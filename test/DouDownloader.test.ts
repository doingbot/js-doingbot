import { describe, expect } from '@jest/globals';
import { DouDownloader } from "../src";
import { DouParser } from "../src";
import { DouNetworkUtil } from "../src";
import _ from "lodash";
import { DouFileUtil } from "../src";
import { TestUtil } from "debeem-utils";
import { DouImageUtil } from "../src";


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

	describe( "DouDownload", () =>
	{
		it( "should download a video", async () =>
		{
			const douDownload = new DouParser();
			let shareString = `6.92 复制打开抖音，看看【任白的作品】能不能别再听那些悲伤的歌～ # 歌曲别听悲伤的歌 ... https://v.douyin.com/iMDawST4/ 09/07 i@P.xF OxF:/ `;
			shareString = `1.79 复制打开抖音，看看【憨憨老板的作品】一款朴实无华的飞行器 # 镜域双华飞行器 # 和平... https://v.douyin.com/iMmV5NVq/ t@r.eB SYM:/ 08/14 `;
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
			expect( Array.isArray( result.list[ 0 ] ) ).toBeTruthy();
			expect( result.list[ 0 ].length ).toBeGreaterThan( 0 );
			expect( result.list[ 0 ][ 0 ] ).not.toBeNull();
			expect( _.isString( result.list[ 0 ][ 0 ] ) ).toBeTruthy();
			expect( _.isEmpty( result.list[ 0 ][ 0 ] ) ).toBeFalsy();
			for ( const items of result.list )
			{
				expect( Array.isArray( items ) ).toBeTruthy();
				expect( items.length ).toBeGreaterThan( 0 );
			}

			const urlToDownload : string = result.list[ 0 ][ 0 ];
			const filename : string = `downloads/${ await DouNetworkUtil.computeFilenameByUrl( urlToDownload, undefined, true ) }`;
			//console.log( `will download ${ urlToDownload } to file ${ filename }` );
			expect( filename ).not.toBeNull();
			expect( _.isString( filename ) && ! _.isEmpty( filename ) ).toBeTruthy();

			if ( await DouFileUtil.fileExists( filename ) )
			{
				await DouFileUtil.deleteFile( filename );
			}
			const downloader = new DouDownloader({
				url: urlToDownload,
				outputPath: filename,
				numberOfThreads: 4,
				timeout: 30000,
			});
			await downloader.downloadWithSingleThreaded();
			expect( await DouFileUtil.fileExists( filename ) ).toBeTruthy();


		}, 60 * 10e3 );

		it( "should download a set a images", async () =>
		{
			const douParser = new DouParser();
			let shareString = `4.84 复制打开抖音，看看【憨憨老板的图文作品】和平精英元宵打卡 # 和平精英元宵打卡 # 火箭少... https://v.douyin.com/iMa7HLTP/ U@l.pd rEH:/ 05/07 `;
			shareString = `6.66 复制打开抖音，看看【小童u的图文作品】我的胡思乱想可以织十三件毛衣  https://v.douyin.com/iMu9YhtV/ 06/27 K@w.SY vSL:/ `;
			const result = await douParser.parse( shareString );
			//console.log( `images result :`, result );
			//
			//	images result : {
			//       type: 'images',
			//       list: [
			//         [
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/oYCgfAnXI8AnQMC3gADNAsAAA2tIb929lf6Gga~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=tgXMqD%2FrrbF2EJf3SBVVX%2F8mX%2Bs%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p9-sign.douyinpic.com/tos-cn-i-0813c001/oYCgfAnXI8AnQMC3gADNAsAAA2tIb929lf6Gga~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=mykQpuiVrGZVEFLWm6gGUjYEqng%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813c001/oYCgfAnXI8AnQMC3gADNAsAAA2tIb929lf6Gga~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=wbG2SQI8YGl%2F0DnpYgsbPlI3UFQ%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/oYCgfAnXI8AnQMC3gADNAsAAA2tIb929lf6Gga~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=e3iUdsglWyeyTaIDid4PsVSiu38%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C'
			//         ],
			//         [
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813/o829Xag3bAIeSnGtAn9lf6CisDAN8AAgCtAQB2~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=m1CdP0Shu0RvYcw4xDJpy7FJsjk%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/o829Xag3bAIeSnGtAn9lf6CisDAN8AAgCtAQB2~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=IWhXj84Sk1O4NFO5efE9wj0J2BU%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813/o829Xag3bAIeSnGtAn9lf6CisDAN8AAgCtAQB2~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=waF9gFZppAJ7RiL4zLw3UJ%2F0jE0%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813/o829Xag3bAIeSnGtAn9lf6CisDAN8AAgCtAQB2~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=POGCZkK2E5vYFaLiQfD8zdfWSq4%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C'
			//         ],
			//         [
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/ocGAndnd8AaX32eWA9FkACgAC22IQNAbgltfgD~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=PcDwSjpO5B3M%2BPzXJm6umS0VOX0%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813/ocGAndnd8AaX32eWA9FkACgAC22IQNAbgltfgD~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=LvQu7gOz5PfdqJwEfRekHq2qNDI%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813/ocGAndnd8AaX32eWA9FkACgAC22IQNAbgltfgD~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=MDgGD28tcOdXwk3nlwXu2Fb1jfw%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/ocGAndnd8AaX32eWA9FkACgAC22IQNAbgltfgD~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=mSVAweYqFpsDZ%2FVY7ICZ3apcR58%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C'
			//         ],
			//         [
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/ogtCN8ne9AA6aQAXN9DIfnCAsAgg62A23lbmaG~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=cj%2BcodpOCgqLGgS%2BZ1BfiZw8tDM%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813/ogtCN8ne9AA6aQAXN9DIfnCAsAgg62A23lbmaG~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=ZcvtzdSawHyb%2BxYr4UvWS%2F0RC28%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p9-sign.douyinpic.com/tos-cn-i-0813/ogtCN8ne9AA6aQAXN9DIfnCAsAgg62A23lbmaG~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=DfRh5cWutFVT%2FMi28avLQbyNy6c%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/ogtCN8ne9AA6aQAXN9DIfnCAsAgg62A23lbmaG~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=NAPidW6Kxjp5LVkRi56BTsFgVpw%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C'
			//         ],
			//         [
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/ogCIdKafAn232Ngewo8GgnQD9A2dAnXbAAClAt~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=SZNuyLKywVxmPdMo%2FtnnyG3HJwA%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813c001/ogCIdKafAn232Ngewo8GgnQD9A2dAnXbAAClAt~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=IfJS9%2FoYc05ED1pR6JLcrD4Sgfk%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813c001/ogCIdKafAn232Ngewo8GgnQD9A2dAnXbAAClAt~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=dmmha%2F05k53wvGlnTFN41vI0GhQ%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/ogCIdKafAn232Ngewo8GgnQD9A2dAnXbAAClAt~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=%2BgQSBwWtRJ6%2Foq47oOWKx%2BMLvSI%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C'
			//         ],
			//         [
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813/ocDAQNwbtdaI2lA9X23lCA8nqAYnfGgAAg2ceC~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=NF6cUSzw0Kfpw3ktSoTnMbvVqoU%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/ocDAQNwbtdaI2lA9X23lCA8nqAYnfGgAAg2ceC~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=vgmV2cyU5uU0t7c9T4eabRgq6ZA%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813/ocDAQNwbtdaI2lA9X23lCA8nqAYnfGgAAg2ceC~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=MIYLdZ%2F%2BKMCmWYbP%2B42sUwUZKos%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813/ocDAQNwbtdaI2lA9X23lCA8nqAYnfGgAAg2ceC~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=nQ1g4%2BfvyUKbg7nxiWF991qZolo%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C'
			//         ],
			//         [
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/o0lGI9aAAnD7ggAAsssCb862nANtXQfC9t32eA~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=gab5Tz4JwtEaBZDj9O3CNaSUIxU%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813c001/o0lGI9aAAnD7ggAAsssCb862nANtXQfC9t32eA~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=Mpy0KdiTpNleE%2FW8eGM4pqhqqaQ%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813c001/o0lGI9aAAnD7ggAAsssCb862nANtXQfC9t32eA~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=i9ctT%2FAMlaJjXggfHAusSIzKSQU%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/o0lGI9aAAnD7ggAAsssCb862nANtXQfC9t32eA~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=fXi%2BH56vkc1PAZUzmnw0GTJXrM8%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C'
			//         ],
			//         [
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/o0NnuAGADGJAQd8glcaA22tbCn29CXA3eIAjfg~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=ub493LSKsx8Jrq5sddeDuilWDKQ%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813/o0NnuAGADGJAQd8glcaA22tbCn29CXA3eIAjfg~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=FoVtkKdb2%2F%2FgWs9x0itOEDPIsGE%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p9-sign.douyinpic.com/tos-cn-i-0813/o0NnuAGADGJAQd8glcaA22tbCn29CXA3eIAjfg~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=In88l8hnJBRhAodbPPSWxdeb0Us%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813/o0NnuAGADGJAQd8glcaA22tbCn29CXA3eIAjfg~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=00%2FjOGgp4VoIF6%2F01ye1swhp5ng%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C'
			//         ],
			//         [
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813c001/oMA2stfCnQG6w92nAg8AN89XaCbglAAID7gfA3~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=ePHzRcOyoel5QH1xEcQoRudPlKg%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/oMA2stfCnQG6w92nAg8AN89XaCbglAAID7gfA3~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=zMSbYoELo3uNF9Oe5M9wLBMyevk%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p26-sign.douyinpic.com/tos-cn-i-0813c001/oMA2stfCnQG6w92nAg8AN89XaCbglAAID7gfA3~tplv-dy-aweme-images:q75.webp?x-expires=1724475600&x-signature=QlYy2woBW7YRJCRyCa9QQZHuw4Q%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C',
			//           'https://p11-sign.douyinpic.com/tos-cn-i-0813c001/oMA2stfCnQG6w92nAg8AN89XaCbglAAID7gfA3~tplv-dy-aweme-images:q75.jpeg?x-expires=1724475600&x-signature=serBUOJ0i9l6LeEncCrTTlkB%2Fls%3D&from=327834062&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20240725135515B104E1E4414AE704D99C'
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

			let successList : Array< string > = [];
			for ( const urlItemArray of result.list )
			{
				expect( Array.isArray( urlItemArray ) ).toBeTruthy();
				expect( urlItemArray.length ).toBeGreaterThan( 0 );

				for ( const urlToDownload of urlItemArray )
				{
					try
					{
						let filePathWebp : string = await DouNetworkUtil.computeFilenameByUrl( urlToDownload );
						let filePathPng : string = await DouNetworkUtil.computeFilenameByUrl( urlToDownload, `png` );
						expect( filePathWebp ).not.toBeNull();
						expect( _.isString( filePathWebp ) && ! _.isEmpty( filePathWebp ) ).toBeTruthy();
						expect( filePathWebp.includes( '.unknown' ) ).toBeFalsy();
						expect( _.isString( filePathPng ) && ! _.isEmpty( filePathPng ) ).toBeTruthy();
						expect( filePathPng.includes( '.unknown' ) ).toBeFalsy();

						filePathWebp = `downloads/${ filePathWebp }`;
						filePathPng = `downloads/${ filePathPng }`;
						if ( await DouFileUtil.fileExists( filePathWebp ) )
						{
							await DouFileUtil.deleteFile( filePathWebp );
						}
						if ( await DouFileUtil.fileExists( filePathPng ) )
						{
							await DouFileUtil.deleteFile( filePathPng );
						}

						const downloader = new DouDownloader({
							url: urlToDownload,
							outputPath: filePathWebp,
							numberOfThreads: 4,
							timeout: 30000,
						});
						await downloader.downloadWithSingleThreaded();
						expect( await DouFileUtil.fileExists( filePathWebp ) ).toBeTruthy();

						await DouImageUtil.convert( filePathWebp, 'png', filePathPng );
						await DouFileUtil.deleteFile( filePathWebp );

						successList.push( filePathWebp );
						break;
					}
					catch ( err )
					{
						//console.error( err );
					}
				}

				await TestUtil.sleep( 1000 );
			}

			//	...
			expect( successList.length ).toBe( result.list.length );


		}, 60 * 10e3 );
	} );
} );
