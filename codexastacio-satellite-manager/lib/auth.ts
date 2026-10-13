import {cookies} from 'next/headers';
import {createHmac,timingSafeEqual} from 'node:crypto';
const name='cxa_session';
function sign(payload:string){if(!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length<32)throw Error('Configure SESSION_SECRET');return createHmac('sha256',process.env.SESSION_SECRET).update(payload).digest('hex')}
export function issueSession(id:string,role:string){const body=Buffer.from(JSON.stringify({id,role,exp:Date.now()+8*3600_000})).toString('base64url');return body+'.'+sign(body)}
export async function session(){const token=(await cookies()).get(name)?.value;if(!token)return null;const [body,sig]=token.split('.');if(!body||!sig)return null;const expected=sign(body);if(sig.length!==expected.length||!timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return null;try{const data=JSON.parse(Buffer.from(body,'base64url').toString());return data.exp>Date.now()?data:null}catch{return null}}
export const cookieName=name;
