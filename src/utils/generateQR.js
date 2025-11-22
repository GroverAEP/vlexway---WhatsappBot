import QRCode from "qrcode"

export const generateQR = async (text) => {
    try {
        const qrImage = await QRCode.toDataURL(text, { errorCorrectionLevel: "H" })
        return qrImage
    } catch (error) {
        console.error("Error generando QR:", error)
    }
}
