import { doSocialSignIn } from "../../firebase/FirebaseFunctions";
import google_signin from "../../images/google_signin.png";

const SocialSignIn = () => {
  const socialSignOn = async (provider) => {
    try {
      await doSocialSignIn(provider);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <img
        onClick={() => socialSignOn("google")}
        alt="google signin"
        src={google_signin}
      />
    </div>
  );
};

export default SocialSignIn;
