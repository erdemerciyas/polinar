import type { PlasticTestEquipmentData } from './types'

const ru: PlasticTestEquipmentData = {
  categories: [
    {
      id: 'hydrostatic-internal',
      name: 'Тестер гидростатического внутреннего давления',
      shortDescription: 'Микропроцессорная система испытаний на ползучесть с автоматическим обнаружением сбоев и утечек (до 28 станций).',
      description: 'Испытание на ползучесть под внутренним давлением — это процедура определения прочности термопластичных труб. Образцы подвергаются постоянному гидростатическому давлению при постоянной температуре до истечения заданного времени или до разрушения. Сочетает надежность с простотой эксплуатации без компромиссов в точности.',
      features: [
        'Удобное управление через встроенный сенсорный дисплей',
        'Микропроцессорный контроль с обнаружением утечек и сбоев',
        'Прецизионный датчик давления до 60 бар, системное давление до 130 бар',
        'Система обнаружения перебоев в подаче воды',
        'Расширение до 28 станций',
        'Интерфейс для ПО BTLogger® на базе Windows',
      ],
      standards: ['ISO 1167', 'ASTM D 1598', 'ASTM D 1599'],
      specs: [
        {
          label: 'Диапазон давления',
          value: 'До 100 бар',
        },
        {
          label: 'Макс. станций',
          value: '4 / 8 / 12 / 16 / 20 / 28',
        },
        {
          label: 'Производительность насоса',
          value: '10–14 л/мин',
        },
        {
          label: 'Управление',
          value: 'Сенсорный экран 5.7″ или 12.1″',
        },
        {
          label: 'Размеры (Ш×Г×В)',
          value: '900 × 900 × 1700 мм',
        },
        {
          label: 'Вес (12 станций)',
          value: 'Прибл. 250 кг',
        },
        {
          label: 'Напряжение',
          value: '230/400 В, 50/60 Гц',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050271/polinar/static/test-equipment/hydrostatic-internal-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050273/polinar/static/test-equipment/hydrostatic-internal-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050273/polinar/static/test-equipment/hydrostatic-internal.pdf',
    },
    {
      id: 'universal-tensile',
      name: 'Универсальная разрывная машина',
      shortDescription: 'Выполняет тесты на растяжение, сжатие и изгиб с бесщеточным серводвигателем и защитой от перегрузки 800%.',
      description: 'Используется для проведения испытаний на растяжение, сжатие и изгиб. Классическое применение — тест на растяжение до разрыва образца. Генерируемая диаграмма сила-деформация дает информацию о несущей способности, эластичности и пластической деформации материала.',
      features: [
        'Четкая визуализация через сенсорный дисплей',
        'Точность: ±0.5% от измерения до 1/1000 макс. диапазона',
        'Прецизионная самоочищающаяся шарико-винтовая пара с герметичными подшипниками',
        'Бесщеточный серводвигатель для работы без обслуживания',
        'Автоматическое обнаружение и калибровка датчиков нагрузки',
        'Защита от перегрузки 800%',
      ],
      standards: ['ISO 527', 'ISO 6259', 'ASTM D 638'],
      specs: [
        {
          label: 'Испытательное усилие',
          value: '5 / 20 / 50 / 300 кН',
        },
        {
          label: 'Макс. ход траверсы',
          value: '600–1100 мм',
        },
        {
          label: 'Скорость траверсы',
          value: '0.001–500 мм/мин',
        },
        {
          label: 'Точность скорости',
          value: '±0.1%',
        },
        {
          label: 'Размеры (Ш×Г×В)',
          value: '590–1250 × 450–900 × 1575–2600 мм',
        },
        {
          label: 'Вес',
          value: '156–2800 кг',
        },
        {
          label: 'Напряжение',
          value: '3 фазы 380/400 В перем. тока, 50/60 Гц',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050290/polinar/static/test-equipment/universal-tensile-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050292/polinar/static/test-equipment/universal-tensile-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050292/polinar/static/test-equipment/universal-tensile.pdf',
    },
    {
      id: 'falling-weight-impact',
      name: 'Копер для испытаний падающим грузом',
      shortDescription: 'Определяет ударную прочность термопластичных труб методами \'лестницы\' или круговым методом.',
      description: 'Прибор используется для определения сопротивления внешнему удару термопластичных труб. Оснащен современным ПЛК и автоматической системой предотвращения повторного удара для надежных результатов.',
      features: [
        'Удобное управление через сенсорный дисплей',
        'Двуручное управление для безопасности персонала',
        'Тестирование только при закрытой камере',
        'Точное позиционирование груза с помощью шагового двигателя',
        'Современное управление на базе ПЛК',
        'Автоматическая система предотвращения двойного удара',
      ],
      standards: ['ISO 11173', 'ISO 3127', 'ASTM D 2444'],
      specs: [
        {
          label: 'Макс. высота падения',
          value: '2 м',
        },
        {
          label: 'Макс. диаметр образца',
          value: '110 / 400 / 710 мм',
        },
        {
          label: 'Точность регулировки высоты',
          value: '±10 мм',
        },
        {
          label: 'Падающие грузы',
          value: '6.3 кг',
        },
        {
          label: 'Управление',
          value: 'Сенсорный дисплей',
        },
        {
          label: 'Размеры тестера (Ш×Г×В)',
          value: '980 × 800 × 3000–3750 мм',
        },
        {
          label: 'Напряжение',
          value: '3 фазы 380/400 В перем. тока 230/400 В, 50/60 Гц',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050268/polinar/static/test-equipment/falling-weight-impact-tester-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050269/polinar/static/test-equipment/falling-weight-impact-tester-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050270/polinar/static/test-equipment/falling-weight-impact-tester.pdf',
    },
    {
      id: 'test-tanks',
      name: 'Испытательные ванны для труб',
      shortDescription: 'Ванны из нержавеющей стали с точным контролем температуры для гидростатических испытаний.',
      description: 'Специально разработаны для испытаний термопластичных труб и фитингов. Высокая надежность, долговечность материалов и стабильность температуры по всему объему обеспечивают достоверные условия испытаний.',
      features: [
        'Пневматическая крышка для простой и безопасной работы',
        'Постоянная температура благодаря эффективной циркуляции воды',
        'Точный контроль температуры во внутренней ванне',
        'Высококачественная нержавеющая сталь (AISI 304)',
        'Двойная изоляция для минимизации потерь энергии',
        'Встроенный мониторинг и контроль температуры испытаний',
      ],
      standards: ['ISO 1167', 'ASTM D 1598', 'ASTM D 1599'],
      specs: [
        {
          label: 'Внутренние размеры (Ш×Д×В)',
          value: '750–1500 × 1000–3000 × 900–2000 мм',
        },
        {
          label: 'Мощность нагрева',
          value: '15–60 кВт',
        },
        {
          label: 'Температура воды',
          value: 'Окружающая +10 до макс. 95 °C',
        },
        {
          label: 'Шаг настройки температуры',
          value: '0.1 °C',
        },
        {
          label: 'Точность регулирования',
          value: '±0.5 °C',
        },
        {
          label: 'Материал внутренней ванны',
          value: 'AISI 304',
        },
        {
          label: 'Напряжение',
          value: '230/400 В, 50/60 Гц',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050284/polinar/static/test-equipment/test-tanks-bank-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050285/polinar/static/test-equipment/test-tanks-bank-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050286/polinar/static/test-equipment/test-tanks.pdf',
    },
    {
      id: 'test-oven',
      name: 'Испытательная печь для труб',
      shortDescription: 'Надежные печи с эффективной циркуляцией и точным контролем температуры до 1100 °C.',
      description: 'Печи PTE разработаны для испытаний труб и фитингов. Долгий срок службы материалов и равномерность температуры обеспечивают высокую надежность тестов при низких затратах на обслуживание.',
      features: [
        'Система выдвижных стеллажей для удобства загрузки',
        'Двери с предохранительными выключателями',
        'Сброс давления перед открытием дверей',
        'Эффективная циркуляция воздуха с точным контролем',
        'Конструкция из высококачественной нержавеющей стали (AISI 304)',
        'Высококачественная изоляция для экономии энергии',
      ],
      standards: ['ISO 1167', 'ASTM D 1598', 'ASTM D 1599'],
      specs: [
        {
          label: 'Диапазон температур',
          value: '5/150 °C | 5/250 °C | до 1100 °C',
        },
        {
          label: 'Точность регулирования',
          value: '±0.2 °C (±1 °C при 1100 °C)',
        },
        {
          label: 'Материал внутренней камеры',
          value: 'AISI 304',
        },
        {
          label: 'Мощность',
          value: '1.5 / 3.5 / 3.0 кВт',
        },
        {
          label: 'Допустимая температура среды',
          value: '+5 до +40 °C',
        },
        {
          label: 'Напряжение',
          value: '220/380 В, 50/60 Гц',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050281/polinar/static/test-equipment/test-oven-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050282/polinar/static/test-equipment/test-oven-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050283/polinar/static/test-equipment/test-oven.pdf',
    },
    {
      id: 'ring-stiffness',
      name: 'Тестер кольцевой жесткости',
      shortDescription: 'Машина с компьютерным управлением для проверки кольцевой жесткости и гибкости труб диаметром до 1000 мм.',
      description: 'Предназначен для определения кольцевой жесткости и гибкости труб. Большие нажимные пластины позволяют испытывать трубы длиной до одного метра. ПО на базе ПК обеспечивает наглядность и удобство работы.',
      features: [
        'Автоматическая обработка сценария испытания',
        'ПО на базе ПК с четкой визуализацией',
        'Постоянное измерение и запись деформации трубы',
        'Постоянное измерение и запись силы сжатия',
        'Встроенный экстензометр',
        'Режимы работы с постоянным сжатием или скоростью',
      ],
      standards: ['ISO 9967', 'ISO 9969', 'ISO 13968', 'DIN 16961', 'ASTM D 2412'],
      specs: [
        {
          label: 'Макс. усилие',
          value: '30 кН',
        },
        {
          label: 'Макс. наружный диаметр',
          value: '1000 мм',
        },
        {
          label: 'Ход',
          value: '930 мм',
        },
        {
          label: 'Точность',
          value: '±1% от измерения (0.40–30 кН)',
        },
        {
          label: 'Размеры (Ш×Г×В)',
          value: '1900 × 1140 × 2030 мм',
        },
        {
          label: 'Вес',
          value: 'Прибл. 1.75 т',
        },
        {
          label: 'Напряжение',
          value: '3 фазы 380/400 В перем. тока 230/400 В, 50/60 Гц',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050278/polinar/static/test-equipment/ring-stiffness-tester-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050279/polinar/static/test-equipment/ring-stiffness-tester-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050280/polinar/static/test-equipment/ring-stiffness-tester.pdf',
    },
    {
      id: 'thermal-cycling',
      name: 'Установка для циклических температурных испытаний',
      shortDescription: 'Автоматизированная система с программируемыми циклами и независимым тестированием двух трубных систем.',
      description: 'Позволяет одновременно испытывать две разные системы труб независимо. Автоматические процедуры с настройкой циклов, температур и периодов. Шаговые двигатели автоматически рассчитывают и применяют предварительное напряжение.',
      features: [
        'Стабильность температуры благодаря большим резервуарам',
        'Статическое давление до 10 бар',
        'Одновременное испытание двух независимых систем',
        'Программируемые циклы, периоды и температуры',
        'Автоматический расчет преднапряжения шаговыми двигателями',
        'Автоматизированное измерение и регулирование расхода',
      ],
      standards: ['ISO 19893', 'ISO 10508', 'DVGW W 534', 'DVGW W 542', 'DVGW W 543'],
      specs: [
        {
          label: 'Диапазон давления',
          value: '3–10 бар',
        },
        {
          label: 'Емкость контуров',
          value: 'До 63 мм',
        },
        {
          label: 'Расход',
          value: 'Макс. 1.0 л/сек',
        },
        {
          label: 'Макс. объем образца',
          value: '12 л',
        },
        {
          label: 'Диапазон горячей воды',
          value: '50–95 °C',
        },
        {
          label: 'Диапазон холодной воды',
          value: '15–30 °C',
        },
        {
          label: 'Количество циклов',
          value: 'Макс. 99,999 за тест',
        },
        {
          label: 'Напряжение',
          value: '230/400 В, 50 Гц; прибл. 25 кВт',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050287/polinar/static/test-equipment/thermal-cycling-test-unit-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050288/polinar/static/test-equipment/thermal-cycling-test-unit-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050289/polinar/static/test-equipment/thermal-cycling-test-unit.pdf',
    },
    {
      id: 'mfi-mfr',
      name: 'Прибор для определения ПТР (MFI / MFR)',
      shortDescription: 'Определяет показатель текучести расплава (ПТР) с самооптимизирующимся контролем температуры.',
      description: 'Объединяет определение массового (MFI) и объемного (MFR) показателя текучести расплава термопластов при заданных условиях. Высокая точность достигается благодаря интеллектуальной системе контроля.',
      features: [
        'Ввод данных через сенсорный дисплей',
        'Высокая точность температуры через самооптимизацию',
        'Электронно-управляемое отрезное устройство',
        'Таймер нагрева для минимизации энергопотребления',
        'Максимальная стабильность температуры',
        'Долгий срок службы благодаря термостойким материалам',
      ],
      standards: ['ISO 1133', 'ASTM D 1238'],
      specs: [
        {
          label: 'Температура испытания',
          value: '50–300 °C (шаг 0.1 K)',
        },
        {
          label: 'Точность регулирования',
          value: '±0.1 K на сопле',
        },
        {
          label: 'Грузы в комплекте',
          value: '2.160, 3.800, 5.000 кг',
        },
        {
          label: 'Опциональные грузы',
          value: '0.325, 1.200, 10.000, 11.600 кг',
        },
        {
          label: 'Размеры (Ш×Г×В)',
          value: '420 × 420 × 700 мм',
        },
        {
          label: 'Вес',
          value: '40 кг (без дисков)',
        },
        {
          label: 'Напряжение',
          value: '230 В, 50/60 Гц',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050274/polinar/static/test-equipment/mfi-mfr-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050276/polinar/static/test-equipment/mfi-mfr-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050277/polinar/static/test-equipment/mfi-mfr.pdf',
    },
    {
      id: 'carbon-black',
      name: 'Анализатор содержания сажи',
      shortDescription: 'Определяет содержание сажи в полиолефинах методом пиролитического разложения в потоке азота.',
      description: 'Стандарты предписывают проверку содержания сажи в пластмассах. Метод основан на пиролизе материала в инертном газе с последующим сжиганием остатка и расчетом разницы веса.',
      features: [
        'Простая и безопасная эксплуатация',
        'Компактная сборка всей структуры',
        'Защита от перегрева, встроенная в трубчатую печь',
        'Точный цифровой контроллер температуры',
        'Высококачественные компоненты для долгой службы',
        'Надежные и повторяемые результаты',
      ],
      standards: ['ISO 6964', 'ASTM D 1603'],
      specs: [
        {
          label: 'Температура печи',
          value: '0–1000 °C',
        },
        {
          label: 'Точность (до 200 °C)',
          value: '0.1 K',
        },
        {
          label: 'Точность (выше 200 °C)',
          value: '1 K',
        },
        {
          label: 'Расходомер',
          value: '5–95 Нл/ч или 1–13 Нл/ч',
        },
        {
          label: 'Мощность',
          value: '1 кВт',
        },
        {
          label: 'Размеры (Ш×Г×В)',
          value: '760 × 650 × 1020 мм',
        },
        {
          label: 'Вес',
          value: 'Прибл. 60 кг',
        },
        {
          label: 'Напряжение',
          value: '1 фаза 230 В, 50/60 Гц',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050258/polinar/static/test-equipment/carbon-black-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050260/polinar/static/test-equipment/carbon-black-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050260/polinar/static/test-equipment/carbon-black.pdf',
    },
    {
      id: 'cnc-milling',
      name: 'Фрезерный станок с ЧПУ для образцов',
      shortDescription: 'Настольный станок для изготовления до 5 стандартных образцов (лопаток) за один цикл.',
      description: 'Позволяет изготавливать образцы пластмасс для тестов на растяжение, сжатие и изгиб по различным стандартам. Предустановленные программы и сенсорный экран делают управление максимально простым.',
      features: [
        'Предустановленные программы по стандартам',
        'Защитные двери с блокировкой',
        'Чистая рабочая зона с системой удаления стружки',
        'ЧПУ-позиционирование по всем осям',
        'Охлаждение зоны обработки сжатым воздухом',
        'До 5 образцов за один процесс фрезерования',
      ],
      standards: [
        'ISO 179/180',
        'ISO 527',
        'ISO 6259',
        'ISO 16770',
        'ASTM D 638',
        'ASTM D 1822',
      ],
      specs: [
        {
          label: 'Диапазон зажима (малый)',
          value: 'Макс. толщина 30 мм, длина 220 мм',
        },
        {
          label: 'Диапазон зажима (большой)',
          value: 'Макс. толщина 90 мм, длина 250 мм',
        },
        {
          label: 'Образцов за процесс',
          value: 'Макс. 2/5',
        },
        {
          label: 'Скорость шпинделя',
          value: '3,000–18,000 об/мин',
        },
        {
          label: 'Размеры (Ш×Г×В)',
          value: '900 × 900 × 1700 мм',
        },
        {
          label: 'Вес',
          value: '450 кг',
        },
        {
          label: 'Напряжение',
          value: '3 фазы 380/400 В перем. тока 230 В, 50 Гц',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050262/polinar/static/test-equipment/cnc-milling-machine-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050263/polinar/static/test-equipment/cnc-milling-machine-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050264/polinar/static/test-equipment/cnc-milling-machine.pdf',
    },
    {
      id: 'end-closures',
      name: 'Заглушки для испытаний труб',
      shortDescription: 'Заглушки из нержавеющей стали для гидростатических испытаний труб ПЭ, ПП и ПВХ до DN 630.',
      description: 'Используются для герметизации труб при испытаниях на ползучесть. Проверенная конструкция для быстрой сборки, надежного удаления воздуха и долгого срока службы.',
      features: [
        'Быстрая сборка и надежная конструкция',
        'Простое удаление воздуха непосредственно на образце',
        'Подходят для труб ПЭ, ПП и ПВХ',
        'Конструкция из нержавеющей стали (AISI 304)',
        'Кольцевая гайка для подвешивания в комплекте',
        'Быстроразъемное соединение для давления',
      ],
      standards: ['ISO 1167', 'ASTM D 1598', 'ASTM D 1599'],
      specs: [
        {
          label: 'Диапазоны диаметров труб',
          value: 'DN 20–40 / 50–90 / 110–315 / 350–630',
        },
        {
          label: 'Макс. испытательное давление',
          value: '60 бар (40 бар для DN 350–630)',
        },
        {
          label: 'Материал',
          value: 'Нержавеющая сталь AISI 304 / S30300',
        },
        {
          label: 'Типы труб',
          value: 'PE, PP, PVC',
        },
        {
          label: 'Подключение давления',
          value: 'Быстроразъемный штекер',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050265/polinar/static/test-equipment/end-closures-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050266/polinar/static/test-equipment/end-closures-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050267/polinar/static/test-equipment/end-closures.pdf',
    },
    {
      id: 'ball-valves-test',
      name: 'Стенды для испытания шаровых кранов',
      shortDescription: 'ПЛК-управляемый стенд с пневматическим приводом, сенсорным экраном и 5 станциями.',
      description: 'Предназначен для тестирования пластиковых шаровых кранов. Весь цикл управляется ПЛК, параметры задаются через сенсорный экран. Включает аудиовизуальную систему предупреждения.',
      features: [
        '5 активных станций одновременно (Ø20–63 мм)',
        '2 активные станции одновременно (Ø75–90 мм)',
        'Пневматическое закрытие головок',
        'Точность давления ±0.2 бар (0.5–6 бар)',
        'Полное управление ПЛК с сенсорным интерфейсом',
        'Опциональные системы PoliREPORT и PoliLOGGER',
      ],
      standards: ['DIN EN ISO 15874', 'EN 1329'],
      specs: [
        {
          label: 'Рабочий диапазон',
          value: '20–63 мм / 20–40 мм',
        },
        {
          label: 'Давление теста',
          value: '0.5–6.0 бар',
        },
        {
          label: 'Точность теста',
          value: '±0.2 бар',
        },
        {
          label: 'Управление',
          value: 'ПЛК с сенсорным экраном',
        },
        {
          label: 'Размеры (Ш×Г×В)',
          value: '1250 × 600 × 2000 мм',
        },
        {
          label: 'Напряжение',
          value: '220/380 В, 50/60 Гц',
        },
      ],
      image01: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050255/polinar/static/test-equipment/ball-valves-test-units-01.jpg',
      image02: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050256/polinar/static/test-equipment/ball-valves-test-units-02.jpg',
      pdfUrl: 'https://res.cloudinary.com/dtdogh9wg/raw/upload/v1775050257/polinar/static/test-equipment/ball-valves-test-units.pdf',
    },
  ],
  coreCapabilities: [
    {
      title: 'Прецизионное тестирование',
      description: 'Системы с микропроцессорным управлением и высокоточными датчиками для стабильных результатов по мировым стандартам.',
    },
    {
      title: 'Соответствие стандартам',
      description: 'Оборудование разработано в соответствии с ISO, ASTM, DIN и DVGW для тестирования труб по всему миру.',
    },
    {
      title: 'Индивидуальные решения',
      description: 'Адаптация конфигураций испытательного оборудования под ваши конкретные задачи и протоколы.',
    },
    {
      title: 'Послепродажная поддержка',
      description: 'Комплексные программы обслуживания, удаленная диагностика, запчасти и техническая поддержка на месте.',
    },
  ],
  highlights: [
    {
      value: '25+',
      label: 'Лет опыта',
    },
    {
      value: '50+',
      label: 'Стран экспорта',
    },
    {
      value: '12',
      label: 'Линеек продуктов',
    },
    {
      value: 'ISO',
      label: 'Сертифицировано ISO',
    },
  ],
  ui: {
    heroEyebrow: 'Оборудование для испытания пластика',
    heroTitle: 'Оборудование для испытаний пластика',
    heroSubtitle: 'Прецизионные решения для индустрии пластиковых труб и фитингов',
    introTitle: 'Надежное тестирование для контроля качества',
    introDescription: 'Polinar Test Equipment (PTE) производит широкий спектр машин для испытания труб и фитингов. Наше оборудование соответствует международным стандартам ISO, ASTM, DIN и DVGW, обеспечивая точность для производителей по всему миру.',
    productRangeEyebrow: 'Наш ассортимент',
    productRangeTitle: 'Категории испытательного оборудования',
    whyPolinarEyebrow: 'Почему Polinar',
    whyPolinarTitle: 'Ключевые возможности',
    whyPolinarDescription: 'Каждая единица оборудования Polinar создана для получения точных и повторяемых результатов, соответствующих высшим мировым стандартам.',
    ctaTitle: 'Нужно индивидуальное решение для тестов?',
    ctaSubtitle: 'Свяжитесь с нашей инженерной группой для подбора конфигурации.',
    contactUs: 'Связаться с нами',
    breadcrumbCurrent: 'Оборудование для испытаний',
  },
}

export default ru
