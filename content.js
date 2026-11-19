const FILES = new Set(["site.json","products.json","services.json","testimonials.json","projects.json"]);
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}})}
export async function onRequest(context){
  const {request,env}=context;
  // Protect /admin/* and /api/admin/* with a Cloudflare Access application.
  // The Pages Function also requires the Access assertion header as a fail-closed check.
  if(!request.headers.get("cf-access-jwt-assertion")) return json({error:"Authentication required. Sign in through Cloudflare Access."},401);
  if(!env.GITHUB_TOKEN||!env.GITHUB_OWNER||!env.GITHUB_REPO) return json({error:"Admin API is not configured."},503);
  const url=new URL(request.url),file=url.searchParams.get("file");
  if(!FILES.has(file)) return json({error:"Unsupported content file."},400);
  const branch=env.GITHUB_BRANCH||"main";
  const api=`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/content/${file}`;
  const headers={"Authorization":`Bearer ${env.GITHUB_TOKEN}`,"Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","User-Agent":"BullMoose-Website-Editor"};
  if(request.method==="GET"){
    const r=await fetch(`${api}?ref=${encodeURIComponent(branch)}`,{headers});
    if(!r.ok)return json({error:"Unable to read repository content.",detail:await r.text()},r.status);
    const d=await r.json();let decoded;
    try{decoded=JSON.parse(atob(d.content.replace(/\n/g,"")))}catch{return json({error:"Content file is not valid JSON."},500)}
    return json(decoded);
  }
  if(request.method==="PUT"){
    let value;try{value=await request.json()}catch{return json({error:"Invalid JSON body."},400)}
    const current=await fetch(`${api}?ref=${encodeURIComponent(branch)}`,{headers});
    if(!current.ok)return json({error:"Unable to locate content file.",detail:await current.text()},current.status);
    const existing=await current.json();
    const content=btoa(unescape(encodeURIComponent(JSON.stringify(value,null,2)+"\n")));
    const update=await fetch(api,{method:"PUT",headers:{...headers,"Content-Type":"application/json"},body:JSON.stringify({message:`Update website content: ${file}`,content,sha:existing.sha,branch})});
    const result=await update.json();
    if(!update.ok)return json({error:"GitHub could not save the content.",detail:result},update.status);
    return json({saved:true,commit:result.commit?.sha});
  }
  return json({error:"Method not allowed."},405);
}