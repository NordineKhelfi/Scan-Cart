import { useState, useEffect } from "react";
import { db, Store, CartItem } from "./db";
import StoreSelector from "./components/StoreSelector";
import Scanner from "./components/Scanner";
import Cart from "./components/Cart";
import ItemModal, { ItemData, SavedItemData } from "./components/ItemModal";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ItemData | null>(null);

  // Load cart on mount (if resuming an interrupted trip)
  useEffect(() => {
    const loadCart = async () => {
      const items = await db.cart.toArray();
      if (items.length > 0) {
        setCartItems(items);
      }
    };
    loadCart();

    const savedStoreId = localStorage.getItem("currentStoreId");
    if (savedStoreId) {
      db.stores.get(savedStoreId).then((store) => {
        if (store) setCurrentStore(store);
      });
    }
  }, []);

  const handleSelectStore = (store: Store) => {
    setCurrentStore(store);
    localStorage.setItem("currentStoreId", store.id);
  };

  const handleScan = async (barcode: string) => {
    if (isModalOpen) return; // ignore scans if modal is already open

    const product = await db.products.get(barcode);
    let priceData = null;
    if (currentStore) {
      // Fallback to JS filter if compound index issues arise, but Dexie handles it nicely.
      priceData =
        (await db.prices
          .where({ storeId: currentStore.id, barcode })
          .first()) ||
        (await db.prices
          .where("barcode")
          .equals(barcode)
          .and((p) => p.storeId === currentStore.id)
          .first());
    }

    setModalData({
      barcode,
      name: product ? product.name : "",
      price: priceData ? priceData.price : "",
    });
    setIsModalOpen(true);
  };

  const handleManualItem = () => {
    setModalData(null); // No barcode
    setIsModalOpen(true);
  };

  const handleSaveItem = async (itemData: SavedItemData) => {
    const { name, price, quantity, barcode } = itemData;

    // 1. Update Global Catalog and Prices if it has a barcode
    if (barcode) {
      await db.products.put({ barcode, name });
      if (currentStore) {
        const existingPrice = await db.prices
          .where("barcode")
          .equals(barcode)
          .and((p) => p.storeId === currentStore.id)
          .first();
        if (existingPrice) {
          await db.prices.update(existingPrice.id, {
            price,
            updatedAt: Date.now(),
          });
        } else {
          await db.prices.add({
            id: uuidv4(),
            storeId: currentStore.id,
            barcode,
            price,
            updatedAt: Date.now(),
          });
        }
      }
    }

    // 2. Add to Cart
    const cartItem: CartItem = {
      id: uuidv4(),
      barcode: barcode || null,
      name,
      price,
      quantity,
    };
    await db.cart.add(cartItem);
    setCartItems((prev) => [...prev, cartItem]);

    setIsModalOpen(false);
    setModalData(null);
  };

  const handleRemoveItem = async (id: string) => {
    await db.cart.delete(id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFinishTrip = async () => {
    if (
      window.confirm(
        "Are you sure you want to finish this trip and clear your cart?",
      )
    ) {
      await db.cart.clear();
      setCartItems([]);
      setCurrentStore(null);
      localStorage.removeItem("currentStoreId");
    }
  };

  if (!currentStore && cartItems.length === 0) {
    return <StoreSelector onSelectStore={handleSelectStore} />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
      }}
    >
      <div
        style={{ position: "absolute", top: "15px", right: "15px", zIndex: 30 }}
      >
        <button
          className="btn btn-secondary"
          onClick={handleManualItem}
          style={{
            borderRadius: "2rem",
            padding: "0.5rem 1rem",
            boxShadow: "var(--shadow-md)",
          }}
        >
          + Add Manual
        </button>
      </div>

      {currentStore && (
        <div
          className="glass-badge"
          style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            zIndex: 30,
          }}
        >
          🛍️ {currentStore.name}
        </div>
      )}

      <Scanner onScan={handleScan} />

      <Cart
        items={cartItems}
        onRemoveItem={handleRemoveItem}
        onFinishTrip={handleFinishTrip}
      />

      <ItemModal
        isOpen={isModalOpen}
        initialData={modalData}
        onSave={handleSaveItem}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}
