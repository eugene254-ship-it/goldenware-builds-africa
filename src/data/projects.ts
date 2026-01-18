import projectWater from "@/assets/project-water.jpg";
import projectHousing from "@/assets/project-housing.jpg";
import projectSchool from "@/assets/project-school.jpg";
import projectOffgrid from "@/assets/project-offgrid.jpg";
import projectMaterials from "@/assets/project-materials.jpg";

export interface Project {
  id: string;
  image: string;
  title: string;
  location: string;
  county: string;
  coordinates: { lat: number; lng: number };
  description: string;
  fullDescription: string;
  category: string;
  year: number;
  impact: {
    metric: string;
    value: string;
  }[];
  features: string[];
  gallery?: string[];
}

export const categories = [
  "All",
  "Water Infrastructure",
  "Urban Development",
  "Education",
  "Off-Grid",
  "R&D"
] as const;

export type CategoryType = typeof categories[number];

export const projects: Project[] = [
  {
    id: "makueni-water",
    image: projectWater,
    title: "Makueni Water Project",
    location: "Makueni County",
    county: "Makueni",
    coordinates: { lat: -2.1, lng: 37.6 },
    description: "Community water harvesting and distribution system serving 5,000+ residents.",
    fullDescription: "A comprehensive water infrastructure project that transformed access to clean water for over 5,000 residents in Makueni County. The project includes a network of rainwater harvesting systems, underground storage tanks, and a solar-powered distribution network that ensures year-round water availability even during the dry season.",
    category: "Water Infrastructure",
    year: 2023,
    impact: [
      { metric: "Residents Served", value: "5,000+" },
      { metric: "Water Points", value: "12" },
      { metric: "Storage Capacity", value: "500,000L" },
      { metric: "Distance Reduced", value: "4km avg" }
    ],
    features: [
      "Solar-powered pumping systems",
      "Underground ferro-cement tanks",
      "Smart metering for water management",
      "Community-managed kiosks",
      "Real-time monitoring dashboard"
    ]
  },
  {
    id: "nairobi-housing",
    image: projectHousing,
    title: "Affordable Housing Initiative",
    location: "Nairobi",
    county: "Nairobi",
    coordinates: { lat: -1.286, lng: 36.817 },
    description: "Sustainable plumbing and water systems for 200 residential units.",
    fullDescription: "A landmark urban development project delivering modern, sustainable water and sanitation infrastructure for 200 affordable housing units in Nairobi. The project showcases how responsible material selection and innovative plumbing design can reduce water consumption by 40% while maintaining comfort and reliability.",
    category: "Urban Development",
    year: 2024,
    impact: [
      { metric: "Housing Units", value: "200" },
      { metric: "Families Impacted", value: "800+" },
      { metric: "Water Savings", value: "40%" },
      { metric: "Jobs Created", value: "150" }
    ],
    features: [
      "Greywater recycling systems",
      "Rainwater harvesting integration",
      "Low-flow fixtures throughout",
      "Solar water heating",
      "Waste-to-energy biogas"
    ]
  },
  {
    id: "kitui-schools",
    image: projectSchool,
    title: "Rural School Sanitation",
    location: "Kitui County",
    county: "Kitui",
    coordinates: { lat: -1.367, lng: 38.017 },
    description: "Complete sanitation facilities for 15 rural schools, impacting 3,000 students.",
    fullDescription: "A transformative education infrastructure project that brought modern sanitation facilities to 15 rural schools across Kitui County. The project addresses critical WASH (Water, Sanitation, and Hygiene) needs, significantly improving student health outcomes and school attendance rates, particularly for girls.",
    category: "Education",
    year: 2023,
    impact: [
      { metric: "Schools Equipped", value: "15" },
      { metric: "Students Impacted", value: "3,000" },
      { metric: "Attendance Increase", value: "+23%" },
      { metric: "Health Incidents", value: "-45%" }
    ],
    features: [
      "Disability-accessible facilities",
      "Menstrual hygiene rooms",
      "Handwashing stations",
      "Rainwater collection",
      "Teacher training programs"
    ]
  },
  {
    id: "turkana-offgrid",
    image: projectOffgrid,
    title: "Off-Grid Water Solutions",
    location: "Turkana County",
    county: "Turkana",
    coordinates: { lat: 3.1, lng: 35.6 },
    description: "Solar-powered borehole systems for pastoralist communities.",
    fullDescription: "An innovative off-grid water solution designed for the challenging arid environment of Turkana County. The project serves mobile pastoralist communities with solar-powered borehole systems that can operate independently of any grid infrastructure, providing reliable water access in one of Kenya's most water-stressed regions.",
    category: "Off-Grid",
    year: 2024,
    impact: [
      { metric: "Boreholes Installed", value: "8" },
      { metric: "Communities Served", value: "12" },
      { metric: "Daily Capacity", value: "100,000L" },
      { metric: "Livestock Supported", value: "15,000+" }
    ],
    features: [
      "100% solar-powered operation",
      "Remote monitoring via satellite",
      "Drought-resistant design",
      "Livestock watering points",
      "Mobile payment integration"
    ]
  },
  {
    id: "machakos-lab",
    image: projectMaterials,
    title: "Material Innovation Lab",
    location: "Machakos",
    county: "Machakos",
    coordinates: { lat: -1.517, lng: 37.267 },
    description: "Research and fabrication of climate-resilient building materials.",
    fullDescription: "Our flagship research and development facility in Machakos where we develop and test next-generation building materials suited for Africa's diverse climates. The lab focuses on creating affordable, locally-manufacturable materials that can withstand extreme weather while reducing environmental impact.",
    category: "R&D",
    year: 2022,
    impact: [
      { metric: "Materials Developed", value: "7" },
      { metric: "Patents Filed", value: "3" },
      { metric: "Local Jobs", value: "25" },
      { metric: "Carbon Reduction", value: "60%" }
    ],
    features: [
      "Material testing laboratory",
      "Climate simulation chambers",
      "3D printing for prototypes",
      "Local artisan training",
      "University partnerships"
    ]
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(p => p.id === id);
};

export const getProjectsByCategory = (category: CategoryType): Project[] => {
  if (category === "All") return projects;
  return projects.filter(p => p.category === category);
};
