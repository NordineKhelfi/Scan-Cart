import { useState, useEffect } from "react";

export default function ItemModal({ isOpen, initialData, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "");
      setPrice(initialData?.price || "");
      setQuantity(1);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !price || isNaN(price)) return;
    onSave({
      name: name.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      barcode: initialData?.barcode || null,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center", // Align to bottom for a bottom-sheet feel on mobile
        padding: "0",
      }}
    >
      <div
        className="glass-panel animate-slide-up"
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "1.5rem",
          paddingBottom: "3rem",
          borderTopLeftRadius: "1.5rem",
          borderTopRightRadius: "1.5rem",
          backgroundColor: "var(--bg-surface)",
          boxShadow: "0 -4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
          {initialData?.barcode ? "Scanned Item" : "Manual Item"}
        </h2>
        {initialData?.barcode && (
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            Barcode: {initialData.barcode}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.25rem",
                fontSize: "0.875rem",
              }}
            >
              Item Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Milk 1 Gal"
              autoFocus={!initialData?.name}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.25rem",
                  fontSize: "0.875rem",
                }}
              >
                Price (DA)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                autoFocus={!!initialData?.name && !initialData?.price}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.25rem",
                  fontSize: "0.875rem",
                  textAlign: "center",
                }}
              >
                Qty
              </label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn btn-secondary"
                  style={{ padding: "0.5rem 0.75rem" }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  style={{
                    width: "3rem",
                    textAlign: "center",
                    padding: "0.75rem 0.25rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="btn btn-secondary"
                  style={{ padding: "0.5rem 0.75rem" }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 2 }}
            >
              Add to Cart
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
