import { useState } from "react";
import { read, utils } from "xlsx";
import { MDButton, MDBox, MDTypography } from "components";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "firebase/firebase";

const ExcelImport = () => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        setUploading(true);
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(sheet);

        for (const row of jsonData) {
          const supplierRef = doc(db, "milk_suppliers", row.supplierId);
          await setDoc(doc(collection(supplierRef, "deliveries")), {
            liters: Number(row.liters),
            date: new Date(row.date),
            verified: false
          });
        }

        // Mostrar notificación de éxito
      } catch (error) {
        console.error("Error importing data:", error);
      } finally {
        setUploading(false);
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  return (
    <MDBox p={3}>
      <MDTypography variant="h6" mb={2}>Importar desde Excel</MDTypography>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        disabled={uploading}
        hidden
        id="excel-upload"
      />
      <label htmlFor="excel-upload">
        <MDButton 
          component="span" 
          variant="gradient" 
          color="info"
          disabled={uploading}
        >
          {uploading ? "Subiendo..." : "Seleccionar Archivo"}
        </MDButton>
      </label>
      <MDTypography variant="caption" ml={2}>
        Formato requerido: ProveedorID | Litros | Fecha (YYYY-MM-DD)
      </MDTypography>
    </MDBox>
  );
};

export default ExcelImport;