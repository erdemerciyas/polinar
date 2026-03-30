# Polinar Web Sitesi Tasarım Kılavuzu (UI/UX & Brand Guidelines)

Bu doküman, Polinar'ın dijital varlıklarında (özellikle web sitesi) tutarlı, profesyonel ve kurumsal bir kimlik sürdürmek amacıyla hazırlanmıştır. 

---

## 1. Marka Özü ve Karakteri
Polinar'ın marka karakteri sanayi, üretim ve kalıp sektöründeki lider konumunu yansıtır.
*   **Ton / Ses:** Profesyonel, Güvenilir, Global, Net ve Çözüm Odaklı.
*   **Anahtar Kelimeler:** Quality (Kalite), Robust (Sağlam), Durable (Dayanıklı), Reliable (Güvenilir).
*   **Görsel Dil Katmanları:** Temiz beyaz ve gri alanlar, endüstriyel koyu lacivert zeminler, dikkat çekici ve dinamik kırmızı vurgular.

---

## 2. Logo Kullanımı

*   **Ana Logo:** Üzerinde (R) tescil işareti bulunan, O harfi içinde şemsiye/sekizgen form barındıran Polinar Kırmızısı tipografik logo.
*   **Beyaz/Negatif Logo:** Koyu arka planlarda (özellikle koyu lacivert footer alanında) kullanılmak üzere tamamen beyaz (monokrom) logo kullanımı.
*   **Koruma Alanı (Clear Space):** Logonun etrafında "O" harfinin yüksekliği kadar boşluk bırakılmalı, başka bir grafik veya metin bu alana girmemelidir.
*   **Minimum Boyut:** Ekran okunabilirliğini kaybetmemek adına dijitalde en az 120px genişliğinde kullanılmalıdır.

---

## 3. Renk Paleti

Markanın güçlü duruşunu teknolojik bir çizgiyle birleştiren 3 ana ve 2 yardımcı renk belirlenmiştir.

### Ana Kurumsal Renkler
1.  **Polinar Kırmızısı (Primary Action Red)**
    *   **Kullanım:** Logoda, ana aksiyon butonlarında ("Subscribe", "Contact"), aktif menü öğelerinde ve başlık altı ayırıcı çizgilerde vurgu rengi olarak.
    *   **HEX:** `#E30613` (Görsel bazlı referans)
2.  **Endüstriyel Lacivert (Dark Navy/Midnight Blue)**
    *   **Kullanım:** Footer (alt bilgi) zemininde, hero/banner alt kısımlarındaki makine/üretim desenli arka planlarda, ana metin kısımlarındaki ana başlıklarda ağırlık oluşturmak için.
    *   **HEX:** `#080C16` veya `#0A1128`
3.  **Temiz Beyaz (Pure White)**
    *   **Kullanım:** Ana içerik alanlarının arka planı.
    *   **HEX:** `#FFFFFF`

### İkincil / Vurgu Renkler (UI Renkleri)
1.  **İletişim Mavisi (Cyan / Light Blue)**
    *   **Kullanım:** Products ve Service sayfalarındaki "Contact Our Team" iletişim kutusu ve Whatsapp ikonları gibi destekleyici aksiyonlarda çağdaş bir kontrast yaratmak için.
    *   **HEX:** `#00B4D8`
2.  **Açık Gri (Light Gray)**
    *   **Kullanım:** Tablolar, ikincil butonlar, kart çerçeveleri (border) veya arka planı ayırmak için.
    *   **HEX:** `#F5F6F8`

### Kategori Renk Sistemi (Faaliyetlerimiz / Our Business)

Her faaliyet alanı, 2025 katalog broşürlerindeki tasarım kimliğine dayalı olarak kendi vurgu rengini kullanır. Bu renkler hero banner, highlight kartlar, divider'lar, butonlar, ikonlar ve CTA bar gibi sayfa elementlerinde uygulanır.

1.  **Injection Moulds (Durable Moulds) — Altın/Gold**
    *   **Referans:** 2025 katalog broşürlerindeki altın tonlu footer, kenar çizgileri ve vurgu elementleri.
    *   **HEX (Primary):** `#B8860B` (moulds-gold)
    *   **HEX (Dark/Hover):** `#8B6914` (moulds-gold-dark)
    *   **Kullanım:** Injection Moulds sayfasındaki tüm vurgu renkleri (breadcrumb, başlık, divider, ikon, buton, CTA bar).

