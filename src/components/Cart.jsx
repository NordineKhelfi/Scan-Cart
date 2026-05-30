import React from 'react';
import { MdDeleteOutline } from 'react-icons/md';

export default function Cart({ items, onRemoveItem, onFinishTrip }) {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="cart-container glass-panel" style={{ 
      flex: 1, 
      minHeight: 0,
      display: 'flex', 
      flexDirection: 'column', 
      borderTopLeftRadius: '1.5rem', 
      borderTopRightRadius: '1.5rem',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-lg)',
      marginTop: '-20px', 
      zIndex: 20,
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Total</h2>
        <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--primary-accent)' }}>
          {total.toFixed(2)} DA
        </h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.5rem' }}>
        {items.length === 0 ? (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <p>Your cart is empty. Scan an item!</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map(item => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: '0.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>{item.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {item.quantity > 1 ? `${item.quantity} x ` : ''}{item.price.toFixed(2)} DA
                  </div>
                </div>
                <div style={{ fontWeight: '700', marginRight: '1rem' }}>
                  {(item.price * item.quantity).toFixed(2)} DA
                </div>
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '1.5rem', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <MdDeleteOutline />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <button className="btn btn-primary animate-fade-in" style={{ width: '100%' }} onClick={onFinishTrip}>
          Finish
        </button>
      )}
    </div>
  );
}
