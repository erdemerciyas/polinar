import type { PlasticTestEquipmentData } from './types'

const tr: PlasticTestEquipmentData = {
  categories: [
    {
      id: 'hydrostatic-internal',
      name: 'Hidrostatik İç Basınç Test Cihazı',
      shortDescription: '28 istasyona kadar otomatik hata ve sızıntı tespitine sahip mikroişlemci kontrollü sünme test sistemi.',
      description: 'İç basınç sünme testi, termoplastik boruların mukavemetini belirlemek için yapılan bir test prosedürüdür. Numuneler, belirli bir süre boyunca veya arızalanana kadar sabit bir ortam sıcaklığında sabit bir hidrostatik iç basınca tabi tutulur. Hassasiyet ve esneklikten ödün vermeden olağanüstü güvenilirliği basit kullanımla birleştirir.',
      features: [
        'Entegre dokunmatik ekran üzerinden kolay kullanım',
        'Otomatik hata ve sızıntı tespitli mikroişlemci kontrollü',
        '60 bar\'a kadar hassas basınç dönüştürücü, 130 bar\'a kadar sistem basıncı',
        'Su kesintisi algılama sistemi',
        '28 istasyona kadar genişletilebilir',
        'BTLogger® Windows tabanlı veri kaydedici yazılımı arayüzü',
      ],
      standards: ['ISO 1167', 'ASTM D 1598', 'ASTM D 1599'],
      specs: [
        {
          label: 'Basınç aralığı',
          value: '100 bar\'a kadar',
        },
        {
          label: 'Maks. istasyon',
          value: '4 / 8 / 12 / 16 / 20 / 28',
        },
        {
          label: 'Pompa kapasitesi',
          value: '10–14 l/dak',
        },
        {
          label: 'Kontrol',
          value: '5.7″ veya 12.1″ dokunmatik ekran',
        },
        {
          label: 'Ağırlık (12 istasyon)',
          value: 'Yaklaşık 250 kg',
        },
        {
          label: 'Weight (12 stations)',
          value: 'Approx. 250 kg',
        },
        {
          label: 'Voltage',
          value: '230/400 V, 50/60 Hz',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050271/polinar/static/test-equipment/hydrostatic-internal-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050273/polinar/static/test-equipment/hydrostatic-internal-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050273/polinar/static/test-equipment/hydrostatic-internal.pdf',
    },
    {
      id: 'universal-tensile',
      name: 'Evrensel Çekme Test Cihazı',
      shortDescription: 'Fırçasız servo motor ve %800 aşırı yük koruması ile çekme, basma ve eğilme testleri gerçekleştirir.',
      description: 'Evrensel çekme test cihazı; çekme, basma ve eğilme testlerini gerçekleştirmek için kullanılır. Klasik uygulama çekme testidir; bir numuneyi kırılana kadar artan bir çekme yüküne tabi tutar. Oluşturulan kuvvet-sapma diyagramı, malzeme numunesinin yük taşıma kapasitesi, elastikiyeti ve plastik deformasyonu hakkında bilgi sağlar.',
      features: [
        'Entegre dokunmatik ekran üzerinden net görselleştirme',
        'Doğruluk: Maksimum aralığın 1/1000\'ine kadar ölçümün ±%0.5\'i',
        'Sızdırmaz rulmanlı hassas kendi kendini temizleyen vidalı mil',
        'Bakım gerektirmeyen çalışma için fırçasız servo motor',
        'Yük hücrelerinin ve ekstansometrelerin otomatik algılanması ve kalibrasyonu',
        '%800 aşırı yük koruması',
      ],
      standards: ['ISO 527', 'ISO 6259', 'ASTM D 638'],
      specs: [
        {
          label: 'Test kuvveti',
          value: '5 / 20 / 50 / 300 kN',
        },
        {
          label: 'Maks. kros kafa hareketi',
          value: '600–1100 mm',
        },
        {
          label: 'Hız doğruluğu',
          value: '±%0.1',
        },
        {
          label: 'Voltaj',
          value: '3 faz 380/400 VAC, 50/60 Hz',
        },
        {
          label: 'Dimensions (W×D×H)',
          value: '590–1250 × 450–900 × 1575–2600 mm',
        },
        {
          label: 'Weight',
          value: '156–2800 kg',
        },
        {
          label: 'Voltage',
          value: '3 ph 380/400 VAC, 50/60 Hz',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050290/polinar/static/test-equipment/universal-tensile-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050292/polinar/static/test-equipment/universal-tensile-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050292/polinar/static/test-equipment/universal-tensile.pdf',
    },
    {
      id: 'falling-weight-impact',
      name: 'Düşen Ağırlık Darbe Test Cihazı',
      shortDescription: 'Merdiven veya saat yönü yöntemiyle termoplastik boruların dış darbe direncini belirler.',
      description: 'Düşen ağırlık test cihazı, merdiven veya saat yönü yöntemini kullanarak termoplastik boruların dış darbe direncini belirlemek için kullanılır. Güvenilir ve tekrarlanabilir sonuçlar için son teknoloji PLC ve otomatik çift darbe önleme sistemi ile donatılmıştır.',
      features: [
        'Entegre dokunmatik ekran üzerinden kolay kullanım',
        'Personel güvenliği için çift el kullanımı',
        'Sadece hücre kapalıyken test imkanı',
        'Step motor aracılığıyla hassas ağırlık konumlandırma',
        'Otomatik çift darbe önleme sistemi',
        'Automatic double impact prevention system',
      ],
      standards: ['ISO 11173', 'ISO 3127', 'ASTM D 2444'],
      specs: [
        {
          label: 'Maks. düşme yüksekliği',
          value: '2 m',
        },
        {
          label: 'Maks. numune çapı',
          value: '110 / 400 / 710 mm',
        },
        {
          label: 'Yükseklik ayar doğruluğu',
          value: '±10 mm',
        },
        {
          label: 'Düşme ağırlıkları',
          value: '6.3 kg',
        },
        {
          label: 'Operation',
          value: 'Touch display',
        },
        {
          label: 'Tester dimensions (W×D×H)',
          value: '980 × 800 × 3000–3750 mm',
        },
        {
          label: 'Voltage',
          value: '3 ph 380/400 VAC 230/400 V, 50/60 Hz',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050268/polinar/static/test-equipment/falling-weight-impact-tester-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050269/polinar/static/test-equipment/falling-weight-impact-tester-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050270/polinar/static/test-equipment/falling-weight-impact-tester.pdf',
    },
    {
      id: 'test-tanks',
      name: 'Boru Testi İçin Test Tankları',
      shortDescription: 'Hidrostatik iç basınç testi için hassas sıcaklık kontrollü paslanmaz çelik test tankları.',
      description: 'Test tankları, termoplastik boru ve ek parçaların test edilmesi için özel olarak tasarlanmıştır. Kullanılan malzemelerin yüksek güvenilirliği, dayanıklılığı ve test tankındaki hem hacim hem de zaman açısından sabit sıcaklıklar, özellikle güvenilir test koşulları sağlar.',
      features: [
        'Basit ve güvenli kullanım için havalı kapak',
        'Yüksek verimli su sirkülasyonu ile sabit sıcaklıklar',
        'İç tankta hassas sıcaklık kontrolü',
        'Yüksek kaliteli paslanmaz çelik (AISI 304)',
        'Minimum enerji kaybı için çift izolasyon ve izoleli kapak',
        'Test sıcaklığının entegre izlenmesi ve kontrolü',
      ],
      standards: ['ISO 1167', 'ASTM D 1598', 'ASTM D 1599'],
      specs: [
        {
          label: 'Isıtma gücü',
          value: '15–60 kW',
        },
        {
          label: 'Su sıcaklığı',
          value: 'Ortam +10 ile maks. 95 °C',
        },
        {
          label: 'Sıcaklık ayar kademeleri',
          value: '0.1 °C',
        },
        {
          label: 'Düzenleme doğruluğu',
          value: '±0.5 °C',
        },
        {
          label: 'Regulating accuracy',
          value: '±0.5 °C',
        },
        {
          label: 'Inner tank material',
          value: 'AISI 304',
        },
        {
          label: 'Voltage',
          value: '230/400 V, 50/60 Hz',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050284/polinar/static/test-equipment/test-tanks-bank-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050285/polinar/static/test-equipment/test-tanks-bank-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050286/polinar/static/test-equipment/test-tanks.pdf',
    },
    {
      id: 'test-oven',
      name: 'Boru Testi İçin Test Fırını',
      shortDescription: '1100 °C\'ye kadar hassas sıcaklık kontrolü ve verimli su sirkülasyonuna sahip yüksek güvenilirliğe sahip test fırınları.',
      description: 'PTE test fırınları, termoplastik boru ve ek parçaların test edilmesi için özel olarak tasarlanmıştır. Düşük servis ve bakım maliyetleri ile verimli enerji kullanımı, verimli uzun vadeli çalışmayı garanti eder.',
      features: [
        'Fırın dışında kolay montaj için kayar raf sistemi',
        'Güvenlik anahtarlı kilitli kapılar',
        'Kapılar açılmadan önce test basıncı tahliyesi',
        'Hassas sıcaklık kontrollü yüksek verimli su sirkülasyonu',
        'Yüksek kaliteli paslanmaz çelik konstrüksiyon (AISI 304)',
        'Minimum enerji kaybı için yüksek kaliteli fırın izolasyonu',
      ],
      standards: ['ISO 1167', 'ASTM D 1598', 'ASTM D 1599'],
      specs: [
        {
          label: 'Sıcaklık aralığı',
          value: '5/150 °C | 5/250 °C | 1100 °C\'ye kadar',
        },
        {
          label: 'Düzenleme doğruluğu',
          value: '±0.2 °C (1100 °C\'de ±1 °C)',
        },
        {
          label: 'İç oda malzemesi',
          value: 'AISI 304',
        },
        {
          label: 'Power',
          value: '1.5 / 3.5 / 3.0 kW',
        },
        {
          label: 'Permissible ambient temp.',
          value: '+5 to +40 °C',
        },
        {
          label: 'Voltage',
          value: '220/380 V, 50/60 Hz',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050281/polinar/static/test-equipment/test-oven-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050282/polinar/static/test-equipment/test-oven-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050283/polinar/static/test-equipment/test-oven.pdf',
    },
    {
      id: 'ring-stiffness',
      name: 'Halka Rijitliği Test Cihazı',
      shortDescription: '1000 mm çapa kadar termoplastik boruların halka rijitliği ve esnekliği için PC kontrollü test makinesi.',
      description: 'Test makinesi, termoplastik boruların halka rijitliğini ve halka esnekliğini belirlemek için tasarlanmıştır. Büyük baskı plakaları, ilgili çap aralığında ve bir metreye kadar uzunluktaki borular üzerinde testlerin yapılmasına olanak tanır.',
      features: [
        'Test senaryosunun otomatik işlenmesi',
        'Net görselleştirmeye sahip PC tabanlı kontrol yazılımı',
        'Boru deformasyonunun sürekli ölçümü ve kaydı',
        'Sıkıştırma kuvvetinin sürekli ölçümü ve kaydı',
        'Entegre ekstansometre',
        'Sabit sıkıştırma veya sabit hız için çoklu çalışma modları',
      ],
      standards: ['ISO 9967', 'ISO 9969', 'ISO 13968', 'DIN 16961', 'ASTM D 2412'],
      specs: [
        {
          label: 'Maks. test kuvveti',
          value: '30 kN',
        },
        {
          label: 'Maks. dış çap',
          value: '1000 mm',
        },
        {
          label: 'Hareket mesafesi',
          value: '930 mm',
        },
        {
          label: 'Doğruluk',
          value: 'Ölçümün ±%1\'i (0.40–30 kN)',
        },
        {
          label: 'Ağırlık',
          value: 'Yaklaşık 1.75 ton',
        },
        {
          label: 'Weight',
          value: 'Approx. 1.75 t',
        },
        {
          label: 'Voltage',
          value: '3 ph 380/400 VAC 230/400 V, 50/60 Hz',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050278/polinar/static/test-equipment/ring-stiffness-tester-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050279/polinar/static/test-equipment/ring-stiffness-tester-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050280/polinar/static/test-equipment/ring-stiffness-tester.pdf',
    },
    {
      id: 'thermal-cycling',
      name: 'Boru Sistemleri İçin Isıl Döngü Test Ünitesi',
      shortDescription: 'Programlanabilir döngüler, bağımsız çift boru sistemi testi ve step motorlu ön gerilme ile otomatik ısıl döngü.',
      description: 'Isıl döngü test ünitesi, iki ayrı boru sisteminin bağımsız olarak eş zamanlı test edilmesini sağlar. Programlanabilir döngü sayıları, süreler ve sıcaklıklar ile otomatik test prosedürlerine sahiptir.',
      features: [
        'Büyük rezervuarlar ile yüksek sıcaklık sabitliği',
        '10 bar\'a kadar statik basınçlar',
        'İki ayrı boru sisteminin eş zamanlı testi',
        'Programlanabilir döngüler, süreler ve sıcaklıklar',
        'Step motorlar aracılığıyla otomatik ön gerilme hesaplaması',
        'Otomatik akış ölçümü ve regülasyonu',
      ],
      standards: ['ISO 19893', 'ISO 10508', 'DVGW W 534', 'DVGW W 542', 'DVGW W 543'],
      specs: [
        {
          label: 'Basınç aralığı',
          value: '3–10 bar',
        },
        {
          label: 'Test devreleri kapasitesi',
          value: '63 mm\'ye kadar',
        },
        {
          label: 'Sıcak sıcaklık aralığı',
          value: '50–95 °C',
        },
        {
          label: 'Soğuk sıcaklık aralığı',
          value: '15–30 °C',
        },
        {
          label: 'Döngü sayısı',
          value: 'Test başına maks. 99.999',
        },
        {
          label: 'Cold temperature range',
          value: '15–30 °C',
        },
        {
          label: 'Number of cycles',
          value: 'Max. 99,999 per test',
        },
        {
          label: 'Voltage',
          value: '230/400 V, 50 Hz; approx. 25 kW',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050287/polinar/static/test-equipment/thermal-cycling-test-unit-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050288/polinar/static/test-equipment/thermal-cycling-test-unit-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050289/polinar/static/test-equipment/thermal-cycling-test-unit.pdf',
    },
    {
      id: 'mfi-mfr',
      name: 'MFI / MFR Test Cihazı',
      shortDescription: 'Kendi kendini optimize eden sıcaklık kontrolü ile erime akış hızını (MFI) ve erime hacim hızını (MFR) belirler.',
      description: 'MFI/MFR test cihazı, termoplastik malzemelerin erime akış hızı (MFI) ve erime hacim hızının (MFR) belirlenmesini belirli sıcaklık ve yük koşulları altında tek bir test prosedüründe birleştirir.',
      features: [
        'Dokunmatik ekran üzerinden veri girişi',
        'Kendi kendini optimize eden kontrol ile mükemmel sıcaklık doğruluğu',
        'Elektronik kontrollü kesme cihazı',
        'Zamanlayıcı kontrollü ısıtma ile minimum enerji talebi',
        'Maksimum sıcaklık sabitliği korunur',
        'Yüksek kaliteli, ısıya dayanıklı malzemelerden uzun servis ömrü',
      ],
      standards: ['ISO 1133', 'ASTM D 1238'],
      specs: [
        {
          label: 'Test sıcaklığı',
          value: '50–300 °C (0.1 K kademeler)',
        },
        {
          label: 'Sıcaklık düzenleme doğruluğu',
          value: 'Nozulda ±0.1 K',
        },
        {
          label: 'Yük ağırlıkları',
          value: '2.160, 3.800, 5.000 kg dahil',
        },
        {
          label: 'Ağırlık',
          value: '40 kg (ağırlık diskleri hariç)',
        },
        {
          label: 'Dimensions (W×D×H)',
          value: '420 × 420 × 700 mm',
        },
        {
          label: 'Weight',
          value: '40 kg (without weight discs)',
        },
        {
          label: 'Voltage',
          value: '230 V, 50/60 Hz',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050274/polinar/static/test-equipment/mfi-mfr-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050276/polinar/static/test-equipment/mfi-mfr-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050277/polinar/static/test-equipment/mfi-mfr.pdf',
    },
    {
      id: 'carbon-black',
      name: 'Karbon Karası Test Cihazı',
      shortDescription: 'Azot akışında pirolitik ayrıştırma yoluyla poliolefin plastiklerin karbon karası içeriğini belirler.',
      description: 'Yasal standartlar, poliolefin plastiklerin karbon karası içeriğinin doğrulanmasını öngörür. Test yöntemi, malzemenin inert gaz akışında (azot) pirolitik ayrışmasına dayanır.',
      features: [
        'Basit ve güvenli kullanım',
        'Tam test yapısı kompakt bir şekilde monte edilmiştir',
        'Boru tipi fırına entegre aşırı sıcaklık koruması',
        'Dijital sıcaklık kontrolörü üzerinden hassas sıcaklık kontrolü',
        'Uzun servis ömrü için yüksek kaliteli ünite bileşenleri',
        'Güvenilir ve tekrarlanabilir test sonuçları',
      ],
      standards: ['ISO 6964', 'ASTM D 1603'],
      specs: [
        {
          label: 'Fırın sıcaklık aralığı',
          value: '0–1000 °C',
        },
        {
          label: 'Doğruluk (200 °C\'ye kadar)',
          value: '0.1 K',
        },
        {
          label: 'Akış ölçme cihazı',
          value: '5–95 Nl/sa veya 1–13 Nl/sa',
        },
        {
          label: 'Güç gereksinimi',
          value: '1 kW',
        },
        {
          label: 'Power requirement',
          value: '1 kW',
        },
        {
          label: 'Dimensions (W×D×H)',
          value: '760 × 650 × 1020 mm',
        },
        {
          label: 'Weight',
          value: 'Approx. 60 kg',
        },
        {
          label: 'Voltage',
          value: '1 ph 230 V, 50/60 Hz',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050258/polinar/static/test-equipment/carbon-black-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050260/polinar/static/test-equipment/carbon-black-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050260/polinar/static/test-equipment/carbon-black.pdf',
    },
    {
      id: 'cnc-milling',
      name: 'Test Çubukları İçin CNC Freze Makinesi',
      shortDescription: 'Önceden yapılandırılmış programlarla proses başına 5 standart test çubuğuna kadar üreten masaüstü CNC freze makinesi.',
      description: 'Test çubuğu freze makinesi; çekme, basınç, eğilme ve eğilme darbe testleri için çeşitli standartlara uygun çubuk şeklindeki plastik numunelerin üretilmesini sağlar.',
      features: [
        'Standart başına önceden yapılandırılmış işleme programları',
        'Güvenlik kilitli koruyucu kapılar',
        'Talaş emme sistemli temiz çalışma istasyonu',
        'Tüm eksenlerin CNC kontrollü konumlandırılması',
        'İşlenen alanlar basınçlı hava ile soğutulur',
        'Bir frezeleme işlemi başına 5 test çubuğuna kadar üretim',
      ],
      standards: [
        'ISO 179/180',
        'ISO 527',
        'ISO 6259',
        'ASTM D 638',
        'ASTM D 638',
        'ASTM D 1822',
      ],
      specs: [
        {
          label: 'Sıkıştırma aralığı (küçük)',
          value: 'Maks. 30 mm kalınlık, 220 mm uzunluk',
        },
        {
          label: 'İş mili hızı',
          value: '3.000–18.000 rpm',
        },
        {
          label: 'Boyutlar (G×D×Y)',
          value: '900 × 900 × 1700 mm',
        },
        {
          label: 'Ağırlık',
          value: '450 kg',
        },
        {
          label: 'Dimensions (W×D×H)',
          value: '900 × 900 × 1700 mm',
        },
        {
          label: 'Weight',
          value: '450 kg',
        },
        {
          label: 'Voltage',
          value: '3 ph 380/400 VAC 230 V, 50 Hz',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050262/polinar/static/test-equipment/cnc-milling-machine-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050263/polinar/static/test-equipment/cnc-milling-machine-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050264/polinar/static/test-equipment/cnc-milling-machine.pdf',
    },
    {
      id: 'end-closures',
      name: 'Boru Testi İçin Kapamalar',
      shortDescription: 'DN 630\'a kadar PE, PP ve PVC boruların hidrostatik iç basınç testi için paslanmaz çelik kapamalar.',
      description: 'İç basınç sünme testi, termoplastik boruların sabit hidrostatik iç basınç altındaki mukavemetini belirler. Kapamalar; hızlı montaj, basit ve güvenilir hava tahliyesi için kanıtlanmış bir tasarıma sahiptir.',
      features: [
        'Kanıtlanmış kapama tasarımı ile hızlı montaj',
        'Numunede doğrudan basit ve güvenilir hava tahliyesi',
        'PE, PP ve PVC borular için uygun',
        'Paslanmaz çelik konstrüksiyon (AISI 304)',
        'Süspansiyon için halka somun dahil',
        'Hızlı açılır fiş basınç bağlantısı',
      ],
      standards: ['ISO 1167', 'ASTM D 1598', 'ASTM D 1599'],
      specs: [
        {
          label: 'Boru çapı aralığı',
          value: 'DN 20–40 / 50–90 / 110–315 / 350–630',
        },
        {
          label: 'Maks. test basıncı',
          value: '60 bar (DN 350–630 için 40 bar)',
        },
        {
          label: 'Malzeme',
          value: 'Paslanmaz çelik AISI 304 / S30300',
        },
        {
          label: 'Uygun borular',
          value: 'PE, PP, PVC',
        },
        {
          label: 'Pressure connection',
          value: 'Quick-release plug',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050265/polinar/static/test-equipment/end-closures-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050266/polinar/static/test-equipment/end-closures-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050267/polinar/static/test-equipment/end-closures.pdf',
    },
    {
      id: 'ball-valves-test',
      name: 'Plastik Borular İçin Küresel Vana Test Üniteleri',
      shortDescription: 'Pnömatik pistonlu, dokunmatik ekranlı ve aynı anda 5 istasyona kadar PLC kontrollü küresel vana testi.',
      description: 'Pnömatik piston tahrikli kafa kapama ve tüm sistem PLC kontrollü plastik borular için küresel vana test üniteleri. Test basıncı ve tüm test parametreleri tanımlanabilir ve dokunmatik kullanıcı arayüzü üzerinden takip edilebilir.',
      features: [
        'Aynı anda 5 istasyon aktif (Ø20–63 mm)',
        'Aynı anda 2 istasyon aktif (Ø75–90 mm)',
        'Pnömatik piston tahrikli kafa kapama',
        '±0.2 bar test basıncı doğruluğu (0.5–6 bar)',
        'Dokunmatik ekranlı kullanıcı arayüzü ile tüm sistem PLC kontrolü',
        'Opsiyonel PoliREPORT ve PoliLOGGER sistemleri',
      ],
      standards: ['DIN EN ISO 15874', 'EN 1329'],
      specs: [
        {
          label: 'Çalışma aralığı',
          value: '20–63 mm / 20–40 mm',
        },
        {
          label: 'Test basıncı',
          value: '0.5–6.0 bar',
        },
        {
          label: 'Test doğruluğu',
          value: '±0.2 bar',
        },
        {
          label: 'Kontrol',
          value: 'Dokunmatik ekranlı PLC',
        },
        {
          label: 'Dimensions (W×D×H)',
          value: '1250 × 600 × 2000 mm',
        },
        {
          label: 'Voltage',
          value: '220/380 V, 50/60 Hz',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050255/polinar/static/test-equipment/ball-valves-test-units-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050256/polinar/static/test-equipment/ball-valves-test-units-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050257/polinar/static/test-equipment/ball-valves-test-units.pdf',
    },
  ],
  coreCapabilities: [
    {
      title: 'Hassas Test',
      description: 'Uluslararası standartlara göre tekrarlanabilir sonuçlar sunan yüksek hassasiyetli sensörlere sahip mikroişlemci kontrollü sistemler.',
    },
    {
      title: 'Standartlara Uygunluk',
      description: 'Dünya çapında plastik boru ve ek parça testi için ISO, ASTM, DIN ve DVGW standartlarını karşılayacak şekilde tasarlanmış ekipman.',
    },
    {
      title: 'Özel Çözümler',
      description: 'Özel üretim gereksinimlerinize ve test protokollerinize uygun özelleştirilmiş test ekipmanı konfigürasyonları.',
    },
    {
      title: 'Satış Sonrası Destek',
      description: 'Uzaktan teşhis, yedek parça ve yerinde teknik destek ile kapsamlı servis ve bakım programları.',
    },
  ],
  highlights: [
    {
      value: '25+',
      label: 'Yıllık Deneyim',
    },
    {
      value: '50+',
      label: 'İhraç Edilen Ülke',
    },
    {
      value: '12',
      label: 'Ürün Hattı',
    },
    {
      value: 'ISO',
      label: 'Standart Sertifikalı',
    },
  ],
  ui: {
    heroEyebrow: 'Plastik Test Ekipmanları',
    heroTitle: 'Plastik Test Ekipmanları',
    heroSubtitle: 'Plastik Boru ve Ek Parça Endüstrisi İçin Hassas Test Çözümleri',
    introTitle: 'Kalite Güvencesi İçin Güvenilir Test',
    introDescription: 'Polinar Test Ekipmanları (PTE), plastik boru ve ek parça endüstrisi için kapsamlı bir test makinesi yelpazesi üretmektedir. Ekipmanlarımız; ISO, ASTM, DIN ve DVGW dahil olmak üzere uluslararası standartlara göre tasarlanmış ve üretilmiştir.',
    productRangeEyebrow: 'Ürün Yelpazemiz',
    productRangeTitle: 'Test Ekipmanları Kategorileri',
    whyPolinarEyebrow: 'Neden Polinar',
    whyPolinarTitle: 'Temel Yetenekler',
    whyPolinarDescription: 'Her bir Polinar test ekipmanı, hassas mühendislik ile tasarlanmış ve en yüksek uluslararası standartları karşılayan doğru, tekrarlanabilir sonuçlar sunmak üzere üretilmiştir.',
    ctaTitle: 'Özel bir test ekipmanı çözümüne mi ihtiyacınız var?',
    ctaSubtitle: 'Özel konfigürasyonlar için mühendislik ekibimizle iletişime geçin.',
    contactUs: 'Bize Ulaşın',
    breadcrumbCurrent: 'Plastik Test Ekipmanları',
  },
}

export default tr
