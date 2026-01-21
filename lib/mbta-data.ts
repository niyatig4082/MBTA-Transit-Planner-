// MBTA Station and Route Data
export const MBTA_COLORS = {
  red: "#DA291C",
  orange: "#ED8B00",
  blue: "#003DA5",
  green: "#00843D",
  silver: "#7C878E",
  commuter: "#80276C",
  bus: "#FFC72C",
  ferry: "#008EAA",
  ride: "#52BBD0",
} as const

export type TransitMode = "subway" | "commuter" | "bus" | "ferry" | "silver" | "ride"
export type SubwayLine = "red" | "orange" | "blue" | "green"
export type CommuterRailLine =
  | "fairmount"
  | "fitchburg"
  | "framingham"
  | "franklin"
  | "greenbush"
  | "haverhill"
  | "kingston"
  | "lowell"
  | "middleborough"
  | "needham"
  | "newburyport"
  | "providence"
export type CongestionLevel = "normal" | "moderate" | "severe"
export type ConfidenceLevel = "likely" | "risky" | "unlikely"

export interface Station {
  id: string
  name: string
  lat: number
  lng: number
  lines: string[]
  modes: TransitMode[]
  accessible: boolean
  transferTime?: number // minutes to transfer between lines
}

export interface Route {
  id: string
  name: string
  mode: TransitMode
  line?: SubwayLine | CommuterRailLine
  color: string
  stations: string[]
  coordinates: [number, number][]
}

export interface TrainPosition {
  id: string
  line: string
  lat: number
  lng: number
  direction: "inbound" | "outbound"
  nextStation: string
  arrivalTime: number // minutes
}

export interface CongestionSegment {
  fromStation: string
  toStation: string
  level: CongestionLevel
  delay: number // minutes
}

export interface TransferOption {
  departureTime: string
  arrivalTime: string
  duration: number
  transfers: number
  confidence: ConfidenceLevel
  buffer: number // minutes
  modes: TransitMode[]
  route: RouteStep[]
  congestionLevel: CongestionLevel
  fare: number
}

export interface RouteStep {
  mode: TransitMode
  line?: string
  from: string
  to: string
  departTime: string
  arriveTime: string
  duration: number
  direction: string
}

// Food Place Data Types
export interface FoodPlace {
  id: string
  name: string
  category: "coffee" | "fast-food" | "restaurant" | "convenience"
  walkTime: number // minutes
  isOpen: boolean
  openHours: string
}

// Ticket Type Data Types
export interface TicketType {
  id: string
  name: string
  price: number
  validityDuration: string
  description: string
  recommended?: boolean
}

