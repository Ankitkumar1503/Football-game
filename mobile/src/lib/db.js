import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple event emitter for reactivity
const listeners = new Set();
const notifyListeners = () => {
    listeners.forEach(listener => listener());
};

export const subscribeToDb = (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};

// Helper to simulate Dexie-like API
class Collection {
    constructor(name) {
        this.name = name;
    }

    async getAll() {
        if (typeof window !== 'undefined' && window.localStorage) return []; // Fallback if accidentally run in web
        try {
            const json = await AsyncStorage.getItem(this.name);
            return json != null ? JSON.parse(json) : [];
        } catch (e) {
            console.error(`Error reading ${this.name}`, e);
            return [];
        }
    }

    async setAll(data) {
        try {
            await AsyncStorage.setItem(this.name, JSON.stringify(data));
            notifyListeners();
        } catch (e) {
            console.error(`Error writing ${this.name}`, e);
        }
    }

    async add(item) {
        const items = await this.getAll();
        const newItem = { ...item, id: Date.now() + Math.random().toString(36).substr(2, 9) }; // Simple ID generation
        items.push(newItem);
        await this.setAll(items);
        return newItem.id;
    }

    async update(id, updates) {
        const items = await this.getAll();
        const index = items.findIndex(i => i.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            await this.setAll(items);
            return 1;
        }
        return 0;
    }
    
    async delete(id) {
         const items = await this.getAll();
         const newItems = items.filter(i => i.id !== id);
         await this.setAll(newItems);
    }

    // Query builder proxy
    where(field) {
        return {
            equals: (value) => {
                return {
                    first: async () => {
                        const items = await this.getAll();
                        return items.find(i => i[field] === value);
                    },
                    toArray: async () => {
                        const items = await this.getAll();
                        return items.filter(i => i[field] === value);
                    },
                    delete: async () => {
                         const items = await this.getAll();
                         const newItems = items.filter(i => i[field] !== value);
                         await this.setAll(newItems);
                    }
                };
            }
        };
    }
    
    orderBy(field) {
        return {
             last: async () => {
                const items = await this.getAll();
                // Simple sort (assumes numbers or strings)
                items.sort((a, b) => (a[field] > b[field] ? 1 : -1));
                return items[items.length - 1];
             }
        }
    }
    
    async get(id) {
         const items = await this.getAll();
         return items.find(i => i.id === id);
    }
}

export const db = {
    sessions: new Collection('sessions'),
    touches: new Collection('touches'),
    reflections: new Collection('reflections'),
};
