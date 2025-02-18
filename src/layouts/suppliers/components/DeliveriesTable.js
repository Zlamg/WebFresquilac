import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { collectionGroup, query, where, getDocs } from "firebase/firestore";
import { db } from "firebase/firebase";
import { MDBox } from "components";

const DeliveriesTable = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");

  const columns = [
    { field: "supplier", headerName: "Proveedor", width: 200 },
    { field: "liters", headerName: "Litros", width: 120 },
    { field: "date", headerName: "Fecha", width: 180 },
    { field: "verified", headerName: "Verificado", width: 130 },
  ];

  useEffect(() => {
    const fetchDeliveries = async () => {
      let q = query(collectionGroup(db, "deliveries"));
      
      if (filterDate) {
        q = query(q, where("date", ">=", new Date(filterDate)));
      }
      
      const snapshot = await getDocs(q);
      const data = await Promise.all(snapshot.docs.map(async (doc) => {
        const supplierRef = doc.ref.parent.parent;
        const supplierSnap = await getDoc(supplierRef);
        return {
          id: doc.id,
          supplier: supplierSnap.data().name,
          ...doc.data(),
          date: new Date(doc.data().date?.toDate()).toLocaleDateString()
        };
      }));
      
      setDeliveries(data);
    };

    fetchDeliveries();
  }, [filterDate, filterSupplier]);

  return (
    <MDBox m={3} sx={{ height: 500, width: '100%' }}>
      <MDBox mb={2} display="flex" gap={2}>
        <MDInput
          type="date"
          label="Filtrar por fecha"
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <MDInput
          label="Filtrar por proveedor"
          onChange={(e) => setFilterSupplier(e.target.value)}
        />
      </MDBox>
      
      <DataGrid
        rows={deliveries}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
      />
    </MDBox>
  );
};

export default DeliveriesTable;