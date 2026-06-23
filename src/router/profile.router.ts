import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { ProfileService } from "../service/profile/profile.service";
import { ProfileController } from "../controller/profile/profile.controller";

const profileRouter = Router();
const profileService = new ProfileService();
const profileController = new ProfileController(profileService);

profileRouter.get("/", authenticate, profileController.getProfile);

// profileRouter.put("/:id",authenticate, updateProfilePhoto)
export default profileRouter;
