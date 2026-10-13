import postgres from 'postgres';import fs from 'node:fs/promises';
if(!process.env.DATABASE_URL)throw Error('DATABASE_URL missing');
const sql=postgres(process.env.DATABASE_URL,{ssl:'require'});try{await sql.unsafe(await fs.readFile('db/schema.sql','utf8'));console.log('Schema ready')}finally{await sql.end()}
