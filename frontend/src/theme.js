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
      color: "#4169e1", // royal blue
    },
    price: {
      green: "#7CFC00",
      red: "red",
    },
    background: {
      color: "#696969",
    },
    button: {
      color: "white",
      backgroundColor: blue[400],
      selected: "blue",
    },
    loadingBar: {
      color: "#1e90ff", // dodgerblue
    },
  },
});
