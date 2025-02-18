import { useState } from "react";
import { useForm } from "react-hook-form";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "firebase/firebase";
import { MDButton, MDInput, MDBox, MDTypography } from "components";
import { Autocomplete } from "@mui/material";

const DailyDeliveryForm = ({ suppliers }) => {
  const { register, handleSubmit, reset, control } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const supplierRef = doc(db, "milk_suppliers", data.supplierId);
      
      await addDoc(collection(supplierRef, "deliveries"), {
        liters: Number(data.liters),
        date: serverTimestamp(),
        verified: false,
        receiverId: "currentUserId" // Reemplazar con ID real del usuario
      });
      
      reset();
      // Mostrar notificación de éxito
    } catch (error) {
      console.error("Error registrando entrega:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBox component="form" onSubmit={handleSubmit(onSubmit)} p={3}>
      <MDTypography variant="h5" mb={3}>Registro Diario de Leche</MDTypography>
      
      <Autocomplete
        options={suppliers}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <MDInput 
            {...params} 
            label="Proveedor" 
            required 
            {...register("supplierId")}
          />
        )}
        sx={{ mb: 2 }}
      />

      <MDInput
        label="Litros entregados"
        type="number"
        fullWidth
        inputProps={{ step: "0.5" }}
        {...register("liters", { required: true, min: 1 })}
        sx={{ mb: 2 }}
      />

      <MDButton 
        type="submit" 
        variant="gradient" 
        color="info"
        disabled={loading}
      >
        {loading ? "Registrando..." : "Guardar Entrega"}
      </MDButton>
    </MDBox>
  );
};

export default DailyDeliveryForm;