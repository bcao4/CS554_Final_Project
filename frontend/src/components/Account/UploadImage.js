import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../firebase/Auth";
import { Button } from "@mui/material";
import "./accountPage.css";
import "firebase/firestore";
import app from "firebase/app";
const db = app.firestore();

const UploadImage = () => {
  const { currentUser } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userData, setUserData] = useState({});
  const [url, setURL] = useState("");
  let uid = currentUser.uid;

  useEffect(() => {
    async function fetchData() {
      var docRef = db.collection("profilePics").doc(uid);
      docRef
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setUserData(doc.data());
          } else {
            console.log("No file found!");
          }
        })
        .catch(function (e) {
          console.log(e);
        });
    }
    fetchData();
  }, [url, uid]);

  const updateProfileImage = (uid, imgUrl) =>
    db.collection("profilePics").doc(uid).set(
      {
        imageUrl: imgUrl,
      },
      { merge: true }
    );

  const handleChange = async (e) => {
    setSelectedFile(e.target.files[0]);
  };

  async function handleUpload(e) {
    e.preventDefault();
    const storage = app.storage();
    const uploadTask = storage
      .ref(`/profilePics/${selectedFile.name}`)
      .put(selectedFile);
    uploadTask.on(
      "state_changed",
      (snapShot) => {},
      (err) => {
        console.log(err);
      },
      () => {
        storage
          .ref("profilePics")
          .child(selectedFile.name)
          .getDownloadURL()
          .then(async (fireBaseUrl) => {
            selectedFile.value = "";
            setURL(fireBaseUrl);
            await updateProfileImage(uid, fireBaseUrl);
          });
      }
    );
  }

  return (
    <div>
      <form onSubmit={handleUpload}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
            height: "350px",
          }}
        >
          <img
            className="profile-pic"
            src={
              userData.imageUrl
                ? userData.imageUrl
                : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
            }
            alt="Profile icon"
          />
          <div>
            <Button
              variant="contained"
              component="label"
              style={{ marginRight: "10px" }}
            >
              Choose File
              <input
                type="file"
                hidden
                onChange={handleChange}
                accept="image/jpeg, image/png, .jpeg, .jpg, .png"
              />
            </Button>
            <Button variant="contained" type="submit">
              Upload
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadImage;
