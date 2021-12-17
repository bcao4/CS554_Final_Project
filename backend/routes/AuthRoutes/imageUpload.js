const express = require('express');
const router = express.Router();
const multer = require('multer');
const im = require('imagemagick');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const allowedMimes = ['image/*'];

const fileFilter = (req, file, cb) => {
	if (allowedMimes.includes(file.mimetype)) cb(null, true);
	else cb(null, false);
};

const upload = multer({
	limits: { fileSize: '5 * 1024 * 1024', files: 1 },
	fileFilter: fileFilter,
});

const convertImage = (image) => {
	return new Promise((resolve, reject) => {
		im.resize(
			{ srcData: image, width: 256, height: 256},
			(err, stdout) => {
				if (err) reject(err);
				resolve(stdout);
			}
		);
	});
};

const uploadImage = (file, transformed) => {
	return new Promise(async (resolve, reject) => {
		try {
			const db = admin.firestore();
			const storage = admin.storage();
			const localPath = './images/' + file.originalname;
			fs.writeFileSync(localPath, transformed, 'binary');
			let bucketStorage = await storage
				.bucket('gs://cs554-final-project-25ab2.appspot.com')
				.upload(path.join(__basedir, 'images', file.originalname), {
					public: true,
				});
			fs.unlinkSync(localPath);
			resolve(a[0].metadata.mediaLink);
		} catch (e) {
			reject(e);
		}
	});
};

router.post('/', upload.single('photo'),async (req, res, next) => {
        if (req.file) {
				let convertImg = await convertImage(req.file.buffer);
				let url = await uploadImage(req.file, convertImg);
				res.status(200).json({ img: url });
		} else {
			res.status(400).json('No file attached');
		}
	}
);

module.exports = router;
