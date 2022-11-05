import { useContext, useState } from "react";
import { AuthContext } from "../../firebase/Auth";
import { doChangePassword } from "../../firebase/FirebaseFunctions";
import "./accountPage.css";

const ChangePassword = () => {
  const { currentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();
    const { currentPassword, newPasswordOne, newPasswordTwo } =
      e.target.elements;
    if (newPasswordOne.value !== newPasswordTwo.value) {
      setPwMatch("New password do not match, please try again");
      return false;
    }

    try {
      await doChangePassword(
        currentUser.email,
        currentPassword.value,
        newPasswordOne.value
      );
      alert("Password has been changed successfully, you will be logged out");
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser.providerData[0].providerId === "password") {
    return (
      <div>
        <div className="form-body">
          <h2>Reset Password</h2>
          {pwMatch && <h4 className="error">{pwMatch}</h4>}
          <form onSubmit={submitForm}>
            <div>
              <div>
                <label>
                  Current Password:
                  <input
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="Current Password"
                    required
                  ></input>
                </label>
              </div>
              <br />
              <div>
                <label>
                  New Password:
                  <input
                    className="form-control"
                    id="newPasswordOne"
                    name="newPasswordOne"
                    type="password"
                    placeholder="New Password"
                    required
                  ></input>
                </label>
              </div>
              <br />
              <div>
                <label>
                  Confirm New Password:
                  <input
                    className="form-control"
                    id="newPasswordTwo"
                    name="newPasswordTwo"
                    type="password"
                    placeholder="Confirm New Password"
                    required
                  ></input>
                </label>
              </div>
              <br />
              <button className="btn" type="submit">
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h4>
          You are signed in using a Social Media Provider, You cannot change
          your password.
        </h4>
      </div>
    );
  }
};

export default ChangePassword;
