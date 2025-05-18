const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

exports.getSignedURL = async (req, res) => {
    const { fileType } = req.query;
    const fileName = `${req.user.userId}/profile-pictures/${Date.now()}.${fileType.split("/")[1]}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    res.json({
        uploadUrl,
        fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
    });
}

exports.deleteFile = async (req, res) => {
    try {
        const { fileKey } = req.body;

        if (!fileKey) {
            return res.status(400).json({ error: "Missing file key" });
        }

        const userId = req.user?.userId;

        if (!fileKey.startsWith(`${userId}/profile-pictures/`)) {
            return res.status(403).json({ error: "Unauthorized to delete this file" });
        }

        const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
        });

        await s3.send(deleteCommand);

        res.status(200).json({ success: true, message: "File deleted successfully" });
    } catch (err) {
        console.error("Error deleting file:", err);
        res.status(500).json({ error: "Failed to delete file" });
    }
};