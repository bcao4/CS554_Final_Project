import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../firebase/Auth";
import "./accountPage.css";
import 'firebase/firestore';
import app from 'firebase/app'
const db = app.firestore();

const UploadImage = () => {
    const { currentUser } = useContext(AuthContext);
    const [selectedFile, setSelectedFile] = useState(null);
	let uid = currentUser.uid;
	const [userData, setUserData] = useState({});
	const [url, setURL] = useState('');

    useEffect(() => {
		async function fetchData() {
			var docRef = db.collection('profilePics').doc(uid);
			docRef
				.get()
				.then(function (doc) {
					if (doc.exists) {
						console.log('Document data:', doc.data());
						setUserData(doc.data());
					} else {
						console.log('No file found!');
					}
				})
				.catch(function (e) {
					console.log(e);
				});
		}
		fetchData();
	}, [url,uid]);

	const updateProfileImage = (uid, imgUrl) =>
		db.collection('profilePics').doc(uid).set(
			{
				imageUrl: imgUrl,
			},
			{ merge: true }
		);

    const handleChange = async (e) => {
        setSelectedFile(e.target.files[0]);
    }
    
    async function handleUpload(e) {
        e.preventDefault();
        const storage = app.storage();
            const uploadTask = storage.ref(`/profilePics/${selectedFile.name}`).put(selectedFile);
            uploadTask.on('state_changed',
                (snapShot) => {
                    console.log(snapShot)
                }, (err) => {
                    console.log(err)
                }, () => {
                    storage.ref('profilePics').child(selectedFile.name).getDownloadURL()
                        .then(async(fireBaseUrl) => {
                            selectedFile.value = "";
                            setURL(fireBaseUrl);
                            await updateProfileImage(uid, fireBaseUrl);
                        })
                });
    }

    return (
        <div>
            <form onSubmit={handleUpload}>
                <img className="profile-pic"
                    src={userData.imageUrl ? userData.imageUrl :
                        'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
                    }
                    alt="Profile icon"
                />
                <br />
                <br />
                <input
                    type="file"
                    onChange={handleChange}
                    accept="image/jpeg, image/png, .jpeg, .jpg, .png"
                    className="image-input"
                />
                <br />
                <br />
                <button className="btn-img-upload" type="submit">
                    Upload
                </button>
            </form>
        </div>
    );
}

export default UploadImage;