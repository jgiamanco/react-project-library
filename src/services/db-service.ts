
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface UserData {
  email: string;
  displayName: string;
  photoURL?: string;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
}

interface AppDB extends DBSchema {
  users: {
    key: string;
    value: UserData;
  };
  todos: {
    key: string;
    value: TodoItem;
    indexes: {
      'by-user': string;
    };
  };
}

let db: IDBPDatabase<AppDB>;

export const initDB = async () => {
  if (db) return db;
  
  db = await openDB<AppDB>('react-projects-app', 1, {
    upgrade(database) {
      // Create users store
      if (!database.objectStoreNames.contains('users')) {
        database.createObjectStore('users', { keyPath: 'email' });
      }
      
      // Create todos store with user index
      if (!database.objectStoreNames.contains('todos')) {
        const todoStore = database.createObjectStore('todos', { keyPath: 'id' });
        todoStore.createIndex('by-user', 'userId');
      }
    },
  });
  
  return db;
};

// User operations
export const storeUser = async (user: UserData): Promise<UserData> => {
  await initDB();
  await db.put('users', user);
  return user;
};

export const getUser = async (email: string): Promise<UserData | undefined> => {
  await initDB();
  return db.get('users', email);
};

export const deleteUser = async (email: string): Promise<void> => {
  await initDB();
  await db.delete('users', email);
};

// Todo operations
export const getTodosByUser = async (userId: string): Promise<TodoItem[]> => {
  await initDB();
  return db.getAllFromIndex('todos', 'by-user', userId);
};

export const storeTodo = async (todo: TodoItem): Promise<TodoItem> => {
  await initDB();
  await db.put('todos', todo);
  return todo;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await initDB();
  await db.delete('todos', id);
};

export const deleteAllTodosByUser = async (userId: string): Promise<void> => {
  await initDB();
  const todos = await getTodosByUser(userId);
  const tx = db.transaction('todos', 'readwrite');
  await Promise.all(todos.map(todo => tx.store.delete(todo.id)));
  await tx.done;
};
