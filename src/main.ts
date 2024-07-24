import clipboardy from 'clipboardy';
import * as _ from "lodash";
import { DouParser } from "./services/DouParser.js";


const douParser = new DouParser();
let lastText : string | null = null;

export function checkClipboard()
{
	const currentText = clipboardy.readSync();
	if ( currentText !== lastText )
	{
		lastText = currentText;
		if ( _.isString( lastText ) && !_.isEmpty( lastText ) )
		{
			const douUrl = douParser.extractDouYinUrl( lastText );
			if ( _.isString( douUrl ) && !_.isEmpty( douUrl ) )
			{
				console.log( `[${ formatDateTime( new Date() ) }]` );
				console.log( `[DouYin] will download ${ douUrl }` );
			}
		}
	}
}

export function formatDateTime( date : Date ) : string
{
	const year = date.getFullYear();
	const month = String( date.getMonth() + 1 ).padStart( 2, '0' ); // 月份从 0 开始
	const day = String( date.getDate() ).padStart( 2, '0' );
	const hours = String( date.getHours() ).padStart( 2, '0' );
	const minutes = String( date.getMinutes() ).padStart( 2, '0' );
	const seconds = String( date.getSeconds() ).padStart( 2, '0' );

	return `${ year }-${ month }-${ day } ${ hours }:${ minutes }:${ seconds }`;
}

setInterval( checkClipboard, 1000 );	//	每秒检查一次剪切板内容
