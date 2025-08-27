const sharp = require("sharp");
const fetch = require("node-fetch");

exports.handler = async function (event) {
  try {
    const url = event.queryStringParameters.img;
    if (!url) {
      return {
        statusCode: 400,
        body: "⚠️ Tambahkan ?img=URL_GAMBAR_BLOGSPOT"
      };
    }

    // Ambil gambar asli dari Blogspot
    const res = await fetch(url);
    const buffer = Buffer.from(await res.arrayBuffer());

    // Ambil frame PNG dari GitHub
    const frameUrl = "https://rawcdn.githack.com/bersamakitanews/bersamakitanews/main/frame-bersamakitanews.png";
    const resFrame = await fetch(frameUrl);
    const bufferFrame = Buffer.from(await resFrame.arrayBuffer());

    // Gabungkan gambar asli + frame
    const finalImage = await sharp(buffer)
      .composite([{ input: bufferFrame, gravity: "center" }])
      .png()
      .toBuffer();

    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png" },
      body: finalImage.toString("base64"),
      isBase64Encoded: true
    };
  } catch (err) {
    return { statusCode: 500, body: "❌ Error: " + err.message };
  }
};
