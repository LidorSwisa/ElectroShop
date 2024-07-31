const uploadImage = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      message: "No files were uploaded.",
      status: 400,
      error: new Error("No files were uploaded."),
    });
  }

  const fileUrls = req.files.map((file) => {
    return {
      url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
    };
  });

  res.json({
    message: "Files uploaded successfully.",
    data: fileUrls,
    status: 201,
  });
};

module.exports = {
  uploadImage,
};
