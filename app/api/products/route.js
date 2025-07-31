// pages/api/users.js
import { db } from "../../lib/db";

export async function GET(req) {
  const sql = `
    select
	po.products_id as id, p.product_name, p.product_brand, o.owner_name  from products_owners po
left join products p on p.product_id = po.products_id
left join owners o on o.id = po.owners_id;`;
  const [products] = await db.query(sql);
  return Response.json(products);
}
