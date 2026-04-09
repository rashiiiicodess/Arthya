
import userModal from "../models/userModel.js";
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModal.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}