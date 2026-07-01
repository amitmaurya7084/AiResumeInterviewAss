import { ImageKit } from "@imagekit/nodejs";
const imagkit = new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,

});
export default imagkit