// Major MBTA Stations
export const STATIONS: Station[] = [
  // Red Line
  { id: "alewife", name: "Alewife", lat: 42.3954, lng: -71.1425, lines: ["red"], modes: ["subway"], accessible: true },
  { id: "davis", name: "Davis", lat: 42.3967, lng: -71.1218, lines: ["red"], modes: ["subway"], accessible: true },
  {
    id: "porter",
    name: "Porter",
    lat: 42.3884,
    lng: -71.1191,
    lines: ["red", "commuter-fitchburg"],
    modes: ["subway", "commuter"],
    accessible: true,
    transferTime: 5,
  },
  {
    id: "harvard",
    name: "Harvard",
    lat: 42.3735,
    lng: -71.119,
    lines: ["red"],
    modes: ["subway", "bus"],
    accessible: true,
  },
  {
    id: "central",
    name: "Central",
    lat: 42.3654,
    lng: -71.1037,
    lines: ["red"],
    modes: ["subway", "bus"],
    accessible: true,
  },
  {
    id: "kendall",
    name: "Kendall/MIT",
    lat: 42.3625,
    lng: -71.0862,
    lines: ["red"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "charles-mgh",
    name: "Charles/MGH",
    lat: 42.3613,
    lng: -71.0707,
    lines: ["red"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "park-street",
    name: "Park Street",
    lat: 42.3564,
    lng: -71.0624,
    lines: ["red", "green"],
    modes: ["subway"],
    accessible: true,
    transferTime: 3,
  },
  {
    id: "downtown-crossing",
    name: "Downtown Crossing",
    lat: 42.3555,
    lng: -71.0603,
    lines: ["red", "orange", "silver"],
    modes: ["subway", "silver"],
    accessible: true,
    transferTime: 4,
  },
  {
    id: "south-station",
    name: "South Station",
    lat: 42.3523,
    lng: -71.0553,
    lines: ["red", "silver", "commuter-all"],
    modes: ["subway", "commuter", "bus", "silver"],
    accessible: true,
    transferTime: 8,
  },
  {
    id: "broadway",
    name: "Broadway",
    lat: 42.3426,
    lng: -71.0572,
    lines: ["red"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "andrew",
    name: "Andrew",
    lat: 42.3302,
    lng: -71.0575,
    lines: ["red"],
    modes: ["subway", "bus"],
    accessible: true,
  },
  {
    id: "jfk-umass",
    name: "JFK/UMass",
    lat: 42.3209,
    lng: -71.0524,
    lines: ["red", "commuter-old-colony"],
    modes: ["subway", "commuter"],
    accessible: true,
    transferTime: 6,
  },

  // Orange Line
  {
    id: "oak-grove",
    name: "Oak Grove",
    lat: 42.4368,
    lng: -71.071,
    lines: ["orange"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "malden-center",
    name: "Malden Center",
    lat: 42.4267,
    lng: -71.074,
    lines: ["orange", "commuter-haverhill"],
    modes: ["subway", "commuter"],
    accessible: true,
    transferTime: 5,
  },
  {
    id: "wellington",
    name: "Wellington",
    lat: 42.402,
    lng: -71.077,
    lines: ["orange"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "assembly",
    name: "Assembly",
    lat: 42.3926,
    lng: -71.0771,
    lines: ["orange"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "sullivan",
    name: "Sullivan Square",
    lat: 42.3839,
    lng: -71.077,
    lines: ["orange"],
    modes: ["subway", "bus"],
    accessible: true,
  },
  {
    id: "community-college",
    name: "Community College",
    lat: 42.3736,
    lng: -71.0695,
    lines: ["orange"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "north-station",
    name: "North Station",
    lat: 42.3656,
    lng: -71.0617,
    lines: ["orange", "green", "commuter-north"],
    modes: ["subway", "commuter"],
    accessible: true,
    transferTime: 7,
  },
  {
    id: "haymarket",
    name: "Haymarket",
    lat: 42.3631,
    lng: -71.0585,
    lines: ["orange", "green"],
    modes: ["subway"],
    accessible: true,
    transferTime: 3,
  },
  {
    id: "state",
    name: "State",
    lat: 42.3588,
    lng: -71.0576,
    lines: ["orange", "blue"],
    modes: ["subway"],
    accessible: true,
    transferTime: 3,
  },
  {
    id: "chinatown",
    name: "Chinatown",
    lat: 42.3525,
    lng: -71.0626,
    lines: ["orange", "silver"],
    modes: ["subway", "silver"],
    accessible: true,
  },
  {
    id: "tufts-medical",
    name: "Tufts Medical Center",
    lat: 42.3496,
    lng: -71.0637,
    lines: ["orange", "silver"],
    modes: ["subway", "silver"],
    accessible: true,
  },
  {
    id: "back-bay",
    name: "Back Bay",
    lat: 42.3473,
    lng: -71.0756,
    lines: ["orange", "commuter-south"],
    modes: ["subway", "commuter"],
    accessible: true,
    transferTime: 6,
  },
  {
    id: "massachusetts-ave",
    name: "Massachusetts Ave",
    lat: 42.3418,
    lng: -71.0834,
    lines: ["orange"],
    modes: ["subway", "bus"],
    accessible: true,
  },
  {
    id: "ruggles",
    name: "Ruggles",
    lat: 42.3368,
    lng: -71.0892,
    lines: ["orange", "commuter-south"],
    modes: ["subway", "commuter", "bus"],
    accessible: true,
    transferTime: 5,
  },
  {
    id: "roxbury-crossing",
    name: "Roxbury Crossing",
    lat: 42.3312,
    lng: -71.0955,
    lines: ["orange"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "jackson-square",
    name: "Jackson Square",
    lat: 42.3233,
    lng: -71.0995,
    lines: ["orange"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "stony-brook",
    name: "Stony Brook",
    lat: 42.317,
    lng: -71.1042,
    lines: ["orange"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "green-street",
    name: "Green Street",
    lat: 42.3104,
    lng: -71.1075,
    lines: ["orange"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "forest-hills",
    name: "Forest Hills",
    lat: 42.3006,
    lng: -71.1136,
    lines: ["orange", "commuter-needham"],
    modes: ["subway", "commuter", "bus"],
    accessible: true,
    transferTime: 5,
  },

  // Blue Line
  {
    id: "wonderland",
    name: "Wonderland",
    lat: 42.4135,
    lng: -70.9917,
    lines: ["blue"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "revere-beach",
    name: "Revere Beach",
    lat: 42.4078,
    lng: -70.9925,
    lines: ["blue"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "beachmont",
    name: "Beachmont",
    lat: 42.3976,
    lng: -70.9923,
    lines: ["blue"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "suffolk-downs",
    name: "Suffolk Downs",
    lat: 42.3903,
    lng: -70.9972,
    lines: ["blue"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "orient-heights",
    name: "Orient Heights",
    lat: 42.3869,
    lng: -71.0047,
    lines: ["blue"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "wood-island",
    name: "Wood Island",
    lat: 42.3796,
    lng: -71.023,
    lines: ["blue"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "airport",
    name: "Airport",
    lat: 42.3743,
    lng: -71.0304,
    lines: ["blue", "silver"],
    modes: ["subway", "silver"],
    accessible: true,
  },
  {
    id: "maverick",
    name: "Maverick",
    lat: 42.3691,
    lng: -71.0395,
    lines: ["blue"],
    modes: ["subway", "ferry"],
    accessible: true,
  },
  {
    id: "aquarium",
    name: "Aquarium",
    lat: 42.3598,
    lng: -71.0518,
    lines: ["blue"],
    modes: ["subway", "ferry"],
    accessible: true,
    transferTime: 5,
  },
  {
    id: "government-center",
    name: "Government Center",
    lat: 42.3594,
    lng: -71.0593,
    lines: ["blue", "green"],
    modes: ["subway"],
    accessible: true,
    transferTime: 4,
  },
  {
    id: "bowdoin",
    name: "Bowdoin",
    lat: 42.3613,
    lng: -71.0621,
    lines: ["blue"],
    modes: ["subway"],
    accessible: false,
  },

  // Green Line (Major stops)
  {
    id: "lechmere",
    name: "Lechmere",
    lat: 42.3708,
    lng: -71.0769,
    lines: ["green"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "science-park",
    name: "Science Park",
    lat: 42.3668,
    lng: -71.0675,
    lines: ["green"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "boylston",
    name: "Boylston",
    lat: 42.3531,
    lng: -71.0647,
    lines: ["green"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "arlington",
    name: "Arlington",
    lat: 42.3519,
    lng: -71.0703,
    lines: ["green"],
    modes: ["subway"],
    accessible: true,
  },
  { id: "copley", name: "Copley", lat: 42.35, lng: -71.0775, lines: ["green"], modes: ["subway"], accessible: true },
  {
    id: "hynes",
    name: "Hynes Convention Center",
    lat: 42.3473,
    lng: -71.087,
    lines: ["green"],
    modes: ["subway"],
    accessible: true,
  },
  {
    id: "kenmore",
    name: "Kenmore",
    lat: 42.3489,
    lng: -71.0952,
    lines: ["green"],
    modes: ["subway", "bus"],
    accessible: true,
  },

  // Ferry Terminals
  {
    id: "long-wharf",
    name: "Long Wharf (North)",
    lat: 42.3597,
    lng: -71.0498,
    lines: ["ferry-charlestown", "ferry-hingham"],
    modes: ["ferry"],
    accessible: true,
  },
  {
    id: "charlestown-navy",
    name: "Charlestown Navy Yard",
    lat: 42.3738,
    lng: -71.0558,
    lines: ["ferry-charlestown"],
    modes: ["ferry"],
    accessible: true,
  },
  {
    id: "hingham",
    name: "Hingham",
    lat: 42.2523,
    lng: -70.9195,
    lines: ["ferry-hingham"],
    modes: ["ferry"],
    accessible: true,
  },
]

// Subway Route Coordinates (simplified paths)
export const ROUTES: Route[] = [
  {
    id: "red",
    name: "Red Line",
    mode: "subway",
    line: "red",
    color: MBTA_COLORS.red,
    stations: [
      "alewife",
      "davis",
      "porter",
      "harvard",
      "central",
      "kendall",
      "charles-mgh",
      "park-street",
      "downtown-crossing",
      "south-station",
      "broadway",
      "andrew",
      "jfk-umass",
    ],
    coordinates: [
      [42.3954, -71.1425],
      [42.3967, -71.1218],
      [42.3884, -71.1191],
      [42.3735, -71.119],
      [42.3654, -71.1037],
      [42.3625, -71.0862],
      [42.3613, -71.0707],
      [42.3564, -71.0624],
      [42.3555, -71.0603],
      [42.3523, -71.0553],
      [42.3426, -71.0572],
      [42.3302, -71.0575],
      [42.3209, -71.0524],
    ],
  },
  {
    id: "orange",
    name: "Orange Line",
    mode: "subway",
    line: "orange",
    color: MBTA_COLORS.orange,
    stations: [
      "oak-grove",
      "malden-center",
      "wellington",
      "assembly",
      "sullivan",
      "community-college",
      "north-station",
      "haymarket",
      "state",
      "downtown-crossing",
      "chinatown",
      "tufts-medical",
      "back-bay",
      "massachusetts-ave",
      "ruggles",
      "roxbury-crossing",
      "jackson-square",
      "stony-brook",
      "green-street",
      "forest-hills",
    ],
    coordinates: [
      [42.4368, -71.071],
      [42.4267, -71.074],
      [42.402, -71.077],
      [42.3926, -71.0771],
      [42.3839, -71.077],
      [42.3736, -71.0695],
      [42.3656, -71.0617],
      [42.3631, -71.0585],
      [42.3588, -71.0576],
      [42.3555, -71.0603],
      [42.3525, -71.0626],
      [42.3496, -71.0637],
      [42.3473, -71.0756],
      [42.3418, -71.0834],
      [42.3368, -71.0892],
      [42.3312, -71.0955],
      [42.3233, -71.0995],
      [42.317, -71.1042],
      [42.3104, -71.1075],
      [42.3006, -71.1136],
    ],
  },
  {
    id: "blue",
    name: "Blue Line",
    mode: "subway",
    line: "blue",
    color: MBTA_COLORS.blue,
    stations: [
      "wonderland",
      "revere-beach",
      "beachmont",
      "suffolk-downs",
      "orient-heights",
      "wood-island",
      "airport",
      "maverick",
      "aquarium",
      "state",
      "government-center",
      "bowdoin",
    ],
    coordinates: [
      [42.4135, -70.9917],
      [42.4078, -70.9925],
      [42.3976, -70.9923],
      [42.3903, -70.9972],
      [42.3869, -71.0047],
      [42.3796, -71.023],
      [42.3743, -71.0304],
      [42.3691, -71.0395],
      [42.3598, -71.0518],
      [42.3588, -71.0576],
      [42.3594, -71.0593],
      [42.3613, -71.0621],
    ],
  },
  {
    id: "green",
    name: "Green Line",
    mode: "subway",
    line: "green",
    color: MBTA_COLORS.green,
    stations: [
      "lechmere",
      "science-park",
      "north-station",
      "haymarket",
      "government-center",
      "park-street",
      "boylston",
      "arlington",
      "copley",
      "hynes",
      "kenmore",
    ],
    coordinates: [
      [42.3708, -71.0769],
      [42.3668, -71.0675],
      [42.3656, -71.0617],
      [42.3631, -71.0585],
      [42.3594, -71.0593],
      [42.3564, -71.0624],
      [42.3531, -71.0647],
      [42.3519, -71.0703],
      [42.35, -71.0775],
      [42.3473, -71.087],
      [42.3489, -71.0952],
    ],
  },
  {
    id: "silver-sl1",
    name: "Silver Line SL1",
    mode: "silver",
    color: MBTA_COLORS.silver,
    stations: ["south-station", "airport"],
    coordinates: [
      [42.3523, -71.0553],
      [42.3743, -71.0304],
    ],
  },
  {
    id: "ferry-charlestown",
    name: "Charlestown Ferry",
    mode: "ferry",
    color: MBTA_COLORS.ferry,
    stations: ["long-wharf", "charlestown-navy"],
    coordinates: [
      [42.3597, -71.0498],
      [42.3738, -71.0558],
    ],
  },
]

// Commuter Rail Lines
export const COMMUTER_RAIL_LINES = [
  { id: "fairmount", name: "Fairmount Line", color: MBTA_COLORS.commuter },
  { id: "fitchburg", name: "Fitchburg Line", color: MBTA_COLORS.commuter },
  { id: "framingham", name: "Framingham/Worcester Line", color: MBTA_COLORS.commuter },
  { id: "franklin", name: "Franklin/Foxboro Line", color: MBTA_COLORS.commuter },
  { id: "greenbush", name: "Greenbush Line", color: MBTA_COLORS.commuter },
  { id: "haverhill", name: "Haverhill Line", color: MBTA_COLORS.commuter },
  { id: "kingston", name: "Kingston Line", color: MBTA_COLORS.commuter },
  { id: "lowell", name: "Lowell Line", color: MBTA_COLORS.commuter },
  { id: "middleborough", name: "Middleborough/Lakeville Line", color: MBTA_COLORS.commuter },
  { id: "needham", name: "Needham Line", color: MBTA_COLORS.commuter },
  { id: "newburyport", name: "Newburyport/Rockport Line", color: MBTA_COLORS.commuter },
  { id: "providence", name: "Providence/Stoughton Line", color: MBTA_COLORS.commuter },
] as const

// Mock food data for stations
export const STATION_FOOD: Record<string, FoodPlace[]> = {
  "park-street": [
    { id: "f1", name: "Dunkin'", category: "coffee", walkTime: 1, isOpen: true, openHours: "5am - 10pm" },
    { id: "f2", name: "Chipotle", category: "fast-food", walkTime: 3, isOpen: true, openHours: "10am - 10pm" },
    { id: "f3", name: "7-Eleven", category: "convenience", walkTime: 2, isOpen: true, openHours: "24 hours" },
    { id: "f4", name: "Legal Sea Foods", category: "restaurant", walkTime: 5, isOpen: true, openHours: "11am - 9pm" },
  ],
  "downtown-crossing": [
    { id: "f5", name: "Starbucks", category: "coffee", walkTime: 1, isOpen: true, openHours: "6am - 9pm" },
    { id: "f6", name: "McDonald's", category: "fast-food", walkTime: 2, isOpen: true, openHours: "6am - 11pm" },
    { id: "f7", name: "CVS", category: "convenience", walkTime: 1, isOpen: true, openHours: "7am - 10pm" },
    { id: "f8", name: "Sweetgreen", category: "restaurant", walkTime: 4, isOpen: false, openHours: "10am - 8pm" },
  ],
  "south-station": [
    { id: "f9", name: "Au Bon Pain", category: "coffee", walkTime: 1, isOpen: true, openHours: "5:30am - 9pm" },
    { id: "f10", name: "Subway", category: "fast-food", walkTime: 2, isOpen: true, openHours: "7am - 10pm" },
    { id: "f11", name: "Hudson News", category: "convenience", walkTime: 1, isOpen: true, openHours: "5am - 9pm" },
    {
      id: "f12",
      name: "Atlantic Fish Co",
      category: "restaurant",
      walkTime: 8,
      isOpen: true,
      openHours: "11:30am - 10pm",
    },
  ],
  harvard: [
    { id: "f13", name: "Peet's Coffee", category: "coffee", walkTime: 2, isOpen: true, openHours: "6am - 8pm" },
    { id: "f14", name: "Shake Shack", category: "fast-food", walkTime: 4, isOpen: true, openHours: "11am - 10pm" },
    { id: "f15", name: "CVS", category: "convenience", walkTime: 3, isOpen: true, openHours: "8am - 9pm" },
  ],
  kendall: [
    { id: "f16", name: "Blue Bottle", category: "coffee", walkTime: 3, isOpen: true, openHours: "7am - 6pm" },
    { id: "f17", name: "Clover", category: "fast-food", walkTime: 2, isOpen: true, openHours: "7am - 9pm" },
    { id: "f18", name: "Walgreens", category: "convenience", walkTime: 4, isOpen: true, openHours: "7am - 10pm" },
  ],
  "north-station": [
    { id: "f19", name: "Dunkin'", category: "coffee", walkTime: 1, isOpen: true, openHours: "5am - 11pm" },
    {
      id: "f20",
      name: "Boston Beer Works",
      category: "restaurant",
      walkTime: 2,
      isOpen: true,
      openHours: "11am - 1am",
    },
    { id: "f21", name: "Halftime Pizza", category: "fast-food", walkTime: 3, isOpen: true, openHours: "11am - 10pm" },
  ],
  "back-bay": [
    { id: "f22", name: "Thinking Cup", category: "coffee", walkTime: 4, isOpen: true, openHours: "7am - 9pm" },
    { id: "f23", name: "Flour Bakery", category: "restaurant", walkTime: 5, isOpen: true, openHours: "7am - 7pm" },
    { id: "f24", name: "Walgreens", category: "convenience", walkTime: 2, isOpen: true, openHours: "7am - 10pm" },
  ],
}

// MBTA Ticket types
export const TICKET_TYPES: TicketType[] = [
  {
    id: "single-subway",
    name: "Single Ride - Subway",
    price: 2.4,
    validityDuration: "One trip",
    description: "Valid for one subway ride, including transfers within 2 hours",
  },
  {
    id: "single-bus",
    name: "Single Ride - Bus",
    price: 1.7,
    validityDuration: "One trip",
    description: "Valid for one local bus ride",
  },
  {
    id: "day-pass",
    name: "1-Day LinkPass",
    price: 11.0,
    validityDuration: "24 hours",
    description: "Unlimited subway and local bus rides for 24 hours",
    recommended: true,
  },
  {
    id: "week-pass",
    name: "7-Day LinkPass",
    price: 22.5,
    validityDuration: "7 days",
    description: "Unlimited subway and local bus rides for 7 days",
  },
  {
    id: "month-pass",
    name: "Monthly LinkPass",
    price: 90.0,
    validityDuration: "1 month",
    description: "Unlimited subway and local bus rides for one calendar month",
  },
  {
    id: "commuter-zone",
    name: "Commuter Rail Zone 1-8",
    price: 6.5,
    validityDuration: "One trip",
    description: "Valid for one commuter rail ride based on zones",
  },
  {
    id: "ferry",
    name: "Ferry - Inner Harbor",
    price: 3.7,
    validityDuration: "One trip",
    description: "Valid for one inner harbor ferry ride",
  },
]

// Helper functions
export function getStation(id: string): Station | undefined {
  return STATIONS.find((s) => s.id === id)
}

export function getRoute(id: string): Route | undefined {
  return ROUTES.find((r) => r.id === id)
}

export function getStationsByLine(line: string): Station[] {
  return STATIONS.filter((s) => s.lines.includes(line))
}

export function getTransferStations(): Station[] {
  return STATIONS.filter((s) => s.lines.length > 1 || s.modes.length > 1)
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function generateMockArrivals(stationId: string): { line: string; direction: string; minutes: number }[] {
  const station = getStation(stationId)
  if (!station) return []

  const arrivals: { line: string; direction: string; minutes: number }[] = []

  station.lines.forEach((line) => {
    arrivals.push(
      { line, direction: "Inbound", minutes: Math.floor(Math.random() * 8) + 1 },
      { line, direction: "Outbound", minutes: Math.floor(Math.random() * 12) + 2 },
    )
  })

  return arrivals.sort((a, b) => a.minutes - b.minutes)
}

export function generateMockCongestion(): CongestionSegment[] {
  const segments: CongestionSegment[] = []
  const levels: CongestionLevel[] = ["normal", "moderate", "severe"]

  ROUTES.forEach((route) => {
    for (let i = 0; i < route.stations.length - 1; i++) {
      const randomLevel = Math.random()
      let level: CongestionLevel = "normal"
      let delay = 0

      if (randomLevel > 0.85) {
        level = "severe"
        delay = Math.floor(Math.random() * 10) + 5
      } else if (randomLevel > 0.7) {
        level = "moderate"
        delay = Math.floor(Math.random() * 5) + 2
      }

      if (level !== "normal") {
        segments.push({
          fromStation: route.stations[i],
          toStation: route.stations[i + 1],
          level,
          delay,
        })
      }
    }
  })

  return segments
}

export function calculateConfidence(buffer: number): ConfidenceLevel {
  if (buffer >= 5) return "likely"
  if (buffer >= 1) return "risky"
  return "unlikely"
}

export function getModeIcon(mode: TransitMode): string {
  switch (mode) {
    case "subway":
      return "train"
    case "commuter":
      return "train-front"
    case "bus":
      return "bus"
    case "ferry":
      return "ship"
    case "silver":
      return "bus"
    case "ride":
      return "accessibility"
    default:
      return "circle"
  }
}

export function generateMockTrainPositions(): TrainPosition[] {
  const trains: TrainPosition[] = []
  const lines = ["red", "orange", "blue", "green"]

  lines.forEach((line) => {
    const route = ROUTES.find((r) => r.id === line)
    if (!route || route.coordinates.length < 2) return

    // Add 2-4 trains per line
    const numTrains = Math.floor(Math.random() * 3) + 2
    for (let i = 0; i < numTrains; i++) {
      const coordIndex = Math.floor(Math.random() * (route.coordinates.length - 1))
      const coord = route.coordinates[coordIndex]

      // Add some randomness to position
      const lat = coord[0] + (Math.random() - 0.5) * 0.005
      const lng = coord[1] + (Math.random() - 0.5) * 0.005

      const stationIndex = Math.min(coordIndex + 1, route.stations.length - 1)
      const nextStation = getStation(route.stations[stationIndex])

      trains.push({
        id: `${line}-${i}`,
        line,
        lat,
        lng,
        direction: Math.random() > 0.5 ? "inbound" : "outbound",
        nextStation: nextStation?.name || "Unknown",
        arrivalTime: Math.floor(Math.random() * 5) + 1,
      })
    }
  })

  return trains
}

export function generateAlternateRoutes(
  from: Station,
  to: Station,
  congestionData: CongestionSegment[],
): {
  path: [number, number][]
  color: string
  label: string
  duration: number
  congestionLevel: "low" | "moderate" | "high"
  savings: number
  reason: string
}[] {
  const alternates: {
    path: [number, number][]
    color: string
    label: string
    duration: number
    congestionLevel: "low" | "moderate" | "high"
    savings: number
    reason: string
  }[] = []

  // Check if there's congestion on the main route
  const hasCongestion = congestionData.some((s) => s.level === "severe" || s.level === "moderate")

  if (!hasCongestion) return alternates

  // Generate alternate via Orange Line
  if (from.lines.includes("red") || to.lines.includes("red")) {
    alternates.push({
      path: [
        [from.lat, from.lng],
        [42.3555, -71.0603], // Downtown Crossing
        [42.3473, -71.0756], // Back Bay
        [to.lat, to.lng],
      ],
      color: "#8B5CF6", // Purple for alternate
      label: "Via Orange Line",
      duration: 22,
      congestionLevel: "low",
      savings: 5,
      reason: "Orange Line currently has better on-time performance",
    })
  }

  // Generate bus alternate
  alternates.push({
    path: [
      [from.lat, from.lng],
      [from.lat + 0.01, from.lng - 0.02],
      [to.lat - 0.01, to.lng + 0.01],
      [to.lat, to.lng],
    ],
    color: "#14B8A6", // Teal for bus route
    label: "Bus + Subway",
    duration: 28,
    congestionLevel: "moderate",
    savings: 2,
    reason: "Bus 66 avoids underground delays, then transfer to subway",
  })

  return alternates
}

export function getFoodNearStation(stationId: string): FoodPlace[] {
  return STATION_FOOD[stationId] || generateGenericFood()
}

function generateGenericFood(): FoodPlace[] {
  return [
    { id: "g1", name: "Nearby Café", category: "coffee", walkTime: 3, isOpen: true, openHours: "6am - 8pm" },
    { id: "g2", name: "Quick Bites", category: "fast-food", walkTime: 4, isOpen: true, openHours: "10am - 9pm" },
    { id: "g3", name: "Corner Store", category: "convenience", walkTime: 2, isOpen: true, openHours: "7am - 10pm" },
  ]
}

export function getRecommendedTicket(transfers: number, tripDuration: number): TicketType {
  // If multiple transfers, day pass is better value
  if (transfers >= 2) {
    return TICKET_TYPES.find((t) => t.id === "day-pass")!
  }
  // Default to single ride
  return TICKET_TYPES.find((t) => t.id === "single-subway")!
}
