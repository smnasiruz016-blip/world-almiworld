/**
 * The 4 AlmiWorld sister products. URL builders here are the only
 * place this hub takes a position on cross-product slug shapes — every
 * link rendered on /, /[country], /[country]/[role] flows through these.
 *
 * Verified URL shapes (slugs match countries.ts + roles.ts in this repo):
 *   - AlmiCV:     /cv-guide/{country}/{role}      (almi-cv-v2 sitemap.ts)
 *   - AlmiSalary: /salary/{country}/{role}        (almisalary-v2 sitemap.ts)
 *   - AlmiJob:    /jobs/{country}/{role}          (almijob-v2 app/jobs/[country]/[role])
 *   - AlmiStudy:  /universities/{country}         (country-level only; not role-keyed)
 */

export type ProductKey = "job" | "salary" | "study" | "cv";

export type Product = {
  key: ProductKey;
  name: string;
  tagline: string;
  origin: string;
  /** Country-keyed deep link. */
  countryUrl: (countrySlug: string) => string;
  /** Country×role deep link. Null when the product is not role-keyed. */
  countryRoleUrl: ((countrySlug: string, roleSlug: string) => string) | null;
};

export const PRODUCTS: Product[] = [
  {
    key: "cv",
    name: "AlmiCV",
    tagline: "AI-tailored CVs, 193 country conventions, daily-added designs.",
    origin: "https://almicv.almiworld.com",
    countryUrl: (c) => `https://almicv.almiworld.com/cv-guide/${c}`,
    countryRoleUrl: (c, r) => `https://almicv.almiworld.com/cv-guide/${c}/${r}`,
  },
  {
    key: "job",
    name: "AlmiJob",
    tagline: "Verified jobs across countries and industries.",
    origin: "https://almijob.almiworld.com",
    countryUrl: (c) => `https://almijob.almiworld.com/jobs/${c}`,
    countryRoleUrl: (c, r) => `https://almijob.almiworld.com/jobs/${c}/${r}`,
  },
  {
    key: "salary",
    name: "AlmiSalary",
    tagline: "Real salary ranges with cited sources.",
    origin: "https://almisalary.almiworld.com",
    countryUrl: (c) => `https://almisalary.almiworld.com/salary/${c}`,
    countryRoleUrl: (c, r) => `https://almisalary.almiworld.com/salary/${c}/${r}`,
  },
  {
    key: "study",
    name: "AlmiStudy",
    tagline: "HEC/accredited universities and scholarship pathways.",
    origin: "https://almistudy.almiworld.com",
    countryUrl: (c) => `https://almistudy.almiworld.com/universities/${c}`,
    countryRoleUrl: null,
  },
];
