export interface Market {
  id: string;
  name: string;
  expectedPrice: string;
  demandTrend: string;
  travelTimeHours: number;
  gradeCompatibility: string[];
  recommendationScore: number;
  priceHistory: number[]; // For SVG sparkline
}

export interface HistoryRecord {
  id: string;
  date: string;
  produce: string;
  quantity: string;
  grade: string;
  destination: string;
  expectedValue: string;
  finalOutcome: string | null;
  status: "completed" | "in_transit";
}

export const DEMO_MARKETS: Market[] = [
  {
    id: "mkt_001",
    name: "Karwan Bazar Wholesale",
    expectedPrice: "Tk 32/kg",
    demandTrend: "+14% (High)",
    travelTimeHours: 2.5,
    gradeCompatibility: ["A", "B"],
    recommendationScore: 94,
    priceHistory: [28, 29, 28, 30, 31, 32, 32]
  },
  {
    id: "mkt_002",
    name: "Shyamoli Local Market",
    expectedPrice: "Tk 28/kg",
    demandTrend: "+2% (Stable)",
    travelTimeHours: 1.2,
    gradeCompatibility: ["B", "C"],
    recommendationScore: 78,
    priceHistory: [27, 27, 28, 28, 27, 28, 28]
  },
  {
    id: "mkt_003",
    name: "Gazipur Processing Plant",
    expectedPrice: "Tk 22/kg",
    demandTrend: "Consistent Bulk",
    travelTimeHours: 3.0,
    gradeCompatibility: ["C"],
    recommendationScore: 65,
    priceHistory: [22, 22, 22, 22, 22, 22, 22]
  }
];

export const DEMO_HISTORY: HistoryRecord[] = [
  {
    id: "disp_1090",
    date: "2026-08-10",
    produce: "Cherry Tomatoes",
    quantity: "120kg",
    grade: "A",
    destination: "Karwan Bazar Wholesale",
    expectedValue: "Tk 3,840",
    finalOutcome: "Tk 3,960",
    status: "completed"
  },
  {
    id: "disp_1091",
    date: "2026-08-11",
    produce: "Roma Tomatoes",
    quantity: "300kg",
    grade: "C",
    destination: "Gazipur Processing Plant",
    expectedValue: "Tk 6,600",
    finalOutcome: "Tk 6,450",
    status: "completed"
  },
  {
    id: "disp_1092",
    date: "2026-08-12",
    produce: "Heirloom Tomatoes",
    quantity: "450kg",
    grade: "A",
    destination: "Karwan Bazar Wholesale",
    expectedValue: "Tk 14,400",
    finalOutcome: "Tk 14,250",
    status: "completed"
  },
  {
    id: "disp_1093",
    date: "2026-08-13",
    produce: "Green Mangoes",
    quantity: "800kg",
    grade: "B",
    destination: "Shyamoli Local Market",
    expectedValue: "Tk 22,400",
    finalOutcome: null,
    status: "in_transit"
  },
  {
    id: "disp_1094",
    date: "2026-08-13",
    produce: "Langra Mangoes",
    quantity: "200kg",
    grade: "A",
    destination: "Karwan Bazar Wholesale",
    expectedValue: "Tk 9,600",
    finalOutcome: null,
    status: "in_transit"
  }
];
