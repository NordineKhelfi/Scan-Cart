import React, { useState, useRef } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { CartItem } from "../db";

interface CartProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onFinishTrip: () => void;
}

export default function Cart({ items, onRemoveItem, onFinishTrip }: CartProps) {
  const [height, setHeight] = useState(35); // Initial height in vh
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startHeight = useRef(35);
  const listRef = useRef<HTMLDivElement>(null);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);

    startY.current = e.touches[0].clientY;
    startHeight.current = height;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaY = e.touches[0].clientY - startY.current;
    const vhDelta = (deltaY / window.innerHeight) * 100;

    let newHeight = startHeight.current - vhDelta;
    newHeight = Math.max(15, Math.min(85, newHeight)); // Clamp between 15vh and 85vh

    setHeight(newHeight);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    // Snap to top or bottom
    if (height > 57) setHeight(80);
    else setHeight(35);
  };

  return (
    <div
      className="cart-container glass-panel"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: `${height}dvh`,
        display: "flex",
        flexDirection: "column",
        borderTopLeftRadius: "1.5rem",
        borderTopRightRadius: "1.5rem",
        padding: "0 1.5rem 1.5rem 1.5rem",
        boxShadow: "var(--shadow-lg)",
        zIndex: 20,
        transition: isDragging
          ? "none"
          : "height 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "none" }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "0.75rem 0",
            cursor: "grab",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "5px",
              backgroundColor: "var(--text-secondary)",
              borderRadius: "3px",
              opacity: 0.5,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Total</h2>
          <h2
            style={{
              fontSize: "1.5rem",
              margin: 0,
              color: "var(--primary-accent)",
            }}
          >
            {total.toFixed(2)} DA
          </h2>
        </div>
      </div>

      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "1rem",
          paddingRight: "0.5rem",
        }}
      >
        {items.length === 0 ? (
          <div
            style={{
              display: "flex",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
            }}
          >
            <p>Your cart is empty. Scan an item!</p>
          </div>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem",
                  backgroundColor: "var(--bg-surface)",
                  borderRadius: "0.5rem",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600" }}>{item.name}</div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {item.quantity > 1 ? `${item.quantity} x ` : ""}
                    {item.price.toFixed(2)} DA
                  </div>
                </div>
                <div style={{ fontWeight: "700", marginRight: "1rem" }}>
                  {(item.price * item.quantity).toFixed(2)} DA
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--danger)",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    padding: "0.25rem",
                  }}
                >
                  <MdDeleteOutline />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <button
          className="btn btn-primary animate-fade-in"
          style={{ width: "100%" }}
          onClick={onFinishTrip}
        >
          Finish
        </button>
      )}
    </div>
  );
}
