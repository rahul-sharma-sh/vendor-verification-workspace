import { Router } from "express";

import {
  getDocumentController,
  extractDocumentController,
  getVendorDocumentsController,
  compareVendorDocumentsController,
  uploadDocumentController,
} from "../controllers/document.controller.js";

import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.post(
  "/upload",
  upload.single("document"),
  uploadDocumentController
);


router.get(
  "/vendor/:vendorId",
  getVendorDocumentsController
);

router.get(
  "/vendor/:vendorId/comparison",
  compareVendorDocumentsController
);

router.get(
  "/:id",
  getDocumentController
);

router.post(
  "/:id/extract",
  extractDocumentController
);


export default router;