import { createTheme } from "@mui/material/styles";
import { orange, blue, lightGreen, red, lightBlue } from "@mui/material/colors";

// https://mui.com/customization/color/
// https://mui.com/customization/theming/
// https://mui.com/system/basics/
// https://mui.com/customization/theme-components/#global-style-overrides

export const theme = createTheme({
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": { color: "black", backgroundColor: "white" },
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          "&.MuiPaginationItem-circular": { color: "#ff7780" },
          "&.Mui-selected": { color: "#ea1337", backgroundColor: "#FFFFFF" },
        },
      },
    },
  },
  status: {
    danger: orange[500],
  },
  palette: {
    primary: {
      main: blue[300],
    },
    secondary: {
      main: red["A700"],
    },
    text: {
      primary: "#000000",
      secondary: "#ffffff",
    },
    link: {
      color: lightBlue["A100"],
    },
    price: {
      green: lightGreen["A400"],
      red: red[200],
    },
    background: {
      color: "rgb(55, 57, 59)",
    },
    button: {
      color: "white",
      backgroundColor: "#0072ee",
    },
    loadingBar: {
      color: lightBlue[500],
    },
  },
});
