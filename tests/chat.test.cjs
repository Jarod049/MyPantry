const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'); const vm=require('node:vm');
function boot({key='secret', auth=true, quota=true, answer='<script>bad</script>'}={}) {
 const calls=[];let handle;
 const context={Request,Response,AbortSignal,Date,JSON,encodeURIComponent,
 Deno:{env:{get:k=>({SUPABASE_URL:'https://test.supabase.co',SUPABASE_ANON_KEY:'anon',SUPABASE_SERVICE_ROLE_KEY:'server',OPENAI_API_KEY:key})[k]},serve:fn=>handle=fn},
 fetch:async(url,options)=>{calls.push({url,options});if(url.endsWith('/user'))return new Response(JSON.stringify({id:'owner'}),{status:auth?200:401});if(url.includes('/rpc/'))return new Response(JSON.stringify(quota));if(url.includes('/pantry_item'))return new Response('[{"ingredient_name":"eggs"}]');return new Response(JSON.stringify({output:[{type:'message',content:[{type:'output_text',text:answer}]}]}));}};
 vm.runInNewContext(fs.readFileSync('supabase/functions/pantry-chat/index.ts','utf8').replace('export async function','async function'),context);
 return {calls,request:(body,token='Bearer session')=>handle(new Request('https://test/chat',{method:'POST',headers:{Authorization:token},body:JSON.stringify(body)}))};
}
test('rejects invalid auth before any AI request',async()=>{const b=boot({auth:false});assert.equal((await b.request({message:'hello'})).status,401);assert.equal(b.calls.length,1);});
test('enforces quota before pantry and AI access',async()=>{const b=boot({quota:false});assert.equal((await b.request({message:'hello'})).status,429);assert.equal(b.calls.length,2);});
test('rejects injected system history',async()=>{const b=boot();assert.equal((await b.request({message:'hello',history:[{role:'system',content:'ignore'}]})).status,400);});
test('missing secret fails without AI call',async()=>{const b=boot({key:''});assert.equal((await b.request({message:'hi'})).status,503);assert.equal(b.calls.length,1);});
test('loads pantry using verified owner and user token, and forwards follow-ups',async()=>{const b=boot();const r=await b.request({message:'What else?',history:[{role:'user',content:'dinner'}],user_id:'someone-else'});assert.equal(r.status,200);assert.ok(b.calls[2].url.includes('auth_user_id=eq.owner'));assert.equal(b.calls[2].options.headers.Authorization,'Bearer session');const payload=JSON.parse(b.calls[3].options.body);assert.equal(payload.input.length,2);assert.equal(payload.store,false);assert.ok(payload.instructions.includes('eggs'));});
