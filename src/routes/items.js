import express from "express"
import { get_db } from "../db.js"

const query_get_item_by_id = "SELECT * FROM items where id = ?";

function get_by_id(db, id) {
    return new Promise((resolve, reject) => {
        db.get(query_get_item_by_id, id, (err, item) => {
            if (err) {
                console.error(err);
                return reject(new Error(`Database error ${err.message}`));
            }
            resolve(item);
        });
    });
}

const router = express.Router();

router.get("/", async (req, res) => {
  const db = get_db();

  const query = "SELECT id, name, description, owner_user_id, created_at FROM items ORDER BY id DESC";

  await db.all(query, 
    function(err, items) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: `Database error ${err.message}` });
        }

        console.log(`Retrieved ${items.length} items`);
        return res.status(200).json(items);
    });
});

router.post("/", async (req, res) => {
  const { name, description } = req.body || {};
  if (!name) return res.status(400).json({ error: "name required" });

  const db = get_db();
  const query = "INSERT INTO items (name, description, owner_user_id) VALUES (?, ?, ?)";

  await db.run(query, 
    [name, description || null, 1 /*req.user.id*/], 
    async function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: `Database error ${err.message}` });
        }

        console.log(`Inserted item with ID ${this.lastID}`);

        const created = await get_by_id(db, req.params.id);
        return res.status(201).json(created);
    });
});

router.get("/:id", async (req, res) => {
    const db = get_db();

    const item = await get_by_id(db, req.params.id);
    if (!item) return res.status(404).json( { error:"Not found"});
    return res.json(item);
});

router.put("/:id", async (req, res) => {
  const { name, description } = req.body || {};
  if (!name) return res.status(400).json({ error: "name required" });

  const db = get_db();
  const existing = await get_by_id(db, req.params.id);

  if (!existing) return res.status(404).json( { error:"Not found"});

  const query_update = "UPDATE items SET name = ?, description = ? WHERE id = ?";
  await db.run(query_update, 
    [name, description || null, req.params.id],
    function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: `Database error ${err.message}` });
        }

        console.log(`Updated item: ${req.params.id}`);
        return res.stats(204).send();
    }
  );

});

export default router;