import postgres from 'postgres';import fs from 'node:fs/promises';
if(!process.env.DATABASE_URL)throw Error('DATABASE_URL missing');
const sql=postgres(process.env.DATABASE_URL,{ssl:'require'});const rows=JSON.parse(await fs.readFile('data/import-original.json','utf8'));const source='CLIENTES DISH final.pdf';
try{await sql.begin(async tx=>{for(const r of rows){await tx`INSERT INTO import_rows(source_name,source_row,raw) VALUES(${source},${r.row},${tx.json(r)}) ON CONFLICT DO NOTHING`;
const previous=await tx`SELECT id FROM receivers WHERE serial=${r.serial}`;if(previous.length){await tx`INSERT INTO import_issues(source_name,source_row,issue,details) VALUES(${source},${r.row},'duplicate_serial',${r.serial}) ON CONFLICT DO NOTHING`;continue}
let clientId=null;if(r.client!=='STOCK'){const clients=await tx`INSERT INTO clients(name) VALUES(${r.client}) ON CONFLICT(name) DO UPDATE SET name=EXCLUDED.name RETURNING id`;clientId=clients[0].id}
await tx`INSERT INTO receivers(serial,account_code,client_id,location,status) VALUES(${r.serial},${r.account},${clientId},${r.location||null},${clientId?'installed':'available'}) ON CONFLICT(serial) DO NOTHING`;
if(clientId&&r.responsible){await tx`INSERT INTO contacts(client_id,name,phone) VALUES(${clientId},${r.responsible},${r.phone||null}) ON CONFLICT DO NOTHING`}
}});console.log(`Processed ${rows.length} source rows; unique serials ${new Set(rows.map(x=>x.serial)).size}`)}finally{await sql.end()}
