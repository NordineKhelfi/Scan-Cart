import { useState, useEffect, FormEvent } from 'react';
import { db, Store } from '../db';
import { v4 as uuidv4 } from 'uuid';

interface StoreSelectorProps {
  onSelectStore: (store: Store) => void;
}

export default function StoreSelector({ onSelectStore }: StoreSelectorProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [newStoreName, setNewStoreName] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      const allStores = await db.stores.toArray();
      setStores(allStores);
    };
    fetchStores();
  }, []);

  const handleSelect = (store: Store) => {
    onSelectStore(store);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;
    
    const newStore: Store = {
      id: uuidv4(),
      name: newStoreName.trim()
    };
    await db.stores.add(newStore);
    onSelectStore(newStore);
  };

  return (
    <div className="store-selector animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '2rem', textAlign: 'center' }}>Where are you shopping?</h1>
      
      {stores.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Recent Stores</h3>
          {stores.map(store => (
            <button 
              key={store.id} 
              className="btn btn-secondary" 
              onClick={() => handleSelect(store)}
              style={{ justifyContent: 'flex-start', padding: '1rem', fontSize: '1.1rem' }}
            >
              🛍️ {store.name}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>New Store</h3>
        <input 
          type="text" 
          placeholder="e.g. Walmart, Target..." 
          value={newStoreName}
          onChange={(e) => setNewStoreName(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={!newStoreName.trim()}>
          Start Shopping
        </button>
      </form>
    </div>
  );
}
