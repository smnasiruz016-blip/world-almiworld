/**
 * world.almiworld.com — canonical role registry, sourced from
 * @smnasiruz016-blip/job-roles v0.1.2+ (cross-product master registry).
 *
 * Phase 5 integration: this module is a THIN ADAPTER over the shared
 * package. It preserves the historical AlmiWorld parent public surface:
 *
 *   Role                  — { name, slug, sector, aliases? }  (unchanged shape)
 *   JOB_ROLES             — 263 roles, bounded to the original AlmiWorld set
 *                           so the existing 50,759 country×role URLs DON'T
 *                           change shape (zero URL regression)
 *   BASE_ROLES            — 11 canonical base roles (unchanged)
 *   JOB_ROLES_BY_SLUG     — Map<slug, Role>
 *   JOB_ROLES_BY_SECTOR   — Map<sectorDisplayString, Role[]>
 *   getRoleBySlug(slug)   — alias + primary slug lookup (delegates to package)
 *
 * NEW for Phase 5 (role-hub gateway pages):
 *   ALL_ROLES             — full 519 from the package, used by the new
 *                           /[role-slug] hub pages (one per role across
 *                           every product in the AlmiWorld family)
 *   PACKAGE_ROLE_SLUGS    — Set<string> of all 519 slugs for O(1) dispatch
 *
 * Slug discipline: ASCII kebab, globally unique. Renames are breaking.
 *
 * Used by:
 *   - app/[slug]/page.tsx — dispatches between country hub and role hub
 *   - app/[slug]/[role]/page.tsx — country×role grid (50,759 URLs)
 *   - app/sitemap.ts — chunked sitemap emission
 *   - cross-product deep links to AlmiCV / AlmiJob / AlmiSalary / AlmiStudy
 */

import {
  getAllRoles as pkgGetAllRoles,
  getRoleBySlug as pkgGetRoleBySlug,
  Industry,
  type JobRole as PkgJobRole,
} from "@smnasiruz016-blip/job-roles";

/** Historical AlmiWorld Role shape — preserved so existing consumers
 *  compile unchanged. */
export type Role = {
  name: string;
  slug: string;
  sector: string;
  aliases?: string[];
};

/** Industry (kebab enum) → human-readable sector display string used by
 *  UI copy. Values match the original AlmiWorld parent sector strings. */
const SECTOR_LABEL: Record<Industry, string> = {
  [Industry.Healthcare]: "Healthcare & Medical",
  [Industry.Technology]: "Technology & IT",
  [Industry.Finance]: "Finance & Accounting",
  [Industry.Marketing]: "Sales & Marketing",
  [Industry.Education]: "Education & Training",
  [Industry.Legal]: "Legal",
  [Industry.Engineering]: "Engineering",
  [Industry.Trades]: "Construction & Skilled Trades",
  [Industry.Manufacturing]: "Manufacturing & Production",
  [Industry.Hospitality]: "Hospitality, Tourism & Food",
  [Industry.Beauty]: "Beauty & Personal Care",
  [Industry.ArtsMedia]: "Creative, Design & Media",
  [Industry.Government]: "Public Sector, Social & Other",
  [Industry.Administration]: "Business, Office & Admin",
  [Industry.HumanResources]: "Human Resources",
  [Industry.Retail]: "Customer Service & Retail",
  [Industry.Science]: "Science & Research",
  [Industry.Agriculture]: "Public Sector, Social & Other",
  [Industry.Religious]: "Public Sector, Social & Other",
  [Industry.Security]: "Public Sector, Social & Other",
  [Industry.Languages]: "Public Sector, Social & Other",
  [Industry.Automotive]: "Automotive",
  [Industry.RealEstate]: "Real Estate",
  [Industry.Sports]: "Sports & Athletics",
  [Industry.Executive]: "Executive Leadership",
};

/** Per-slug name override (mirrors AlmiJob: package's "Makeup Artist (Beauty)"
 *  → AlmiWorld parent's plain "Makeup Artist"). */
const NAME_OVERRIDES: Record<string, string> = {
  "makeup-artist-beauty": "Makeup Artist",
};

/** Per-slug sector override — preserves the original 18-sector taxonomy
 *  where the package's 25-industry enum collapses several into Trades.
 *  Mirrors the AlmiJob fix: 14 logistics roles stay under their own sector
 *  so any UI grouping by sector keeps the AlmiWorld visual taxonomy. */
