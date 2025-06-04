import * as SQLite from 'expo-sqlite';
import { useEffect, useRef } from 'react';
// import { SECTION_LIST_MOCK_DATA } from './utils';

let dbPromise:any;
function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('little_lemon');
  }
  return dbPromise;
}


export async function createTable() {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS menuitems (
      id        INTEGER  PRIMARY KEY NOT NULL,
      name     TEXT,
      price     TEXT,
      description TEXT,
      image TEXT,
      category  TEXT
    );
  `);
}
export async function getMenuItems() {
  const db = await getDb();
  return db.getAllAsync('SELECT * FROM menuitems');
}

export async function saveMenuItems(menuItems) {
  const db = await getDb();

  await db.withExclusiveTransactionAsync(async () => {


    const stmt = await db.prepareAsync(
      `INSERT OR REPLACE INTO menuitems
       (name, price, description, image,category)
       VALUES (?, ?, ?, ?, ?)`
    );
    console.log(stmt)

    try {
      for (const m of menuItems) {
        console.log('Saving menu item:', m);
        await stmt.executeAsync(  
          m.name,  
          String(m.price), 
          m.description,
          m.image,
          m.category
        );
      }
    } catch (error) {
      console.error('Error saving menu items:', error);
      throw error; // Propagation de l'erreur
      
    } finally {
      stmt.finalizeSync(); // Libère la mémoire native
      console.log('Menu items saved to the database');
    }
  });
}

/**
 * Recherche par texte + catégories actives.
 * Si aucun filtre n’est appliqué, renvoie tout le catalogue.
 */
export async function filterByQueryAndCategories(query, activeCategories) {
  const db = await getDb();

  if (!query && activeCategories.length === 0) {
    return db.getAllAsync('SELECT * FROM menuitems');
  }

  const clauses = [];
  const params  = [];

  if (query) {
    clauses.push('name LIKE ?');
    params.push(`%${query}%`);
  }

  if (activeCategories.length) {
    clauses.push(`category IN (${activeCategories.map(() => '?').join(', ')})`);
    params.push(...activeCategories.map((c:string)=> c.toLowerCase()));
  }

  const sql = `SELECT * FROM menuitems WHERE ${clauses.join(' AND ')}`;
  return db.getAllAsync(sql, params);
}
export async function truncateMenuItems() {
    const db = await getDb();
    await db.execAsync('DELETE FROM menuitems');
}
export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}