import { createTheme } from "@mui/material/styles";
import { orange, blue } from "@mui/material/colors";

// https://mui.com/customization/color/
export const theme = createTheme({
  status: {
    danger: orange[500],
  },
  palette: {
    primary: {
      main: blue[300],
    },
    secondary: {
      main: "#f50057",
    },
    text: {
      primary: "#000000",
      secondary: "#ffffff",
      
    },
    link: {
      color: "#e4e8ff", // royal blue
    },
    price: {
      green: "#a8ff84",
      red: "#ffaaaa",
    },
    background: {
      color: "rgb(55, 57, 59)",
    },
    button: {
      color: "white",
      backgroundColor: "#0072ee",
      selected: "blue",
    },
    loadingBar: {
      color: "#1e90ff", // dodgerblue
    },
  },
});
