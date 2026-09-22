const BASE=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
export async function api(path,options={}){const headers=new Headers(options.headers||{});if(options.body&&!(options.body instanceof FormData)&&!headers.has('Content-Type'))headers.set('Content-Type','application/json');const res=await fetch(`${BASE}${path}`,{...options,headers,credentials:'include'});let data=null;try{data=await res.json()}catch{}if(!res.ok)throw new Error(data?.message||`Request failed (${res.status})`);return data}
export const getProducts=()=>api('/products');
