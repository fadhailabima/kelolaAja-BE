import { Router } from "express";
import { IndustryController } from "../controllers/industry.controller";
import { detectLocale } from "../middlewares/locale.middleware";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Public
router.get("/", detectLocale, IndustryController.listPublicIndustries);

// Admin - base industry
router.get("/admin/all", authenticate, authorize("Admin", "Editor"), IndustryController.listIndustries);
router.get("/admin/:id", authenticate, authorize("Admin", "Editor"), IndustryController.getIndustryDetail);
router.post("/admin", authenticate, authorize("Admin"), IndustryController.createIndustry);
router.put("/admin/:id", authenticate, authorize("Admin"), IndustryController.updateIndustry);
router.delete("/admin/:id", authenticate, authorize("Admin"), IndustryController.deleteIndustry);

// Admin - problems
router.get("/admin/:industryId/problems", authenticate, authorize("Admin", "Editor"), IndustryController.listProblems);
router.post("/admin/:industryId/problems", authenticate, authorize("Admin"), IndustryController.createProblem);
router.put("/admin/problems/:problemId", authenticate, authorize("Admin"), IndustryController.updateProblem);
router.delete("/admin/problems/:problemId", authenticate, authorize("Admin"), IndustryController.deleteProblem);

// Admin - solutions
router.get("/admin/:industryId/solutions", authenticate, authorize("Admin", "Editor"), IndustryController.listSolutions);
router.post("/admin/:industryId/solutions", authenticate, authorize("Admin"), IndustryController.createSolution);
router.put("/admin/solutions/:solutionId", authenticate, authorize("Admin"), IndustryController.updateSolution);
router.delete("/admin/solutions/:solutionId", authenticate, authorize("Admin"), IndustryController.deleteSolution);

// Admin - media
router.get("/admin/:industryId/media", authenticate, authorize("Admin", "Editor"), IndustryController.listMedia);
router.post("/admin/:industryId/media", authenticate, authorize("Admin"), IndustryController.addMedia);
router.put("/admin/media/:mediaId", authenticate, authorize("Admin"), IndustryController.updateMedia);
router.delete("/admin/media/:mediaId", authenticate, authorize("Admin"), IndustryController.deleteMedia);

// Public detail
router.get("/:slug", detectLocale, IndustryController.getPublicIndustry);

export default router;