const SECTOR_OVERRIDES: Record<string, string> = {
  driver: "Logistics, Transport & Supply Chain",
  "delivery-driver": "Logistics, Transport & Supply Chain",
  "truck-driver": "Logistics, Transport & Supply Chain",
  "warehouse-operative": "Logistics, Transport & Supply Chain",
  "forklift-operator": "Logistics, Transport & Supply Chain",
  "logistics-coordinator": "Logistics, Transport & Supply Chain",
  "supply-chain-manager": "Logistics, Transport & Supply Chain",
  "procurement-officer": "Logistics, Transport & Supply Chain",
  "inventory-controller": "Logistics, Transport & Supply Chain",
  dispatcher: "Logistics, Transport & Supply Chain",
  "fleet-manager": "Logistics, Transport & Supply Chain",
  courier: "Logistics, Transport & Supply Chain",
  "shipping-clerk": "Logistics, Transport & Supply Chain",
  "customs-officer": "Logistics, Transport & Supply Chain",
};

/** The 263 slugs in the original AlmiWorld parent JOB_ROLES — bounded
 *  allowlist controls which package roles surface in the country×role
 *  grid (the 50,759-URL sitemap surface). Adding to this expands the
 *  country×role grid; Phase 6 will reconsider.
 *
 *  This list was generated 2026-05-28 from the pre-integration roles.ts. */
const ALMIWORLD_BOUNDED_SLUGS: ReadonlySet<string> = new Set([
  "software-engineer", "software-developer", "web-developer", "frontend-developer", "backend-developer", "full-stack-developer",
  "mobile-app-developer", "devops-engineer", "data-analyst", "data-scientist", "data-engineer", "machine-learning-engineer",
  "it-support-technician", "help-desk-technician", "system-administrator", "network-engineer", "cloud-engineer", "cybersecurity-analyst",
  "qa", "database-administrator", "it-project-manager", "product-manager", "ux-designer", "ui-designer",
  "scrum-master", "registered-nurse", "nurse-practitioner", "doctor", "medical-assistant", "caregiver",
  "healthcare-assistant", "pharmacist", "pharmacy-technician", "dental-assistant", "dentist", "physiotherapist",
  "occupational-therapist", "radiographer", "lab-technician", "phlebotomist", "midwife", "paramedic",
  "medical-receptionist", "home-health-aide", "optician", "massage-therapist", "teacher", "primary-school-teacher",
  "secondary-school-teacher", "teaching-assistant", "lecturer", "tutor", "esl", "special-education-teacher",
  "school-counsellor", "academic-advisor", "trainer", "instructional-designer", "education-coordinator", "librarian",
  "childcare-worker", "nursery-assistant", "administrative-assistant", "office-manager", "executive-assistant", "personal-assistant",
  "receptionist", "office-administrator", "data-entry-clerk", "secretary", "operations-manager", "project-manager",
  "business-analyst", "management-consultant", "project-coordinator", "office-clerk", "virtual-assistant", "accountant",
  "accounts-assistant", "bookkeeper", "financial-analyst", "auditor", "tax-advisor", "payroll-officer",
  "credit-controller", "financial-controller", "investment-analyst", "bank-teller", "loan-officer", "insurance-agent",
  "actuary", "treasury-analyst", "sales-representative", "sales-manager", "account-manager", "business-development-manager",
  "marketing-manager", "marketing-executive", "digital-marketing-specialist", "seo-specialist", "social-media-manager", "content-writer",
  "copywriter", "brand-manager", "public-relations-officer", "market-research-analyst", "sales-assistant", "telesales-agent",
  "mechanical-engineer", "electrical-engineer", "civil-engineer", "structural-engineer", "chemical-engineer", "industrial-engineer",
  "process-engineer", "project-engineer", "maintenance-engineer", "automotive-engineer", "aerospace-engineer", "petroleum-engineer",
  "quality-engineer", "manufacturing-engineer", "site-engineer", "cad-technician", "chef", "sous-chef",
  "cook", "kitchen-assistant", "waiter", "barista", "bartender", "restaurant-manager",
  "hotel-manager", "receptionist-hotel", "housekeeper", "concierge", "event-coordinator", "travel-agent",
  "tour-guide", "catering-assistant", "food-beverage-manager", "electrician", "plumber", "carpenter",
  "welder", "painter-decorator", "bricklayer", "construction-worker", "site-manager", "quantity-surveyor",
  "architect", "surveyor", "hvac-technician", "heavy-equipment-operator", "roofer", "plasterer",
  "foreman", "graphic-designer", "web-designer", "interior-designer", "fashion-designer", "photographer",
  "videographer", "video-editor", "animator", "illustrator", "art-director", "creative-director",
  "journalist", "editor", "producer", "sound-engineer", "makeup-artist", "beauty-artist",
  "driver", "delivery-driver", "truck-driver", "warehouse-operative", "forklift-operator", "logistics-coordinator",
  "supply-chain-manager", "procurement-officer", "inventory-controller", "dispatcher", "fleet-manager", "courier",
  "shipping-clerk", "customs-officer", "customer-service-representative", "call-centre-agent", "customer-support-specialist", "retail-sales-associate",
  "cashier", "store-manager", "shop-assistant", "visual-merchandiser", "customer-success-manager", "front-desk-agent",
  "stock-associate", "hairdresser", "hair-stylist", "barber", "beautician", "nail-technician",
  "esthetician", "spa-therapist", "makeup-artist-beauty", "lash-technician", "cosmetologist", "hr-manager",
  "hr-assistant", "recruiter", "talent-acquisition-specialist", "hr-business-partner", "training-development-officer", "compensation-benefits-analyst",
  "employee-relations-officer", "hr-coordinator", "lawyer", "paralegal", "legal-assistant", "legal-secretary",
  "compliance-officer", "contracts-manager", "legal-counsel", "notary", "research-scientist", "laboratory-technician",
  "biologist", "chemist", "research-assistant", "clinical-research-associate", "environmental-scientist", "food-scientist",
  "statistician", "production-operative", "machine-operator", "production-manager", "assembler", "quality-control-inspector",
  "plant-manager", "maintenance-technician", "shift-supervisor", "social-worker", "civil-servant", "police-officer",
  "firefighter", "security-guard", "cleaner", "caretaker", "farm-worker", "agricultural-technician",
  "charity", "translator", "religious-scholar", "imam", "khateeb", "mufti",
  "priest", "pastor", "rabbi", "pandit", "monk",
]);