2.  **Machinery (Customized Products) — Polinar Kırmızısı**
    *   **Referans:** Broşürlerde Polinar'ın ana kurumsal kırmızı rengi kullanılır.
    *   **HEX (Primary):** `#E30613` (polinar-red) — ana kurumsal renkle aynı.
    *   **HEX (Dark/Hover):** `#B8050F` (polinar-red-dark)
    *   **Kullanım:** Machinery sayfasındaki tüm vurgu renkleri, genel site renk sistemiyle uyumlu.

3.  **Plastic Test Equipment (PTE) — Cyan/Açık Mavi**
    *   **Referans:** PTE markası ve tüm test ekipmanı broşürlerindeki belirgin açık mavi/cyan renk kimliği.
    *   **HEX (Primary):** `#00B4D8` (pte-cyan)
    *   **HEX (Dark/Hover):** `#0096B7` (pte-cyan-dark)
    *   **Kullanım:** Plastic Test Equipment sayfasındaki tüm vurgu renkleri (breadcrumb, başlık, divider, ikon, buton, CTA bar).

**Tailwind Token'ları:** `moulds-gold`, `moulds-gold-dark`, `pte-cyan`, `pte-cyan-dark`
**CSS Class'ları:** `.div-gold`, `.div-cyan`, `.btn-primary-gold`, `.btn-primary-cyan`, `.mould-category-card-gold`, `.mould-category-card-cyan`

---

## 4. Tipografi (Yazı Tipleri)

Geometrik, okunaklı ve modern "Sans Serif" font ailesi kullanılmalıdır. Web uyumlu (Google Fonts) alternatifler ile standart sağlanmalıdır.

*   **Ana Başlıklar (H1, H2, H3):** *Montserrat* veya *Oswald*
    *   **Karakteristik:** Kalın (Bold/ExtraBold), endüstriyel algısı yüksek, logo yapısına uygun karakterler. 
    *   **Kullanım:** Sadece başlıklar. Genellikle Koyu Lacivert veya Siyah tonlarında (`#222222`).
*   **Gövde Metni ve Paragraflar (Body Text):** *Open Sans* veya *Inter*
    *   **Karakteristik:** Okunabilirliği yüksek, temiz, nötr.
    *   **Boyut (Gövde):** Masaüstü 16px, Mobil 14px. Satır arası (Line-height) 1.6 olarak ayarlanmalıdır.

---

## 5. İkonografi ve Görsel Dünyası

*   **Fotoğraflar:** İncelediğimiz görsellerdeki gibi parlak, yüksek çözünürlüklü makine, üretim hattı ve tesis fotoğrafları tercih edilmelidir. Fotoğrafların üzerinde koyu mavi filtreler/overlay'ler kullanılarak üstüne beyaz makine parçası vektörleri (örneğin footer üstündeki overlay çalışması) konumlandırılabilir.
*   **İkonlar:** Flat (düz) ve çok renkli (material) değil, ince çizgisel (outline) veya tam kapalı (solid) ikonlar. İkon renkleri İletişim Mavisi veya Polinar Kırmızısı olmalıdır (örn. Whatsapp butonu yeşil, iletişim mail/tel ikonları mavi veya beyaz gibi amaca göre ayrıştırılmış).

---

## 6. Web UI (Arayüz) Bileşenleri

*   **Header & Navigasyon:** Çok sade. Logoya solda ağırlık verilir, ortada siyah (#222) linkler, *Hover (üzerine gelince)* ve *Active* durumdaki sayfanın linki Polinar Kırmızısı olur. En sağda dil seçenekleri (EN, TR, RU vs.) sade harflerle konumlandırılır.
*   **Butonlar:** 
    *   *Primary Button (Örn: Subscribe):* Arka plan kırmızı, yazı beyaz. Keskin köşeli veya çok hafif yuvarlatılmış (border-radius: 2px - 4px) olmalı, çok yuvarlak olmamalıdır.
    *   *Kart Seçimleri:* Kenarlığı kırmızı hatlı (border), içi beyaz olan seçim kartları.
*   **Ayırıcı Çizgiler (Dividers):** Başlıkların altında veya "About US" bölümünde olduğu gibi asimetrik iki bölümden oluşan çizgiler (sol yarışı turuncu/kırmızı, sağ tarafı gri olan stilize icon/ayraçlar) marka imzası olarak sayfalarda tekrar kullanılmalıdır.
*   **Ürün Çerçeveleri:** Ürün fotoğraflarının çevresinde koyu kırmızı tonlarında ince (<1px) bir çerçeve (border) ve hover edildiğinde belirginleşen ince bir gölge (box-shadow) kullanılmalıdır.
