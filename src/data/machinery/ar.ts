import type { MachineryData } from './types'

const data: MachineryData = {
  categories: [
    {
      id: 'bending-machines',
      name: 'Bending Machines for Plastic Pipes',
      shortDescription:
        'Pneumatic bending machine for cross-over special fittings via thermo-forming of PP-R pipe segments.',
      description:
        'Pneumatic bending machine suitable for the construction of cross-over special fittings by means of thermo-forming segments of Polypropylene Random (PP-R) pipe. Equipped with a pneumatic cutter, heating unit for up to 8 pipe segments (Ø20–32 mm), and a station pressing bench with built-in cooling unit. Press bending is the simplest and most cost-effective method of bending cold pipe and tube.',
      features: [
        'Pneumatic cutter with collection box',
        'Heating unit for up to 8 pipe segments',
        'Station pressing bench with built-in cooler',
        'Moulds for each diameter (Ø20–Ø32 mm)',
        'CE conformity certified',
      ],
      standards: ['DIN EN ISO 15874', 'DIN 8077', 'DIN 8078'],
      versions: {
        name: 'Versions',
        columns: ['T1201V1P Bending Machine', 'T1101V2P Omega Machine'],
        rows: [
          { label: 'Working range', unit: 'mm', values: ['20-40', '20-30'] },
          { label: 'Working pressure', unit: 'Bar', values: ['6.0', '6.0'] },
          { label: 'CE conformity', values: ['●', '●'] },
          {
            label: 'Permissible ambient temperature',
            unit: '°C',
            values: ['+5 to +40', '+5 to +40'],
          },
          {
            label: 'Permissible relative humidity',
            values: ['Max. 70', 'Max. 70'],
          },
          {
            label: 'Width (internal/external)',
            unit: 'mm',
            values: ['800', '1100'],
          },
          {
            label: 'Depth (internal/external)',
            unit: 'mm',
            values: ['700', '800'],
          },
          {
            label: 'Height (internal/external)',
            unit: 'mm',
            values: ['1500', '800'],
          },
          {
            label: 'Voltage data',
            values: ['220/380V 50/60 Hz', '220/380V 50/60 Hz'],
          },
        ],
      },
      image01: '/images/machinery/bending-machines-01.jpg',
      image02: '/images/machinery/bending-machines-02.jpg',
      pdfUrl: '/images/machinery/bending-machines.pdf',
    },
    {
      id: 'mini-extruder',
      name: '25D Twin-Screw Horizontal Extruder',
      shortDescription:
        'Lab-scale mini extruder with 4 autonomous heating zones and scalable geometry for R&D to production.',
      description:
        'The unique setup of our horizontal 12 mm 25D extruder improves material flow and provides temperature management across 4 autonomous heating zones. Scalable geometric proportions allow for seamless transition from lab testing to industrial production.',
      features: [
        'Durable material contact parts with minimal abrasion',
        'Versatile screw design and die options',
        'Precise monitoring of process temperature (up to 300°C / 450°C optional)',
        'Integrated controls for feeders and advanced control panel',
        'Plug-and-play feeding and downstream equipment',
      ],
      specs: [
        { label: 'Screw diameter', value: '12 mm' },
        { label: 'Length / Diameter', value: '25:1' },
        { label: 'Screw speed', value: '0-50 rpm' },
        { label: 'Screw configuration', value: 'Segmented, fully interchangeable' },
        { label: 'Dimensions', value: '300 × 800 × 430 mm' },
        { label: 'Motor power', value: '0.18 KW' },
        { label: 'Electrical', value: '0.75 kWh / 13 A' },
        { label: 'Torque output', value: '5 Nm per shaft max' },
        { label: 'Barrel zones', value: '4 temperature-controlled zones' },
        { label: 'Temperature range', value: '15–300°C (15–450°C optional)' },
        { label: 'Dies', value: 'Strand, cast film, strip, tube, co-extrusion' },
        { label: 'Requirements', value: '24A, 230V 1ph, 50/60Hz' },
      ],
      image01: '/images/machinery/mini-extruder-01.jpg',
      image02: '/images/machinery/mini-extruder-02.jpg',
      pdfUrl: '/images/machinery/mini-extruder.pdf',
    },
    {
      id: 'ball-valve-assembly',
      name: 'Machine for Assembling Plastic Ball Valves',
      shortDescription:
        'Servo-controlled automated assembly with 16-position rotating table, Industry 4.0 ready.',
      description:
        'Automated assembly machine with a rectangular base, servo-controlled rotating table electronically programmable via Touch Screen control panel, and a 16-position rotating disk. The centralized supervisor connects to management databases for data transfer, following Smart Factory and Industry 4.0 requirements. Components are manually loaded; unloading is automatic with good-part selection and waste discrimination.',
      features: [
        'Servo-controlled rotating table with 16 divisions',
        'Touch Screen control panel for easy setup',
        'Automatic unloading with quality discrimination',
        'Mobile device production monitoring',
        'Industry 4.0 & Smart Factory compatible',
      ],
      positions: [
        'Loading the Sleeve Male Parts',
        'Controlling the position of the Sleeve Male Parts',
        'Loading the Sleeve Female Parts',
        'Controlling the position of the Sleeve Female Parts',
        'Loading the Teflon Rings into the Sleeve Male',
        'Controlling the position of the Teflon Rings',
        'Loading the Pin Parts',
        'Controlling the position of the Pin Parts',
        'Loading the Ball Parts',
        'Controlling the position of the Ball Parts',
        'Joining the Sleeve Male and Sleeve Female Parts',
        'Rotating the Ball Parts 90°',
        'Unloading the Products',
        'Unloading the Defective Products',
        'Station Control',
        'Empty',
      ],
      image01: '/images/machinery/ball-valve-assembly-01.jpg',
      image02: '/images/machinery/ball-valve-assembly-02.jpg',
      pdfUrl: '/images/machinery/ball-valve-assembly.pdf',
    },
  ],

  coreCapabilities: [
    {
      title: 'Custom Engineering',
      description:
        'Every machine is tailored to your specific production requirements, from design to commissioning.',
    },
    {
      title: 'Industry 4.0 Ready',
      description:
        'Smart Factory integration with centralized supervisors, mobile monitoring and database connectivity.',
    },
    {
      title: 'CE Certified',
      description:
        'All machinery meets European Conformity standards for safety, health and environmental protection.',
    },
    {
      title: 'Smart Factory Integration',
      description:
        'Centralized supervisor systems with data transfer capabilities and remote diagnostic tools.',
    },
  ],

  highlights: [
    { value: '25+', label: 'Years Experience' },
    { value: '50+', label: 'Countries Exported' },
    { value: '4.0', label: 'Industry Ready' },
    { value: '3', label: 'Product Lines' },
  ],

  ui: {
    heroTitle: 'Customized Products & Machinery',
    heroSubtitle: 'Tailored Machines for Pipe & Fitting Production',
    introTitle: 'Precision Machinery & Custom Solutions',
    introText:
      'Polinar designs and manufactures customized machinery for the plastic pipe and fittings industry. From bending machines and mini extruders to fully automated assembly lines, our solutions are engineered for precision, efficiency and seamless integration with Industry 4.0 smart factory environments.',
    categoriesLabel: 'Our Product Lines',
    categoriesSectionTitle: 'Machine Categories',
    whyLabel: 'Why Polinar',
    whySectionTitle: 'Core Capabilities',
    whyText:
      'Every Polinar machine is designed with precision engineering and smart technology, ensuring maximum efficiency and quality in your production line.',
    ctaTitle: 'Need a custom machine solution?',
    ctaText: 'Contact our engineering team for tailored designs.',
    ctaButton: 'Contact Us',
    breadcrumbHome: 'Home',
    breadcrumbParentFallback: 'Our Business',
    breadcrumbCurrent: 'Machinery',
    workCycleTitle: 'Work Cycle — 16 Positions',
  },
}

export default data
