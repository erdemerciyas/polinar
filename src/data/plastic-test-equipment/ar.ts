// TODO: Translate this file for locale 'ar'
// This was auto-scaffolded from en.ts — replace English strings with ar translations

import type { PlasticTestEquipmentData } from './types'

const ar: PlasticTestEquipmentData = {
  categories: [
    {
      id: 'hydrostatic-internal',
      name: 'Hydrostatic Internal Pressure Tester',
      shortDescription:
        'Microprocessor-controlled creep test system with automatic failure and leakage detection for up to 28 stations.',
      description:
        'The internal pressure creep test is a test procedure for determining the strength of thermoplastic pipes. The specimens are subjected to a constant hydrostatic internal pressure at a constant ambient temperature either for a specified period or until they fail. It combines exceptional reliability with simple operation without making any compromises with respect to precision and flexibility.',
      features: [
        'Convenient operation via integrated touch display',
        'Microprocessor-controlled with automatic failure and leakage detection',
        'Precision pressure transducer up to 60 bar, system pressure up to 130 bar',
        'Water disruption detection system',
        'Extendable up to 28 stations',
        'Interface to BTLogger\u00AE Windows-based datalogger software',
      ],
      standards: ['ISO 1167', 'ASTM D 1598', 'ASTM D 1599'],
      specs: [
        { label: 'Pressure range', value: 'Up to 100 bar' },
        { label: 'Max. stations', value: '4 / 8 / 12 / 16 / 20 / 28' },
        { label: 'Pump capacity', value: '10\u201314 l/min' },
        { label: 'Control', value: '5.7\u2033 or 12.1\u2033 touch-screen' },
        { label: 'Dimensions (W\u00D7D\u00D7H)', value: '900 \u00D7 900 \u00D7 1700 mm' },
        { label: 'Weight (12 stations)', value: 'Approx. 250 kg' },
        { label: 'Voltage', value: '230/400 V, 50/60 Hz' },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050271/polinar/static/test-equipment/hydrostatic-internal-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050273/polinar/static/test-equipment/hydrostatic-internal-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050273/polinar/static/test-equipment/hydrostatic-internal.pdf',
    },
    {
      id: 'universal-tensile',
      name: 'Universal Tensile Tester',
      shortDescription:
        'Performs tension, compression and bending tests with brushless servo motor and 800% overload protection.',
      description:
        'The universal tensile tester is used for performing tension, compression and bending tests. The classic application is the tensile test, subjecting a sample to an increasing tensile load until it breaks. The force-deflection diagram generated provides information on the load-bearing capacity, elasticity and plastic deformation of the material sample.',
      features: [
        'Clear visualisation via integrated touch display',
        'Accuracy: \u00B10.5% of measurement up to 1/1000 of max. range',
        'Precise self-cleaning ballscrew with sealed bearings',
        'Brushless servo motor for maintenance-free operation',
        'Automatic detection and calibration of load cells and extensometers',
        '800% overload protection',
      ],
      standards: ['ISO 527', 'ISO 6259', 'ASTM D 638'],
      specs: [
        { label: 'Test force', value: '5 / 20 / 50 / 300 kN' },
        { label: 'Max. crosshead travel', value: '600\u20131100 mm' },
        { label: 'Crosshead speed', value: '0.001\u2013500 mm/min' },
        { label: 'Speed accuracy', value: '\u00B10.1%' },
        { label: 'Dimensions (W\u00D7D\u00D7H)', value: '590\u20131250 \u00D7 450\u2013900 \u00D7 1575\u20132600 mm' },
        { label: 'Weight', value: '156\u20132800 kg' },
        { label: 'Voltage', value: '3 ph 380/400 VAC, 50/60 Hz' },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050290/polinar/static/test-equipment/universal-tensile-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050292/polinar/static/test-equipment/universal-tensile-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050292/polinar/static/test-equipment/universal-tensile.pdf',
    },
    {
      id: 'falling-weight-impact',
      name: 'Falling Weight Impact Tester',
      shortDescription:
        'Determines external impact resistance of thermoplastic pipes using staircase or round-the-clock method.',
      description:
        'The falling weight tester is used to determine the external impact resistance of thermoplastic pipes using the staircase or round-the-clock method. Equipped with a state-of-the-art PLC and automatic double impact prevention system for reliable and repeatable results.',
      features: [
        'Convenient operation via integrated touch display',
        'Two-hand operation for personnel safety',
        'Test only when chamber is closed',
        'Precise weight positioning via step motor',
        'State-of-the-art PLC control',
        'Automatic double impact prevention system',
      ],
      standards: ['ISO 11173', 'ISO 3127', 'ASTM D 2444'],
      specs: [
        { label: 'Max. drop height', value: '2 m' },
        { label: 'Max. sample diameter', value: '110 / 400 / 710 mm' },
        { label: 'Height adjustment accuracy', value: '\u00B110 mm' },
        { label: 'Drop weights', value: '6.3 kg' },
        { label: 'Operation', value: 'Touch display' },
        { label: 'Tester dimensions (W\u00D7D\u00D7H)', value: '980 \u00D7 800 \u00D7 3000\u20133750 mm' },
        { label: 'Voltage', value: '3 ph 380/400 VAC 230/400 V, 50/60 Hz' },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050268/polinar/static/test-equipment/falling-weight-impact-tester-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050269/polinar/static/test-equipment/falling-weight-impact-tester-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050270/polinar/static/test-equipment/falling-weight-impact-tester.pdf',
    },
    {
      id: 'test-tanks',
      name: 'Test Tanks for Pipe Testing',
      shortDescription:
        'Stainless steel test tanks with precise temperature control for hydrostatic internal pressure testing.',
      description:
        'The test tanks are specially designed for testing thermoplastic pipes and fittings. The high reliability, durability of the materials used and the constant temperatures in the test tank with respect to both volume and time provide particularly reliable test conditions. A wide range of tank dimensions and connection options enable flexible adaptation to various operating conditions.',
      features: [
        'Air operated lid for simple and safe operation',
        'Constant temperatures via highly efficient water circulation',
        'Precise temperature control in the inner tank',
        'High-quality stainless steel (AISI 304)',
        'Double insulation and insulated lid for minimum energy loss',
        'Integrated monitoring and control of test temperature',
      ],
      standards: ['ISO 1167', 'ASTM D 1598', 'ASTM D 1599'],
      specs: [
        { label: 'Internal dimensions (W\u00D7L\u00D7H)', value: '750\u20131500 \u00D7 1000\u20133000 \u00D7 900\u20132000 mm' },
        { label: 'Heating power', value: '15\u201360 kW' },
        { label: 'Water temperature', value: 'Ambient +10 to max. 95 \u00B0C' },
        { label: 'Temp. adjustable increments', value: '0.1 \u00B0C' },
        { label: 'Regulating accuracy', value: '\u00B10.5 \u00B0C' },
        { label: 'Inner tank material', value: 'AISI 304' },
        { label: 'Voltage', value: '230/400 V, 50/60 Hz' },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050284/polinar/static/test-equipment/test-tanks-bank-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050285/polinar/static/test-equipment/test-tanks-bank-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050286/polinar/static/test-equipment/test-tanks.pdf',
    },
    {
      id: 'test-oven',
      name: 'Test Oven for Pipe Testing',
      shortDescription:
        'High-reliability test ovens with efficient water circulation and precise temperature control up to 1100 \u00B0C.',
      description:
        'The PTE test ovens are specially designed for testing thermoplastic pipes and fittings. The high reliability, long service life of the materials used and the constant temperatures in the test oven with respect to both volume and time provide particularly reliable test conditions. Efficient energy use with low servicing and maintenance costs guarantees efficient long-term operation.',
      features: [
        'Sliding rack system for easy fitting outside the oven',
        'Doors locked with safety switches',
        'Test pressure retrieval before doors release',
        'Highly efficient water circulation with precise temperature control',
        'High-quality stainless steel construction (AISI 304)',
        'High-quality oven insulation for minimum energy loss',
      ],
      standards: ['ISO 1167', 'ASTM D 1598', 'ASTM D 1599'],
      specs: [
        { label: 'Temperature range', value: '5/150 \u00B0C | 5/250 \u00B0C | up to 1100 \u00B0C' },
        { label: 'Regulating accuracy', value: '\u00B10.2 \u00B0C (\u00B11 \u00B0C at 1100 \u00B0C)' },
        { label: 'Inner chamber material', value: 'AISI 304' },
        { label: 'Power', value: '1.5 / 3.5 / 3.0 kW' },
        { label: 'Permissible ambient temp.', value: '+5 to +40 \u00B0C' },
        { label: 'Voltage', value: '220/380 V, 50/60 Hz' },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050281/polinar/static/test-equipment/test-oven-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050282/polinar/static/test-equipment/test-oven-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050283/polinar/static/test-equipment/test-oven.pdf',
    },
    {
      id: 'ring-stiffness',
      name: 'Ring Stiffness Tester',
      shortDescription:
        'PC-controlled testing machine for ring stiffness and flexibility of thermoplastic pipes up to 1000 mm diameter.',
      description:
        'The testing machine is designed to determine the ring stiffness and ring flexibility of thermoplastic pipes. Large compression plates allow performing tests on the respective diameter range and on pipes with lengths of up to one meter. A PC-based operational software enables clear representation and contributes to usability.',
      features: [
        'Automatic processing of test scenario',
        'PC-based control software with clear visualization',
        'Continuous measuring and recording of pipe deformation',
        'Continuous measuring and recording of compressive force',
        'Integrated extensometer',
        'Multiple operational modes for constant compression or constant speed',
      ],
      standards: ['ISO 9967', 'ISO 9969', 'ISO 13968', 'DIN 16961', 'ASTM D 2412'],
      specs: [
        { label: 'Max. test force', value: '30 kN' },
        { label: 'Max. outside diameter', value: '1000 mm' },
        { label: 'Travel distance', value: '930 mm' },
        { label: 'Accuracy', value: '\u00B11% of measurement (0.40\u201330 kN)' },
        { label: 'Dimensions (W\u00D7D\u00D7H)', value: '1900 \u00D7 1140 \u00D7 2030 mm' },
        { label: 'Weight', value: 'Approx. 1.75 t' },
        { label: 'Voltage', value: '3 ph 380/400 VAC 230/400 V, 50/60 Hz' },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050278/polinar/static/test-equipment/ring-stiffness-tester-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050279/polinar/static/test-equipment/ring-stiffness-tester-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050280/polinar/static/test-equipment/ring-stiffness-tester.pdf',
    },
    {
      id: 'thermal-cycling',
      name: 'Thermal Cycling Test Unit for Pipe Systems',
      shortDescription:
        'Automated thermal cycling with programmable cycles, independent dual pipe system testing and stepper motor prestress.',
      description:
        'The thermal cycling test unit enables simultaneous testing of two separate pipe systems independently. It features automatic test procedures with programmable numbers of cycles and cycle periods, temperatures and more. Automatic calculation and application of prestress via stepper motors ensures compliance with standards.',
      features: [
        'High constancy of temperature by large reservoirs',
        'Static pressures up to 10 bar',
        'Simultaneous testing of two separate pipe systems',
        'Programmable cycles, periods and temperatures',
        'Automatic prestress calculation via stepper motors',
        'Flow measurement and regulation automated',
      ],
      standards: ['ISO 19893', 'ISO 10508', 'DVGW W 534', 'DVGW W 542', 'DVGW W 543'],
      specs: [
        { label: 'Pressure range', value: '3\u201310 bar' },
        { label: 'Test circuits capacity', value: 'Up to 63 mm' },
        { label: 'Flow rate', value: 'Max. 1.0 l/sec' },
        { label: 'Max. test sample volume', value: '12 l' },
        { label: 'Hot temperature range', value: '50\u201395 \u00B0C' },
        { label: 'Cold temperature range', value: '15\u201330 \u00B0C' },
        { label: 'Number of cycles', value: 'Max. 99,999 per test' },
        { label: 'Voltage', value: '230/400 V, 50 Hz; approx. 25 kW' },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050287/polinar/static/test-equipment/thermal-cycling-test-unit-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050288/polinar/static/test-equipment/thermal-cycling-test-unit-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050289/polinar/static/test-equipment/thermal-cycling-test-unit.pdf',
    },
    {
      id: 'mfi-mfr',
      name: 'MFI / MFR Test Device',
      shortDescription:
        'Determines melt flow rate (MFI) and melt volume rate (MFR) with self-optimising temperature control.',
      description:
        'The MFI/MFR tester combines the determination of the melt flow rate (MFI) and melt volume rate (MFR) of thermoplastic materials into one test procedure under specified temperature and load conditions. Excellent temperature accuracy is achieved through a self-optimising control system.',
      features: [
        'Data input via touch display',
        'Excellent temperature accuracy via self-optimising control',
        'Electronically controlled cutting device',
        'Minimum energy demand via timer-controlled heating',
        'Max. temperature constancy maintained',
        'Long service life from high-quality, heat-resistant materials',
      ],
      standards: ['ISO 1133', 'ASTM D 1238'],
      specs: [
        { label: 'Test temperature', value: '50\u2013300 \u00B0C (0.1 K increments)' },
        { label: 'Temp. regulating accuracy', value: '\u00B10.1 K at nozzle' },
        { label: 'Load weights included', value: '2.160, 3.800, 5.000 kg' },
        { label: 'Load weights optional', value: '0.325, 1.200, 10.000, 11.600 kg' },
        { label: 'Dimensions (W\u00D7D\u00D7H)', value: '420 \u00D7 420 \u00D7 700 mm' },
        { label: 'Weight', value: '40 kg (without weight discs)' },
        { label: 'Voltage', value: '230 V, 50/60 Hz' },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050274/polinar/static/test-equipment/mfi-mfr-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050276/polinar/static/test-equipment/mfi-mfr-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050277/polinar/static/test-equipment/mfi-mfr.pdf',
    },
    {
      id: 'carbon-black',
      name: 'Carbon Black Tester',
      shortDescription:
        'Determines carbon black content of polyolefin plastics via pyrolytic decomposition in nitrogen flow.',
      description:
        'Statutory standards prescribe the verification of carbon black content of polyolefin plastics. The test method is based on pyrolytic decomposition of the material in an inert gas flow (nitrogen). The remaining quantity is burned once again under forced ventilation at the same temperature and the carbon black content determined by means of weight difference.',
      features: [
        'Simple and safe operation',
        'Complete test structure compactly assembled',
        'Overtemperature protection integrated in the tubular furnace',
        'Precise temperature control via digital temperature controller',
        'High-quality unit components for long service life',
        'Reliable and repeatable test results',
      ],
      standards: ['ISO 6964', 'ASTM D 1603'],
      specs: [
        { label: 'Furnace temperature range', value: '0\u20131000 \u00B0C' },
        { label: 'Accuracy (up to 200 \u00B0C)', value: '0.1 K' },
        { label: 'Accuracy (above 200 \u00B0C)', value: '1 K' },
        { label: 'Flow measuring device', value: '5\u201395 Nl/h or 1\u201313 Nl/h' },
        { label: 'Power requirement', value: '1 kW' },
        { label: 'Dimensions (W\u00D7D\u00D7H)', value: '760 \u00D7 650 \u00D7 1020 mm' },
        { label: 'Weight', value: 'Approx. 60 kg' },
        { label: 'Voltage', value: '1 ph 230 V, 50/60 Hz' },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050258/polinar/static/test-equipment/carbon-black-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050260/polinar/static/test-equipment/carbon-black-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050260/polinar/static/test-equipment/carbon-black.pdf',
    },
    {
      id: 'cnc-milling',
      name: 'CNC Milling Machine for Test Bars',
      shortDescription:
        'Table-top CNC milling machine producing up to 5 standard test bars per process with pre-configured programs.',
      description:
        'The test bar milling machine enables bar-shaped plastic samples to be produced for tension, pressure, bending and flexural impact tests in accordance with a wide range of standards. Pre-configured machining programs for all common bar shapes and visualisation via touch screen display make it very easy to operate.',
      features: [
        'Pre-configured machining programs per standard',
        'Protective doors with safety lock',
        'Clean workstation with swarf extraction system',
        'CNC-controlled positioning of all axes',
        'Machined areas cooled with compressed air',
        'Up to 5 test bars produced per milling process',
      ],
      standards: ['ISO 179/180', 'ISO 527', 'ISO 6259', 'ISO 16770', 'ASTM D 638', 'ASTM D 1822'],
      specs: [
        { label: 'Clamping range (small)', value: 'Max. 30 mm thick, 220 mm long' },
        { label: 'Clamping range (big)', value: 'Max. 90 mm thick, 250 mm long' },
        { label: 'Test bars per process', value: 'Max. 2/5' },
        { label: 'Spindle speed', value: '3,000\u201318,000 rpm' },
        { label: 'Dimensions (W\u00D7D\u00D7H)', value: '900 \u00D7 900 \u00D7 1700 mm' },
        { label: 'Weight', value: '450 kg' },
        { label: 'Voltage', value: '3 ph 380/400 VAC 230 V, 50 Hz' },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050262/polinar/static/test-equipment/cnc-milling-machine-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050263/polinar/static/test-equipment/cnc-milling-machine-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050264/polinar/static/test-equipment/cnc-milling-machine.pdf',
    },
    {
      id: 'end-closures',
      name: 'End Closures for Pipe Testing',
      shortDescription:
        'Stainless steel end closures for hydrostatic internal pressure testing of PE, PP and PVC pipes up to DN 630.',
      description:
        'The internal pressure creep test determines the strength of thermoplastic pipes under constant hydrostatic internal pressure at a constant ambient temperature. The end closures feature a proven design for quick assembly, simple and reliable venting directly at the sample, and high-quality components for long service life.',
      features: [
        'Quick assembly with proven end closure design',
        'Simple and reliable venting directly at the sample',
        'Suitable for PE, PP and PVC pipes',
        'Stainless steel construction (AISI 304)',
        'Ring nut for suspension included',
        'Quick-release plug pressure connection',
      ],
      standards: ['ISO 1167', 'ASTM D 1598', 'ASTM D 1599'],
      specs: [
        { label: 'Pipe diameter range', value: 'DN 20\u201340 / 50\u201390 / 110\u2013315 / 350\u2013630' },
        { label: 'Max. test pressure', value: '60 bar (40 bar for DN 350\u2013630)' },
        { label: 'Material', value: 'Stainless steel AISI 304 / S30300' },
        { label: 'Suitable pipes', value: 'PE, PP, PVC' },
        { label: 'Pressure connection', value: 'Quick-release plug' },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050265/polinar/static/test-equipment/end-closures-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050266/polinar/static/test-equipment/end-closures-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050267/polinar/static/test-equipment/end-closures.pdf',
    },
    {
      id: 'ball-valves-test',
      name: 'Ball Valves Test Units for Plastic Pipes',
      shortDescription:
        'PLC-controlled ball valve testing with pneumatic piston, touchscreen interface and up to 5 simultaneous stations.',
      description:
        'Ball valve test units for plastic pipes with pneumatic piston-driven head closing and whole system PLC control. Test pressure and all testing parameters can be defined, controlled and followed through the touchscreen user interface. Features audio-visual warning and indication system with optional data collecting and reporting.',
      features: [
        '5 stations active at a time (\u00D820\u201363 mm)',
        '2 stations active at a time (\u00D875\u201390 mm)',
        'Pneumatic piston driven head closing',
        '\u00B10.2 bar testing pressure accuracy (0.5\u20136 bar)',
        'Whole system PLC control with touchscreen UI',
        'Optional PoliREPORT and PoliLOGGER systems',
      ],
      standards: ['DIN EN ISO 15874', 'EN 1329'],
      specs: [
        { label: 'Working range', value: '20\u201363 mm / 20\u201340 mm' },
        { label: 'Test pressure', value: '0.5\u20136.0 bar' },
        { label: 'Test accuracy', value: '\u00B10.2 bar' },
        { label: 'Control', value: 'PLC with touchscreen' },
        { label: 'Dimensions (W\u00D7D\u00D7H)', value: '1250 \u00D7 600 \u00D7 2000 mm' },
        { label: 'Voltage', value: '220/380 V, 50/60 Hz' },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050255/polinar/static/test-equipment/ball-valves-test-units-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050256/polinar/static/test-equipment/ball-valves-test-units-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050257/polinar/static/test-equipment/ball-valves-test-units.pdf',
    },
  ],

  coreCapabilities: [
    {
      title: 'Precision Testing',
      description:
        'Microprocessor-controlled systems with high-accuracy sensors delivering repeatable results per international standards.',
    },
    {
      title: 'Standards Compliance',
      description:
        'Equipment designed to meet ISO, ASTM, DIN and DVGW standards for plastic pipe and fitting testing worldwide.',
    },
    {
      title: 'Custom Solutions',
      description:
        'Tailored test equipment configurations to match your specific production requirements and testing protocols.',
    },
    {
      title: 'After-Sales Support',
      description:
        'Comprehensive service and maintenance programs with remote diagnostics, spare parts and on-site technical support.',
    },
  ],

  highlights: [
    { value: '25+', label: 'Years Experience' },
    { value: '50+', label: 'Countries Exported' },
    { value: '12', label: 'Product Lines' },
    { value: 'ISO', label: 'Standards Certified' },
  ],

  ui: {
    heroEyebrow: 'Plastic Test Equipment',
    heroTitle: 'Plastic Test Equipment',
    heroSubtitle: 'Precision Testing Solutions for the Plastic Pipe & Fittings Industry',
    introTitle: 'Reliable Testing for Quality Assurance',
    introDescription:
      'Polinar Test Equipment (PTE) manufactures a comprehensive range of testing machines for the plastic pipe and fittings industry. Our equipment is designed and built to international standards including ISO, ASTM, DIN and DVGW, delivering precise, repeatable results for manufacturers worldwide.',
    productRangeEyebrow: 'Our Product Range',
    productRangeTitle: 'Test Equipment Categories',
    whyPolinarEyebrow: 'Why Polinar',
    whyPolinarTitle: 'Core Capabilities',
    whyPolinarDescription:
      'Every piece of Polinar test equipment is designed with precision engineering and built to deliver accurate, repeatable results that meet the highest international standards.',
    ctaTitle: 'Need a custom test equipment solution?',
    ctaSubtitle: 'Contact our engineering team for tailored configurations.',
    contactUs: 'Contact Us',
    breadcrumbCurrent: 'Plastic Test Equipment',
  },
}

export default ar
