import { doSignOut } from "../../firebase/FirebaseFunctions";
import { Button } from "@mui/material";
import "../../App.css";

const SignOutButton = (props) => {
  return (
    <Button {...props} variant="contained" onClick={doSignOut}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;
