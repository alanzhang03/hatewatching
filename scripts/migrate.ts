import { getSql, SCHEMA } from '../lib/db';

async function main() {
  const sql = getSql();
  for (const statement of SCHEMA) {
    await sql.query(statement);
  }
  console.log(`Applied ${SCHEMA.length} schema statements`);
}

main();
