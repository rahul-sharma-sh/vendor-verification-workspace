// import { Router } from "express";

// import {
//   createVendorController,
//   deleteVendorController,
//   getVendorByIdController,
//   getVendorsController,
//   updateVendorController,
//   updateVendorStatusController
// } from "../controllers/vendor.controller.js";

// const router = Router();

// router.post("/", createVendorController);

// router.get("/", getVendorsController);

// router.get("/:id", getVendorByIdController);

// router.patch("/:id", updateVendorController);

// router.patch(
//   "/:id/status",
//   updateVendorStatusController
// );

// router.delete("/:id", deleteVendorController);

// export default router;


import { Router } from "express";

import {
  createVendorController,
  deleteVendorController,
  getVendorByIdController,
  getVendorsController,
  updateVendorController,
  updateVendorStatusController,
  sendMissingDocumentEmailController,
  verifyVendorWithOpenCorporatesController,
} from "../controllers/vendor.controller.js";

import {
  getVendorVersionsController,
  restoreVendorVersionController,
} from "../controllers/vendor-version.controller.js";

const router = Router();

router.post("/", createVendorController);

router.get("/", getVendorsController);

router.get(
  "/:id/versions",
  getVendorVersionsController
);

router.post(
  "/:id/versions/:versionId/restore",
  restoreVendorVersionController
);

router.get("/:id", getVendorByIdController);

router.patch("/:id", updateVendorController);

router.patch(
  "/:id/status",
  updateVendorStatusController
);

router.post(
  "/:id/verify-opencorporates",
  verifyVendorWithOpenCorporatesController
);

router.post(
  "/:id/missing-documents/email",
  sendMissingDocumentEmailController
);



router.delete("/:id", deleteVendorController);

export default router;