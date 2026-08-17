/**
 * Stable shell translations for navigation and homepage globals.
 *
 * Payload export often writes English fallback text into de/ar/ru JSON files.
 * These overlays survive i18n:export and keep shared UI locale-correct.
 */
export const SHELL_TRANSLATIONS: Record<string, Record<string, unknown>> = {
  de: {
    navigation: {
      mainMenu: [
        { label: 'STARTSEITE' },
        { label: 'ÜBER UNS' },
        {
          label: 'UNSERE GESCHÄFTE',
          megaMenuColumns: [
            {
              links: [
                {
                  label: 'Spritzgussformen',
                  description:
                    'Hochwertige Spritzgussformen für PPR-C, HDPE, PVC und andere Rohrsysteme.',
                },
                {
                  label: 'Maschinen',
                  description:
                    'Präzisionsfertigung mit modernen CNC- und EDM-Maschinen.',
                },
                {
                  label: 'Kunststoffprüfgeräte',
                  description: 'Qualitätskontrolle und Materialprüfung.',
                },
              ],
            },
          ],
        },
        { label: 'NACHRICHTEN' },
        { label: 'KONTAKT' },
      ],
      megaMenuCTA: {
        title: 'Kontakt aufnehmen',
        description:
          'Wir bieten maßgeschneiderte Lösungen für Ihre Projekte. Kontaktieren Sie uns noch heute.',
        button: 'Kontaktieren Sie uns',
      },
    },
    'homepage-settings': {
      aboutPreviewLabels: {
        label: 'Über uns',
        title: 'WIR',
        description:
          'POLINAR ist eines der dynamischsten und führenden Unternehmen im Bereich der Herstellung von Kunststoff-Spritzgussformen für Rohrverschraubungen.',
      },
      businessSection: {
        sectionLabel: 'Unser Geschäft',
        sectionTitle: 'Was wir tun',
      },
      coreValues: {
        title: 'Qualität / Robust / Langlebig / Zuverlässig',
        description:
          'POLINAR ist eines der dynamischsten und führenden Unternehmen im Bereich der Herstellung von Kunststoff-Spritzgussformen für Rohrverschraubungen.',
      },
      heroSlides: [
        {
          title: 'Hochwertige Kunststoff-Spritzgussformen',
          subtitle:
            'Seit 2000 stellt Polinar hochwertige Kunststoff-Spritzgussformen für die globale Rohr- und Fittingsindustrie her.',
        },
        {
          title: 'Präzisionsmaschinen & individuelle Lösungen',
          subtitle:
            'Polinar entwirft und fertigt maßgeschneiderte Maschinen für die Kunststoffrohr- und Fittingsindustrie.',
        },
        {
          title: 'Zuverlässige Prüfungen für Qualitätssicherung',
          subtitle:
            'Polynar Test Equipment (PTE) bietet ein breites Spektrum an Prüfgeräten für die Kunststoffrohr- und Fittingsindustrie.',
        },
      ],
      newsSection: {
        empty: 'Neuigkeiten folgen in Kürze',
        label: 'Aktuelle Nachrichten',
        title: 'Messekalender',
      },
    },
  },
  ar: {
    navigation: {
      mainMenu: [
        { label: 'الرئيسية' },
        { label: 'من نحن' },
        {
          label: 'أعمالنا',
          megaMenuColumns: [
            {
              links: [
                {
                  label: 'قوالب الحقن',
                  description:
                    'قوالب حقن عالية الجودة لأنظمة PPR-C وHDPE وPVC وغيرها من أنظمة الأنابيب.',
                },
                {
                  label: 'الآلات',
                  description: 'قدرة تصنيع دقيقة باستخدام آلات CNC وEDM الحديثة.',
                },
                {
                  label: 'معدات اختبار البلاستيك',
                  description: 'خدمات مراقبة الجودة واختبار المواد.',
                },
              ],
            },
          ],
        },
        { label: 'الأخبار' },
        { label: 'اتصل بنا' },
      ],
      megaMenuCTA: {
        title: 'تواصل معنا',
        description: 'نقدم حلولاً مخصصة لمشاريعكم. تواصلوا معنا اليوم.',
        button: 'اتصل بنا',
      },
    },
    'homepage-settings': {
      aboutPreviewLabels: {
        label: 'من نحن',
        title: 'نحن',
        description:
          'بولينار هي واحدة من الشركات الديناميكية والرائدة في مجال تصنيع قوالب حقن البلاستيك لوصلات الأنابيب.',
      },
      businessSection: {
        sectionLabel: 'أعمالنا',
        sectionTitle: 'ماذا نفعل',
      },
      coreValues: {
        title: 'الجودة / المتانة / الموثوقية / الاعتمادية',
        description:
          'بولينار هي واحدة من الشركات الديناميكية والرائدة في مجال تصنيع قوالب حقن البلاستيك لوصلات الأنابيب.',
      },
      heroSlides: [
        {
          title: 'قوالب حقن بلاستيك عالية الجودة',
          subtitle:
            'منذ عام 2000، تصنع بولينار قوالب حقن بلاستيك عالية الجودة لصناعة الأنابيب والتجهيزات العالمية.',
        },
        {
          title: 'آلات دقيقة وحلول مخصصة',
          subtitle:
            'تصمم بولينار وتصنع آلات مخصصة لصناعة الأنابيب البلاستيكية والتجهيزات.',
        },
        {
          title: 'اختبارات موثوقة لضمان الجودة',
          subtitle:
            'توفر بولينار لمعدات الاختبار (PTE) مجموعة واسعة من أجهزة الاختبار لصناعة الأنابيب البلاستيكية.',
        },
      ],
      newsSection: {
        empty: 'الأخبار قادمة قريباً',
        label: 'آخر الأخبار',
        title: 'جدول المعارض',
      },
    },
  },
  ru: {
    navigation: {
      mainMenu: [
        { label: 'ГЛАВНАЯ' },
        { label: 'О НАС' },
        {
          label: 'НАШ БИЗНЕС',
          megaMenuColumns: [
            {
              links: [
                {
                  label: 'Пресс-формы',
                  description:
                    'Высококачественные пресс-формы для систем PPR-C, HDPE, PVC и других трубопроводных систем.',
                },
                {
                  label: 'Оборудование',
                  description:
                    'Точное производство на современных станках с ЧПУ и EDM.',
                },
                {
                  label: 'Оборудование для испытаний пластмасс',
                  description: 'Контроль качества и испытание материалов.',
                },
              ],
            },
          ],
        },
        { label: 'НОВОСТИ' },
        { label: 'КОНТАКТ' },
      ],
      megaMenuCTA: {
        title: 'Связаться с нами',
        description:
          'Мы предлагаем индивидуальные решения для ваших проектов. Свяжитесь с нами сегодня.',
        button: 'Связаться с нами',
      },
    },
    'homepage-settings': {
      aboutPreviewLabels: {
        label: 'О компании',
        title: 'МЫ',
        description:
          'POLINAR — одна из динамичных и ведущих компаний в области производства пресс-форм для пластиковых трубных фитингов.',
      },
      businessSection: {
        sectionLabel: 'Наш бизнес',
        sectionTitle: 'Чем мы занимаемся',
      },
      coreValues: {
        title: 'Качество / Надёжность / Долговечность / Стабильность',
        description:
          'POLINAR — одна из динамичных и ведущих компаний в области производства пресс-форм для пластиковых трубных фитингов.',
      },
      heroSlides: [
        {
          title: 'Высококачественные пресс-формы для литья пластмасс',
          subtitle:
            'С 2000 года Polinar производит высококачественные пресс-формы для мировой трубопроводной отрасли.',
        },
        {
          title: 'Точное оборудование и индивидуальные решения',
          subtitle:
            'Polinar проектирует и производит специализированное оборудование для трубопроводной отрасли.',
        },
        {
          title: 'Надёжные испытания для обеспечения качества',
          subtitle:
            'Polynar Test Equipment (PTE) предлагает широкий спектр испытательного оборудования для трубопроводной отрасли.',
        },
      ],
      newsSection: {
        empty: 'Новости скоро появятся',
        label: 'Последние новости',
        title: 'Календарь выставок',
      },
    },
  },
}
