import { useState, useEffect } from "react";
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "firebase/firebase";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { MDBox, MDButton, MDInput, MDTypography } from "components";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";

const ProductCRUD = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  // Obtener productos en tiempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleCreateUpdate = async (data) => {
    try {
      const productData = {
        ...data,
        stock: Number(data.stock),
        minStock: Number(data.minStock),
        productionDate: new Date(data.productionDate),
        expiryDate: new Date(data.expiryDate)
      };

      if (editProduct) {
        await updateDoc(doc(db, "products", editProduct.id), productData);
      } else {
        await addDoc(collection(db, "products"), productData);
      }
      reset();
      setEditProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const columns = [
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "type", headerName: "Tipo", width: 120 },
    { field: "stock", headerName: "Stock", width: 100 },
    { field: "minStock", headerName: "Stock Mín", width: 100 },
    {
      field: "actions",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => setEditProduct(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => deleteDoc(doc(db, "products", params.id))}
          showInMenu
        />
      ]
    }
  ];

  return (
    <MDBox m={3}>
      <MDTypography variant="h4" mb={3}>Gestión de Productos</MDTypography>
      
      <MDBox component="form" onSubmit={handleSubmit(handleCreateUpdate)} mb={4}>
        <MDBox display="flex" gap={2} mb={2}>
          <MDInput
            label="Nombre"
            fullWidth
            {...register("name", { required: true })}
          />
          <MDInput
            label="Tipo"
            select
            {...register("type", { required: true })}
          >
            <option value="queso">Queso</option>
            <option value="yogurt">Yogurt</option>
            <option value="mantequilla">Mantequilla</option>
          </MDInput>
        </MDBox>

        {/* Más campos... */}

        <MDButton type="submit" variant="gradient" color="info">
          {editProduct ? "Actualizar" : "Crear"} Producto
        </MDButton>
      </MDBox>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={products}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
    </MDBox>
  );
};