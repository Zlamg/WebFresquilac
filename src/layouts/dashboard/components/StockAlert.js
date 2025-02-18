// En /layouts/dashboard/components/StockAlert.js
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const StockAlert = ({ productName, stock }) => (
  <MDBox bgColor="error" color="white" p={2} borderRadius="md">
    <MDTypography variant="h6">{productName}</MDTypography>
    <MDTypography variant="body2">Stock restante: {stock}</MDTypography>
  </MDBox>
);