import { doSignOut } from "../../firebase/FirebaseFunctions";
import "../../App.css";

const SignOutButton = () => {
  return (
    <button className="btn-signout" type="button" onClick={doSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
