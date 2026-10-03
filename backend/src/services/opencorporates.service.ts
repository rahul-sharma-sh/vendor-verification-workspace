import { Vendor } from "../models/Vendor.model.js";

interface OpenCorporatesCompany {
  company_number?: string;
  name?: string;
  jurisdiction_code?: string;
  opencorporates_url?: string;
  current_status?: string;
}

interface OpenCorporatesResponse {
  results?: {
    companies?: Array<{
      company: OpenCorporatesCompany;
    }>;
  };
}

function normalizeCompanyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/private limited|private ltd|pvt ltd|pvt\. ltd\.|limited|ltd|llp|inc|corp|corporation/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export async function verifyVendorWithOpenCorporates(
  vendorId: string
) {
  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  const apiToken = process.env.OPENCORPORATES_API_TOKEN;

  if (!apiToken) {
    throw new Error(
      "OPENCORPORATES_API_TOKEN is not configured"
    );
  }

  const params = new URLSearchParams({
    q: vendor.companyName,
    api_token: apiToken,
    per_page: "10",
    order: "score",
  });

  const url =
    `https://api.opencorporates.com/v0.4/companies/search?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `OpenCorporates API returned ${response.status}`
      );
    }

    const data =
      (await response.json()) as OpenCorporatesResponse;

    const companies = data.results?.companies ?? [];

    if (companies.length === 0) {
      vendor.openCorporatesVerification = {
        status: "Not Found",
        message: "Company was not found in OpenCorporates",
        verifiedAt: new Date(),
      };

      vendor.workflowStatus = "Action Required";

      await vendor.save();

      return vendor;
    }

    const vendorName = normalizeCompanyName(
      vendor.companyName
    );

    let matchedCompany = companies[0]?.company;

    const exactMatch = companies.find((item) => {
      const company = item.company;

      return (
        normalizeCompanyName(company.name || "") ===
        vendorName
      );
    });

    if (exactMatch) {
      matchedCompany = exactMatch.company;
    }

    if (!matchedCompany) {
      vendor.openCorporatesVerification = {
        status: "Not Found",
        message: "No valid company match found",
        verifiedAt: new Date(),
      };

      vendor.workflowStatus = "Action Required";

      await vendor.save();

      return vendor;
    }

    const isNameMatch =
      normalizeCompanyName(
        matchedCompany.name || ""
      ) === vendorName;

    if (isNameMatch) {
      vendor.openCorporatesVerification = {
        status: "Verified",
        companyNumber:
          matchedCompany.company_number,
        jurisdictionCode:
          matchedCompany.jurisdiction_code,
        matchedCompanyName:
          matchedCompany.name,
        openCorporatesUrl:
          matchedCompany.opencorporates_url,
        currentStatus:
          matchedCompany.current_status,
        verifiedAt: new Date(),
        message:
          "Company successfully verified with OpenCorporates",
      };

      vendor.workflowStatus = "Under Review";
    } else {
      vendor.openCorporatesVerification = {
        status: "Not Found",
        companyNumber:
          matchedCompany.company_number,
        jurisdictionCode:
          matchedCompany.jurisdiction_code,
        matchedCompanyName:
          matchedCompany.name,
        openCorporatesUrl:
          matchedCompany.opencorporates_url,
        currentStatus:
          matchedCompany.current_status,
        verifiedAt: new Date(),
        message:
          "Company name did not exactly match vendor name",
      };

      vendor.workflowStatus = "Action Required";
    }

    await vendor.save();

    return vendor;
  } catch (error) {
    console.error(
      "OpenCorporates verification error:",
      error
    );

    vendor.openCorporatesVerification = {
      status: "Failed",
      verifiedAt: new Date(),
      message:
        error instanceof Error
          ? error.message
          : "OpenCorporates verification failed",
    };

    vendor.workflowStatus = "Action Required";

    await vendor.save();

    throw error;
  }
}