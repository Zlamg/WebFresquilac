import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "firebase/firebase";
import { MDBox, MDButton, MDInput, MDTypography } from "components";

const StockClosing = ({ products }) => {
  const [counts, setCounts] = useState({});
  
  const handleStockAdjustment = async () => {
    try {
      const batch = [];
      
      products.forEach(product => {
        if (counts[product.id] !== undefined) {
          const adjustment = {
            productId: product.id,
            previousStock: product.stock,
            newStock: counts[product.id],
            timestamp: serverTimestamp(),
            modifiedBy: "currentUserId"
          };
          
          // Actualizar producto
          batch.push(updateDoc(doc(db, "products", product.id), {
            stock: counts[product.id]
          }));
          
          // Registrar en historial
          batch.push(addDoc(collection(db, "stock_history"), adjustment));
        }
      });
      
      await Promise.all(batch);
      // Mostrar confirmación
    } catch (error) {
      console.error("Error actualizando stock:", error);
    }
  };

  return (
    <MDBox m={3}>
      <MDTypography variant="h4" mb={3}>Cierre Diario de Inventario</MDTypography>
      
      {products.map(product => (
        <MDBox key={product.id} display="flex" alignItems="center" gap={2} mb={2}>
          <MDTypography variant="h6" width={200}>{product.name}</MDTypography>
          <MDTypography>Stock actual: {product.stock}</MDTypography>
          <MDInput
            type="number"
            label="Conteo físico"
            value={counts[product.id] ?? ""}
            onChange={(e) => setCounts(prev => ({
              ...prev,
              [product.id]: Number(e.target.value)
            }))}
          />
        </MDBox>
      ))}
      
      <MDButton 
        variant="gradient" 
        color="success"
        onClick={handleStockAdjustment}
      >
        Confirmar Ajustes
      </MDButton>
    </MDBox>
  );
};