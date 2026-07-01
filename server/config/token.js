import jwt from "jsonwebtoken"
import { use } from "react"
const genToken = async (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expireIn: "7d" }

        )
        return token;
    } catch (err) {
        console.log(err)
    }
}
export default genToken;