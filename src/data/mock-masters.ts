export interface MasterPattern {
  code: string;
  brand: string;
  fit: string;
}

export const INITIAL_MASTER_PATTERNS: MasterPattern[] = [
  { code: "PAT001", brand: "Allen Solly", fit: "Slim Fit" },
  { code: "PAT002", brand: "Peter England", fit: "Regular Fit" },
  { code: "PAT003", brand: "Customer A", fit: "Special Fit" },
  { code: "PA101", brand: "Allen Solley", fit: "Casual Fit" },
  { code: "PA102", brand: "Zara", fit: "Regular Fit" },
  { code: "PA103", brand: "H&M", fit: "Slim Fit" },
  { code: "PA104", brand: "Allen Solley", fit: "Slim Fit" },
  { code: "PA105", brand: "Zara", fit: "Oversized" },
  { code: "PA106", brand: "Levi's", fit: "Regular Fit" },
];
