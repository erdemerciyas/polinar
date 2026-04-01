import type { MachineryData } from './types'

const tr: MachineryData = {
  categories: [
    {
      id: 'bending-machines',
      name: 'Plastik Borular İçin Bükme Makineleri',
      shortDescription: 'PP-R boru segmentlerinin termo-form yöntemiyle çapraz geçişli özel ek parçaların yapımı için pnömatik bükme makinesi.',
      description: 'Polipropilen Random (PP-R) boru segmentlerinin termo-formu yoluyla çapraz geçişli özel ek parçaların inşası için uygun pnömatik bükme makinesi. Pnömatik kesici, 8 boru segmentine (Ø20–32 mm) kadar ısıtma ünitesi ve yerleşik soğutma üniteli istasyon pres tezgahı ile donatılmıştır. Pres bükme, soğuk boru bükmenin en basit ve en uygun maliyetli yöntemidir.',
      features: [
        'Toplama kutulu pnömatik kesici',
        '8 boru segmentine kadar ısıtma ünitesi',
        'Yerleşik soğutuculu istasyon pres tezgahı',
        'Her çap için kalıplar (Ø20–Ø32 mm)',
        'CE uygunluk sertifikalı',
      ],
      standards: ['DIN EN ISO 15874', 'DIN 8077', 'DIN 8078'],
      versions: {
        name: 'Versiyonlar',
        columns: ['T1201V1P Bükme Makinesi', 'T1101V2P Omega Makinesi'],
        rows: [
          {
            label: 'Çalışma aralığı',
            unit: 'mm',
            values: ['20-40', '20-30'],
          },
          {
            label: 'Çalışma basıncı',
            unit: 'Bar',
            values: ['6.0', '6.0'],
          },
          {
            label: 'CE uygunluğu',
            values: ['●', '●'],
          },
          {
            label: 'İzin verilen ortam sıcaklığı',
            unit: '°C',
            values: ['+5 ile +40', '+5 ile +40'],
          },
          {
            label: 'Voltaj verileri',
            values: ['220/380V 50/60 Hz', '220/380V 50/60 Hz'],
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
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050208/polinar/static/machinery/bending-machines-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050209/polinar/static/machinery/bending-machines-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050210/polinar/static/machinery/bending-machines.pdf',
    },
    {
      id: 'mini-extruder',
      name: '25D Çift Vidalı Yatay Ekstrüder',
      shortDescription: '4 otonom ısıtma bölgeli laboratuvar ölçekli mini ekstrüder; Ar-Ge\'den üretime ölçeklenebilir geometri.',
      description: 'Yatay 12 mm 25D ekstrüderimizin benzersiz kurulumu malzeme akışını iyileştirir ve 4 otonom ısıtma bölgesinde sıcaklık yönetimi sağlar. Ölçeklenebilir geometrik oranlar, laboratuvar testlerinden endüstriyel üretime sorunsuz geçiş sağlar.',
      features: [
        'Minimum aşınmalı dayanıklı malzeme temas parçaları',
        'Çok yönlü vida tasarımı ve kalıp seçenekleri',
        'Proses sıcaklığının hassas izlenmesi (300°C\'ye kadar / opsiyonel 450°C)',
        'Besleyiciler için entegre kontroller ve gelişmiş kontrol paneli',
        'Tak-çalıştır besleme ve aşağı akış ekipmanı',
      ],
      specs: [
        {
          label: 'Vida çapı',
          value: '12 mm',
        },
        {
          label: 'Uzunluk / Çap',
          value: '25:1',
        },
        {
          label: 'Vida hızı',
          value: '0-50 rpm',
        },
        {
          label: 'Vida konfigürasyonu',
          value: 'Segmentli, tamamen değiştirilebilir',
        },
        {
          label: 'Boyutlar',
          value: '300 × 800 × 430 mm',
        },
        {
          label: 'Motor gücü',
          value: '0.18 KW',
        },
        {
          label: 'Sıcaklık aralığı',
          value: '15–300°C (opsiyonel 15–450°C)',
        },
        {
          label: 'Torque output',
          value: '5 Nm per shaft max',
        },
        {
          label: 'Barrel zones',
          value: '4 temperature-controlled zones',
        },
        {
          label: 'Temperature range',
          value: '15–300°C (15–450°C optional)',
        },
        {
          label: 'Dies',
          value: 'Strand, cast film, strip, tube, co-extrusion',
        },
        {
          label: 'Requirements',
          value: '24A, 230V 1ph, 50/60Hz',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050211/polinar/static/machinery/mini-extruder-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050212/polinar/static/machinery/mini-extruder-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050213/polinar/static/machinery/mini-extruder.pdf',
    },
    {
      id: 'ball-valve-assembly',
      name: 'Plastik Küresel Vana Montaj Makinesi',
      shortDescription: '16 pozisyonlu döner tablalı, Endüstri 4.0 uyumlu servo kontrollü otomatik montaj.',
      description: 'Dokunmatik ekranlı kontrol paneli üzerinden elektronik olarak programlanabilen servo kontrollü döner tablalı ve 16 pozisyonlu döner diskli otomatik montaj makinesi. Merkezi denetleyici, Akıllı Fabrika ve Endüstri 4.0 gereksinimlerini takip ederek veri transferi için yönetim veritabanlarına bağlanır. Bileşenler manuel olarak yüklenir; boşaltma, iyi parça seçimi ve atık ayrımı ile otomatiktir.',
      features: [
        '16 bölmeli servo kontrollü döner tabla',
        'Kolay kurulum için dokunmatik ekranlı kontrol paneli',
        'Kalite ayrımı ile otomatik boşaltma',
        'Mobil cihaz üzerinden üretim izleme',
        'Endüstri 4.0 ve Akıllı Fabrika uyumlu',
      ],
      positions: [
        'Erkek manşon parçalarının yüklenmesi',
        'Erkek manşon parçalarının konum kontrolü',
        'Dişi manşon parçalarının yüklenmesi',
        'Dişi manşon parçalarının konum kontrolü',
        'Teflon halkaların erkek manşona yüklenmesi',
        'Teflon halkaların konum kontrolü',
        'Pim parçalarının yüklenmesi',
        'Pim parçalarının konum kontrolü',
        'Küresel parçaların yüklenmesi',
        'Küresel parçaların konum kontrolü',
        'Erkek ve dişi manşon parçalarının birleştirilmesi',
        'Küresel parçaların 90° döndürülmesi',
        'Ürünlerin boşaltılması',
        'Kusurlu ürünlerin boşaltılması',
        'İstasyon kontrolü',
        'Boş',
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050193/polinar/static/machinery/ball-valve-assembly-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050206/polinar/static/machinery/ball-valve-assembly-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050207/polinar/static/machinery/ball-valve-assembly.pdf',
    },
  ],
  coreCapabilities: [
    {
      title: 'Özel Mühendislik',
      description: 'Her makine, tasarımdan devreye almaya kadar özel üretim gereksinimlerinize göre uyarlanır.',
    },
    {
      title: 'Endüstri 4.0 Hazır',
      description: 'Merkezi denetleyiciler, mobil izleme ve veritabanı bağlantısı ile Akıllı Fabrika entegrasyonu.',
    },
    {
      title: 'CE Sertifikalı',
      description: 'Tüm makineler güvenlik, sağlık ve çevre koruma için Avrupa Uygunluk standartlarını karşılar.',
    },
    {
      title: 'Akıllı Fabrika Entegrasyonu',
      description: 'Veri transfer yetenekleri ve uzaktan teşhis araçlarına sahip merkezi denetleyici sistemleri.',
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
      value: '4.0',
      label: 'Endüstriye Hazır',
    },
    {
      value: '3',
      label: 'Ürün Hattı',
    },
  ],
  ui: {
    heroTitle: 'Özelleştirilmiş Ürünler ve Makineler',
    heroSubtitle: 'Boru ve Ek Parça Üretimi İçin Özel Makineler',
    introTitle: 'Hassas Makineler ve Özel Çözümler',
    introText: 'Polinar, plastik boru ve ek parça endüstrisi için özelleştirilmiş makineler tasarlar ve üretir. Bükme makinelerinden mini ekstrüderlere ve tam otomatik montaj hatlarına kadar çözümlerimiz hassasiyet, verimlilik ve Endüstri 4.0 akıllı fabrika ortamlarıyla sorunsuz entegrasyon için tasarlanmıştır.',
    categoriesLabel: 'Ürün Hatlarımız',
    categoriesSectionTitle: 'Makine Kategorileri',
    whyLabel: 'Neden Polinar',
    whySectionTitle: 'Temel Yetenekler',
    whyText: 'Her Polinar makinesi, üretim hattınızda maksimum verimlilik ve kaliteyi sağlayan hassas mühendislik ve akıllı teknoloji ile tasarlanmıştır.',
    ctaTitle: 'Özel bir makine çözümüne mi ihtiyacınız var?',
    ctaText: 'Özel tasarımlar için mühendislik ekibimizle iletişime geçin.',
    ctaButton: 'Bize Ulaşın',
    breadcrumbHome: 'Anasayfa',
    breadcrumbParentFallback: 'İşimiz',
    breadcrumbCurrent: 'Makineler',
    workCycleTitle: 'Çalışma Döngüsü — 16 İstasyon',
  },
}

export default tr
