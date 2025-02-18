import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "firebase/firebase";
import { MDBox } from "components";
import DailyDeliveryForm from "./components/DailyDeliveryForm";
import DeliveriesTable from "./components/DeliveriesTable";
import ExcelImport from "./components/ExcelImport";

const SuppliersLayout = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const snapshot = await getDocs(collection(db, "milk_suppliers"));
      setSuppliers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchSuppliers();
  }, []);

  return (
    <MDBox>
      <DailyDeliveryForm suppliers={suppliers} />
      <ExcelImport />
      <DeliveriesTable />
    </MDBox>
  );
};

export default SuppliersLayout;