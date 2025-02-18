import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "firebase/firebase";
import { MDBox, MDTypography } from "components";
import WarningIcon from "@mui/icons-material/Warning";

const StockAlerts = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "products"),
      where("stock", "<=", "minStock")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLowStockProducts(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <MDBox m={3} p={2} bgcolor="error.light" borderRadius="md">
      <MDTypography variant="h5" mb={2}>
        <WarningIcon fontSize="large" /> Alertas de Stock
      </MDTypography>
      
      {lowStockProducts.map(product => (
        <MDBox key={product.id} display="flex" gap={1}>
          <MDTypography fontWeight="bold">{product.name}:</MDTypography>
          <MDTypography>
            Stock actual {product.stock} (Mínimo: {product.minStock})
          </MDTypography>
        </MDBox>
      ))}
    </MDBox>
  );
};