function toLocalRole(r: PkgJobRole): Role {
  const local: Role = {
    name: NAME_OVERRIDES[r.slug] ?? r.name,
    slug: r.slug,
    sector: SECTOR_OVERRIDES[r.slug] ?? SECTOR_LABEL[r.industry],
  };
  if (r.aliases && r.aliases.length > 0) local.aliases = r.aliases;
  return local;
}

/** ALL 519 package roles, used by the new /[role-slug] hub pages. */
export const ALL_ROLES: readonly Role[] = pkgGetAllRoles().map(toLocalRole);

/** O(1) "is this slug a package role?" lookup for /[slug] dispatcher. */
export const PACKAGE_ROLE_SLUGS: ReadonlySet<string> = new Set(
  ALL_ROLES.map((r) => r.slug),
);

/** Bounded 263 — same set as before integration. Used by the existing
 *  /[country]/[role] grid so the 50,759-URL sitemap surface doesn't grow. */
export const JOB_ROLES: readonly Role[] = ALL_ROLES.filter((r) =>
  ALMIWORLD_BOUNDED_SLUGS.has(r.slug),
);

// Build-time guard: every expected bounded slug must still resolve.
{
  const found = new Set(JOB_ROLES.map((r) => r.slug));
  const missing: string[] = [];
  for (const s of ALMIWORLD_BOUNDED_SLUGS) {
    if (!found.has(s)) missing.push(s);
  }
  if (missing.length > 0) {
    throw new Error(
      `[roles] ${missing.length} AlmiWorld bounded slugs missing from @smnasiruz016-blip/job-roles: ` +
        missing.join(", "),
    );
  }
}

/** 11 base roles — drives "featured roles" on country hubs. Unchanged. */
export const BASE_ROLES: readonly string[] = [
  "registered-nurse",
  "software-engineer",
  "doctor",
  "teacher",
  "accountant",
  "electrician",
  "chef",
  "data-scientist",
  "marketing-manager",
  "driver",
  "religious-scholar",
];

export const JOB_ROLES_BY_SLUG: ReadonlyMap<string, Role> = new Map(
  JOB_ROLES.map((r) => [r.slug, r]),
);

export const JOB_ROLES_BY_SECTOR: ReadonlyMap<string, Role[]> = (() => {
  const m = new Map<string, Role[]>();
  for (const r of JOB_ROLES) {
    const arr = m.get(r.sector) ?? [];
    arr.push(r);
    m.set(r.sector, arr);
  }
  return m;
})();

/** Lookup by primary slug OR alias-derived slug. Searches the full 519
 *  (so e.g. /surgeon resolves to the package's Surgeon entry), then wraps
 *  in the AlmiWorld Role shape. */
export function getRoleBySlug(slug: string): Role | undefined {
  const r = pkgGetRoleBySlug(slug);
  return r ? toLocalRole(r) : undefined;
}

// Re-export Industry enum for the role hub's "related roles" sibling lookup
// (uses Industry directly instead of sector display string for stability).
export { Industry };
