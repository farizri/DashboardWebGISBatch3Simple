export interface QuizQuestion {
  id: number;
  question: string;
  image?: string; // optional image URL
  options: string[];
  correctAnswer: number; // index 0 to 3
  explanation: string;
}

export const BOOTCAMP_QUIZZES: Record<number, QuizQuestion[]> = {
  1: [
    {
      id: 1,
      question: "Apa definisi yang paling tepat mengenai WebGIS?",
      options: [
        "Aplikasi pengolah kata berbasis cloud yang mampu menampilkan tabel koordinat.",
        "Sistem Informasi Geografis yang diintegrasikan ke dalam arsitektur web untuk memvisualisasikan dan menganalisis data spasial secara online.",
        "Format file gambar khusus yang digunakan untuk menyimpan peta satelit resolusi tinggi.",
        "Database relasional lokal yang tidak terhubung ke jaringan internet."
      ],
      correctAnswer: 1,
      explanation: "WebGIS mengombinasikan kekuatan analisis GIS tradisional dengan kemudahan akses dan jangkauan distribusi platform web secara real-time."
    },
    {
      id: 2,
      question: "Perhatikan diagram arsitektur berikut. Bagian manakah yang bertugas untuk merender antarmuka peta dan menerima interaksi pengguna?",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Client-server-model.svg/1200px-Client-server-model.svg.png",
      options: [
        "Database Server (seperti PostgreSQL)",
        "Backend API Server (seperti Node.js)",
        "Client/Frontend (Browser dengan library MapLibre)",
        "Cloud Storage (seperti AWS S3)"
      ],
      correctAnswer: 2,
      explanation: "Client/Frontend adalah sisi browser tempat pengguna berinteraksi langsung dengan peta spasial menggunakan JavaScript."
    },
    {
      id: 3,
      question: "Apa keunggulan utama arsitektur Dynamic WebGIS dibandingkan Static WebGIS?",
      options: [
        "Dynamic WebGIS tidak membutuhkan koneksi internet sama sekali.",
        "Dynamic WebGIS mampu merespon input pengguna, melakukan query database spasial, dan memperbarui layer secara langsung tanpa memuat ulang seluruh halaman.",
        "Dynamic WebGIS hanya menampilkan file gambar raster JPEG biasa yang aman.",
        "Dynamic WebGIS memiliki performa lebih lambat karena semua aset diunduh di awal."
      ],
      correctAnswer: 1,
      explanation: "Dynamic WebGIS memungkinkan interaksi dua arah, query spasial real-time, dan pembaruan visual instan di browser."
    },
    {
      id: 4,
      question: "Manakah tool bawaan browser yang sangat krusial untuk melakukan debugging error kode Javascript atau memantau network request di WebGIS?",
      options: [
        "Windows Explorer",
        "Developer Console (F12)",
        "Task Manager",
        "Registry Editor"
      ],
      correctAnswer: 1,
      explanation: "Developer Tools (F12) menyediakan tab Console untuk melacak log error JS dan tab Network untuk memantau request load ubin peta/API."
    },
    {
      id: 5,
      question: "Perhatikan gambar icon lock (🔒) di address bar browser berikut. Protokol standar apa yang sedang digunakan oleh client untuk berkomunikasi dengan server WebGIS secara aman?",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/HTTPS_icon.svg/800px-HTTPS_icon.svg.png",
      options: ["FTP", "SMTP", "HTTP / HTTPS", "SSH"],
      correctAnswer: 2,
      explanation: "Protokol HTTP/HTTPS digunakan untuk mengirimkan parameter query spasial dan menerima data spasial (seperti GeoJSON) dari server."
    },
    {
      id: 6,
      question: "Siapa target pengguna akhir (end-user) yang ideal untuk platform WebGIS interaktif?",
      options: [
        "Hanya developer web yang menulis baris kode.",
        "Hanya administrator database di server lokal.",
        "Siapa saja (masyarakat, pengambil keputusan, atau tim lapangan) yang membutuhkan insight spasial tanpa perlu menginstal software desktop GIS rumit.",
        "Komputer server otomatis yang memproses batch data."
      ],
      correctAnswer: 2,
      explanation: "WebGIS mendemokratisasi data spasial sehingga dapat diakses oleh publik luas cukup melalui browser di perangkat apa pun."
    },
    {
      id: 7,
      question: "Apa peran utama WebGIS dalam menunjang pengambilan keputusan bisnis di industri real estate?",
      options: [
        "Menghitung gaji karyawan di kantor pusat.",
        "Menganalisis lokasi potensial berdasarkan radius jangkauan pasar, densitas pesaing, dan demografi secara spasial.",
        "Membuat desain 3D bangunan secara arsitektural mendalam.",
        "Menyediakan jaringan internet berkecepatan tinggi di perumahan."
      ],
      correctAnswer: 1,
      explanation: "Analisis spasial lokasi (Location Intelligence) membantu pelaku bisnis real estate mengukur kecocokan lokasi komersial secara ilmiah."
    },
    {
      id: 8,
      question: "Logo library manakah yang ditampilkan pada gambar berikut, yang merupakan library JavaScript open-source populer untuk menampilkan peta interaktif di browser?",
      image: "https://maplibre.org/img/maplibre-logo-big.svg",
      options: ["Django", "MapLibre GL JS", "PostgreSQL", "Pandas"],
      correctAnswer: 1,
      explanation: "MapLibre GL JS adalah library JavaScript client-side yang memanfaatkan WebGL untuk merender peta spasial berbasis vektor secara dinamis."
    },
    {
      id: 9,
      question: "Apa tantangan terbesar dalam memvisualisasikan jutaan data titik spasial di browser client?",
      options: [
        "Keterbatasan bandwidth kabel fiber optik internasional.",
        "Kapasitas memori dan rendering kartu grafis client (browser overload/crash jika merender terlalu banyak DOM element).",
        "Format data GeoJSON tidak didukung oleh browser modern.",
        "Ukuran layar monitor client terlalu sempit."
      ],
      correctAnswer: 1,
      explanation: "Merender ribuan/jutaan titik sebagai elemen HTML individual akan membebani DOM browser. Solusinya adalah teknik WebGL rendering atau clustering."
    },
    {
      id: 10,
      question: "Mengapa pemahaman dasar pemrograman web (HTML, CSS, JS) penting bagi seorang praktisi WebGIS?",
      options: [
        "Agar bisa menggantikan peran tim tim IT networking server utama.",
        "Untuk dapat merancang, memodifikasi interaksi peta, menyesuaikan UI dashboard, serta mengintegrasikan data spasial sesuai use-case industri nyata.",
        "Agar bisa merakit komputer server GIS fisik secara mandiri.",
        "Karena browser tidak bisa membaca data spasial jika ditulis dengan bahasa Python."
      ],
      correctAnswer: 1,
      explanation: "HTML/CSS/JS adalah fondasi utama pengembangan web. Tanpa ketiganya, peta WebGIS tidak bisa memiliki antarmuka interaktif yang fungsional."
    }
  ],
  2: [
    {
      id: 1,
      question: "Apa perbedaan mendasar antara data spasial Vektor dan Raster?",
      options: [
        "Vektor menyimpan data dalam bentuk tabel teks, sedangkan Raster menyimpan data dalam bentuk suara spasial.",
        "Vektor merepresentasikan dunia nyata menggunakan titik, garis, dan poligon geometris; sedangkan Raster menggunakan kisi-kisi piksel (grid) bernilai.",
        "Raster selalu memiliki akurasi koordinat yang jauh lebih tinggi daripada Vektor di setiap skala.",
        "Vektor hanya bisa digunakan untuk menyimpan citra satelit berwarna."
      ],
      correctAnswer: 1,
      explanation: "Data vektor mendefinisikan objek spasial dengan titik koordinat diskret (x, y), sedangkan raster terdiri dari matriks sel piksel berkelanjutan."
    },
    {
      id: 2,
      question: "Sistem koordinat manakah yang merepresentasikan posisi di bumi dalam satuan derajat busur/geografis (Bujur/Lintang)?",
      options: [
        "UTM Zone 49N",
        "WGS 84 (EPSG:4326)",
        "Web Mercator (EPSG:3857)",
        "State Plane Coordinate System"
      ],
      correctAnswer: 1,
      explanation: "EPSG:4326 (WGS 84) adalah sistem koordinat geografis (GCS) unprojected berwujud bola ellipsoid yang diukur dalam satuan derajat decimal."
    },
    {
      id: 3,
      question: "Sistem koordinat terproyeksi manakah yang paling dominan digunakan dalam rendering peta web dinamis (seperti Google Maps, Mapbox, dan MapLibre)?",
      options: [
        "WGS 84 Geografis (EPSG:4326)",
        "Web Mercator (EPSG:3857)",
        "UTM Zone 48S",
        "DMS (Degrees Minutes Seconds)"
      ],
      correctAnswer: 1,
      explanation: "EPSG:3857 (Web Mercator) memproyeksikan bumi menjadi bidang datar persegi dalam satuan meter untuk mempermudah perhitungan ubin peta (tiles) secara cepat."
    },
    {
      id: 4,
      question: "Format file teks spasial berbasis JSON yang menjadi standar utama pertukaran data vektor di WebGIS adalah...",
      options: ["Shapefile (SHP)", "GeoJSON", "Keyhole Markup Language (KML)", "GPX"],
      correctAnswer: 1,
      explanation: "GeoJSON sangat disukai developer web karena formatnya yang human-readable, berbasis standar JSON, dan langsung dapat di-parse sebagai objek JavaScript asli."
    },
    {
      id: 5,
      question: "Manakah struktur objek GeoJSON yang valid di bawah ini untuk tipe geometri Titik (Point)?",
      options: [
        `{ "type": "Point", "coords": [106.8, -6.2] }`,
        `{ "type": "Point", "coordinates": [106.8, -6.2] }`,
        `{ "geometry": "Point", "coordinates": [-6.2, 106.8] }`,
        `{ "type": "Feature", "geometry": "point", "coords": [-6.2, 106.8] }`
      ],
      correctAnswer: 1,
      explanation: "Sesuai spesifikasi RFC 7946, objek geometri GeoJSON berjenis Point wajib memiliki properti 'type' bernilai 'Point' (case-sensitive) dan 'coordinates' berupa array `[longitude, latitude]`."
    },
    {
      id: 6,
      question: "Dalam standar koordinat GeoJSON `[X, Y]`, nilai manakah yang diletakkan pada posisi indeks ke-0?",
      options: [
        "Latitude (Lintang)",
        "Longitude (Bujur)",
        "Ketinggian (Elevation)",
        "Kode EPSG"
      ],
      correctAnswer: 1,
      explanation: "GeoJSON menggunakan urutan koordinat `[Bujur (X/Eastings), Lintang (Y/Northings)]`, berbeda dari penyebutan lisan umum yang mendahulukan Latitude."
    },
    {
      id: 7,
      question: "Apa kelemahan utama format ESRI Shapefile jika langsung digunakan dalam aplikasi web modern?",
      options: [
        "Shapefile tidak dapat menyimpan data atribut tabel.",
        "Shapefile adalah format biner multi-file (membutuhkan file .shp, .shx, .dbf) yang tidak efisien dimuat langsung secara asinkronus oleh browser.",
        "Shapefile hanya bisa dibuka di software berlisensi mahal.",
        "Shapefile tidak mendukung koordinat WGS 84."
      ],
      correctAnswer: 1,
      explanation: "Shapefile mewajibkan pengiriman beberapa file terpisah sekaligus, berukuran besar, berformat biner, serta membatasi nama kolom tabel maksimal 10 karakter."
    },
    {
      id: 8,
      question: "Apa tujuan utama dilakukannya 'Proyeksi Peta'?",
      options: [
        "Menggandakan ukuran data spasial agar lebih akurat.",
        "Mengubah koordinat 3D dari permukaan bumi bulat oval menjadi koordinat 2D pada bidang datar agar dapat divisualisasikan pada layar.",
        "Membuat peta menjadi tiga dimensi menggunakan kacamata khusus.",
        "Mendeteksi keberadaan satelit cuaca secara realtime."
      ],
      correctAnswer: 1,
      explanation: "Proyeksi peta memetakan permukaan melengkung bumi (ellipsoid) ke bidang datar datar, yang pasti menghasilkan distorsi pada luas, bentuk, jarak, atau arah."
    },
    {
      id: 9,
      question: "Apa yang dimaksud dengan 'Datum' dalam kartografi spasial?",
      options: [
        "Nama file data spasial yang tersimpan di server cloud.",
        "Model matematis bumi yang digunakan sebagai referensi untuk menghitung koordinat geografis objek di permukaan bumi.",
        "Alat pengukur kemiringan tanah otomatis.",
        "Batas wilayah administratif suatu negara."
      ],
      correctAnswer: 1,
      explanation: "Datum mendefinisikan posisi pusat dan orientasi elipsoid referensi terhadap pusat bumi. Datum paling populer adalah WGS 84."
    },
    {
      id: 10,
      question: "Manakah di bawah ini yang merupakan contoh dari data spasial Raster?",
      options: [
        "Data rute jalan berbentuk GeoJSON LineString.",
        "Batas wilayah kabupaten berbentuk poligon GeoJSON.",
        "Citra Satelit Sentinel atau Model Elevasi Digital (DEM) dalam format GeoTIFF.",
        "Titik-titik koordinat minimarket dalam format CSV."
      ],
      correctAnswer: 2,
      explanation: "GeoTIFF menyimpan grid piksel berskala abu-abu atau multi-band warna yang melambangkan pantulan spektral satelit atau ketinggian permukaan tanah."
    }
  ],
  3: [
    {
      id: 1,
      question: "Apa peran utama GEO MAPID dalam arsitektur WebGIS bootcamp kita?",
      options: [
        "Sebagai code editor tempat menulis sintaks Javascript.",
        "Sebagai platform cloud database spasial terintegrasi untuk menyimpan, mengedit (digitasi), dan mempublikasikan data spasial melalui REST API.",
        "Sebagai hosting server untuk mendeploy website frontend HTML.",
        "Sebagai library rendering grafis pengganti WebGL."
      ],
      correctAnswer: 1,
      explanation: "GEO MAPID berfungsi sebagai Database-as-a-Service (DBaaS) yang menyederhanakan penyimpanan data spasial dan menyediakan API Endpoint siap pakai untuk frontend."
    },
    {
      id: 2,
      question: "Bagaimana cara memasukkan data spasial lokal (seperti Shapefile atau GeoJSON) ke dalam GEO MAPID?",
      options: [
        "Dengan menulis ulang koordinat titik demi titik di console Javascript.",
        "Menggunakan fitur Import Layer pada dashboard GEO MAPID untuk mengunggah file spasial (misal .zip shapefile atau .json).",
        "Mengirimkan file fisik CD/Flashdisk ke kantor MAPID.",
        "Menginstal database PostgreSQL lokal lalu menghubungkannya via kabel LAN."
      ],
      correctAnswer: 1,
      explanation: "Dashboard GEO MAPID menyediakan alat import drag-and-drop otomatis yang mengoversi format spasial desktop ke format database awan MAPID."
    },
    {
      id: 3,
      question: "Fitur apa di GEO MAPID yang memungkinkan kita menggambar objek spasial langsung di atas peta tanpa aplikasi desktop GIS?",
      options: ["REST API generator", "Digitize / Drawing Tools", "Python Compiler", "BBOX Terminal"],
      correctAnswer: 1,
      explanation: "Alat digitasi online GEO MAPID memudahkan user menggambar geometri titik (Point), garis (Line), maupun area (Polygon) langsung menggunakan browser."
    },
    {
      id: 4,
      question: "Parameter penting apa yang wajib kita sertakan dalam header HTTP Request agar frontend diizinkan mengambil data spasial privat dari API GEO MAPID?",
      options: ["Database Password", "MAPID API Key (Authorization / Token)", "Sesi login admin", "Email pendaftaran bootcamp"],
      correctAnswer: 1,
      explanation: "API Key bertindak sebagai token pengenal unik untuk memvalidasi hak akses client terhadap data spasial yang tersimpan di GEO MAPID secara aman."
    },
    {
      id: 5,
      question: "Data format apa yang akan dikembalikan (response) oleh API GEO MAPID saat kita meminta data spasial vektor untuk ditampilkan di MapLibre?",
      options: ["XML format", "GeoJSON / JSON", "Biner Shapefile mentah", "PDF Peta Cetak"],
      correctAnswer: 1,
      explanation: "API MAPID didesain untuk platform web modern, sehingga mengembalikan response berformat standard GeoJSON yang sangat ramah terhadap JavaScript."
    },
    {
      id: 6,
      question: "Mengapa menyimpan data spasial di cloud (seperti GEO MAPID) lebih diunggulkan daripada menyimpan file GeoJSON lokal di dalam folder proyek web?",
      options: [
        "Karena file lokal tidak bisa dibaca oleh compiler JavaScript frontend.",
        "Karena dengan database cloud, data spasial dapat diperbarui (CRUD), difilter, dan diakses oleh banyak pengguna secara dinamis dan real-time tanpa perlu mengubah kode sumber website.",
        "Penyimpanan cloud dijamin 100% gratis tanpa batasan kuota selamanya.",
        "Data lokal di folder proyek sangat mudah terserang virus biner."
      ],
      correctAnswer: 1,
      explanation: "Decoupling data dari source-code meningkatkan efisiensi arsitektur. Anda bisa mengubah data peta di dashboard GEO MAPID dan website otomatis ter-update."
    },
    {
      id: 7,
      question: "Menu apa di GEO MAPID yang digunakan untuk mengelola skema tabel data, menambah kolom atribut baru, atau mengedit entri data spasial?",
      options: ["API Console", "Table / Attribute Editor", "Styling Wizard", "GeoServer Manager"],
      correctAnswer: 1,
      explanation: "Table Editor di GEO MAPID memungkinkan pengguna mengelola data non-spasial (atribut teks/angka) yang terikat langsung pada setiap fitur geometri."
    },
    {
      id: 8,
      question: "Apa kegunaan utama dari fitur 'Publish Layer' di GEO MAPID?",
      options: [
        "Mengirim email notifikasi ke mentor bootcamp.",
        "Mengaktifkan API endpoint publik untuk layer spasial tertentu sehingga dapat diakses oleh aplikasi web eksternal.",
        "Mengunduh seluruh isi layer ke komputer lokal.",
        "Mendatangkan ribuan pengunjung ke website secara otomatis."
      ],
      correctAnswer: 1,
      explanation: "Publishing layer mengubah status layer spasial menjadi API-ready, memberikan akses GET request yang aman bagi aplikasi client."
    },
    {
      id: 9,
      question: "Apakah kita bisa menggabungkan beberapa jenis geometri (misal titik dan poligon) di dalam satu layer yang sama di GEO MAPID sesuai kaidah GIS yang baik?",
      options: [
        "Ya, GEO MAPID membolehkan pencampuran semua jenis geometri tanpa batasan.",
        "Tidak, standar GIS yang baik mewajibkan satu layer berfokus pada satu jenis geometri homogen (khusus titik saja, khusus garis saja, atau khusus poligon saja) agar konsisten dalam styling dan analisis.",
        "Bisa, asalkan data diimpor menggunakan file berekstensi .txt.",
        "Bisa, namun visualisasinya hanya bisa berbentuk hitam-putih."
      ],
      correctAnswer: 1,
      explanation: "Memisahkan tipe geometri ke dalam layer berbeda adalah best practice kartografi spasial demi kelancaran proses styling, query, dan analisis spasial."
    },
    {
      id: 10,
      question: "Use-case industri nyata manakah yang paling pas memanfaatkan integrasi API GEO MAPID?",
      options: [
        "Membuat aplikasi pemutar musik offline.",
        "Sistem monitoring kurir pengantar logistik secara real-time yang memperbarui titik koordinat armada langsung ke server spasial pusat.",
        "Membuat game arcade sederhana berformat 2D.",
        "Mengompres ukuran gambar foto profil website."
      ],
      correctAnswer: 1,
      explanation: "GEO MAPID mempermudah pengiriman data spasial dinamis dari lapangan langsung masuk database awan dan tercermin instan pada dashboard peta WebGIS pemantau."
    }
  ],
  4: [
    {
      id: 1,
      question: "Apa fungsi utama dari bahasa pemrograman HTML dalam pengembangan website?",
      options: [
        "Mengatur logika perhitungan data dan koneksi database.",
        "Mendefinisikan struktur dasar dan elemen konten dari halaman web.",
        "Menyediakan animasi interaktif dan efek suara spasial.",
        "Mengunggah file proyek web ke server hosting awan."
      ],
      correctAnswer: 1,
      explanation: "HTML (HyperText Markup Language) bertindak sebagai kerangka tulang belulang website yang merangkum teks, gambar, tombol, dan tautan."
    },
    {
      id: 2,
      question: "Tag HTML manakah yang paling tepat digunakan untuk membungkus peta WebGIS yang akan dirender lewat JavaScript?",
      options: ["<map>", "<div>", "<img>", "<canvas>"],
      correctAnswer: 1,
      explanation: "Elemen `<div>` (division) bertindak sebagai kontainer kosong generik yang nantinya akan diincar oleh instansiasi MapLibre via ID unik kontainer tersebut."
    },
    {
      id: 3,
      question: "Bagaimana cara menghubungkan file styling CSS eksternal ke dalam file dokumen HTML?",
      options: [
        `<script src="style.css"></script>`,
        `<link rel="stylesheet" href="style.css" />`,
        `<style src="style.css"></style>`,
        `<a href="style.css">Import CSS</a>`
      ],
      correctAnswer: 1,
      explanation: "Tag `<link>` diletakkan di dalam bagian `<head>` HTML untuk memuat file stylesheet CSS luar guna menata seluruh penampilan website."
    },
    {
      id: 4,
      question: "Apa perbedaan mendasar dalam penggunaan atribut ID dan Class pada elemen HTML?",
      options: [
        "ID ditujukan untuk menata elemen teks, sedangkan Class ditujukan untuk gambar.",
        "ID bersifat unik dan hanya boleh digunakan oleh satu elemen spesifik di halaman web; sedangkan Class bersifat reusable dan dapat dibagikan ke banyak elemen sekaligus.",
        "ID ditulis menggunakan huruf kapital saja, sedangkan Class harus menggunakan huruf kecil.",
        "ID hanya dapat dibaca oleh CSS, sedangkan Class hanya dapat dibaca oleh JavaScript."
      ],
      correctAnswer: 1,
      explanation: "ID adalah penanda unik mutlak (biasanya dipakai targeting JS DOM atau style khusus), sementara Class digunakan untuk mengelompokkan elemen ber-gaya serupa."
    },
    {
      id: 5,
      question: "Atribut HTML manakah yang wajib disertakan pada elemen `<a>` untuk menentukan URL halaman tujuan saat tautan tersebut diklik?",
      options: ["src", "link", "href", "target"],
      correctAnswer: 2,
      explanation: "Atribut `href` (Hypertext Reference) menyimpan alamat link tujuan, baik alamat relatif dalam proyek maupun alamat eksternal internet penuh."
    },
    {
      id: 6,
      question: "Manakah penulisan komentar yang benar di dalam file dokumen HTML?",
      options: [
        "// Ini komentar HTML",
        "/* Ini komentar HTML */",
        "<!-- Ini komentar HTML -->",
        "# Ini komentar HTML"
      ],
      correctAnswer: 2,
      explanation: "Komentar HTML diawali dengan `<!--` dan diakhiri dengan `-->`. Kode di dalamnya tidak akan dirender oleh browser."
    },
    {
      id: 7,
      question: "Apa kepanjangan dari singkatan bahasa desain CSS?",
      options: [
        "Computer Style Sheets",
        "Cascading Style Sheets",
        "Creative Style Systems",
        "Complex Styling Standards"
      ],
      correctAnswer: 1,
      explanation: "CSS (Cascading Style Sheets) mendeskripsikan bagaimana elemen HTML ditampilkan di layar, kertas, atau media visual lainnya."
    },
    {
      id: 8,
      question: "Bagaimana cara memilih (select) sebuah elemen HTML dengan ID bernama 'map-container' di dalam kode CSS?",
      options: [
        ".map-container { }",
        "#map-container { }",
        "map-container { }",
        "@map-container { }"
      ],
      correctAnswer: 1,
      explanation: "Dalam selektor CSS, karakter pagar `#` melambangkan pemilihan elemen berdasarkan atribut ID uniknya."
    },
    {
      id: 9,
      question: "Properti CSS manakah yang digunakan untuk mengubah warna latar belakang sebuah kontainer panel dashboard?",
      options: ["color", "font-color", "background-color", "border-color"],
      correctAnswer: 2,
      explanation: "Properti `background-color` digunakan untuk mengisi warna latar, sedangkan `color` khusus digunakan untuk mengatur warna teks."
    },
    {
      id: 10,
      question: "Model penulisan warna CSS manakah yang mendukung penyesuaian transparansi (opacity) agar peta di belakang panel tetap samar-samar terlihat?",
      options: ["HEX (#FF0000)", "RGB (255, 0, 0)", "RGBA (255, 0, 0, 0.5)", "Warna bernama (red)"],
      correctAnswer: 2,
      explanation: "Huruf 'A' pada RGBA melambangkan Alpha (saluran transparansi) dengan rentang nilai dari 0.0 (transparan penuh) hingga 1.0 (pekat/solid)."
    }
  ],
  5: [
    {
      id: 1,
      question: "Dalam CSS Box Model, apa perbedaan antara Margin dan Padding?",
      options: [
        "Margin adalah batas ketebalan border garis, sedangkan Padding adalah tinggi keseluruhan elemen.",
        "Margin mengatur jarak kosong di luar batas border elemen; sedangkan Padding mengatur jarak kosong di dalam elemen (antara konten dan border).",
        "Margin hanya berlaku untuk elemen teks, sedangkan Padding hanya berlaku untuk kontainer div.",
        "Margin berada di dalam elemen, sedangkan Padding berada di luar batas terluar elemen."
      ],
      correctAnswer: 1,
      explanation: "Margin menciptakan ruang di sekeliling luar kotak elemen untuk menjauhkan elemen tetangga, sedangkan padding memberi ruang pernapasan internal konten."
    },
    {
      id: 2,
      question: "Sistem tata letak (layout) CSS manakah yang didesain khusus untuk mengatur susunan elemen satu dimensi (baik horizontal saja atau vertikal saja)?",
      options: ["CSS Grid", "Flexbox (Flexible Box)", "Absolute Positioning", "Table Layout"],
      correctAnswer: 1,
      explanation: "Flexbox mempermudah penyelarasan elemen-elemen anak di sepanjang sumbu utama (main-axis) secara fleksibel, sangat pas untuk navbar atau baris kartu."
    },
    {
      id: 3,
      question: "Bagaimana cara menyusun tata letak dua dimensi yang kompleks (baris dan kolom sekaligus, seperti grid dashboard modular) secara bersih?",
      options: ["Flexbox", "CSS Grid Layout", "Floats", "Inline-block elements"],
      correctAnswer: 1,
      explanation: "CSS Grid dirancang khusus untuk layout dua dimensi (baris & kolom), memberikan kendali penuh terhadap penempatan posisi grid-item."
    },
    {
      id: 4,
      question: "Properti Flexbox manakah yang digunakan untuk mengatur agar elemen-elemen anak bergeser ke sumbu utama (misal rata tengah horizontal)?",
      options: ["align-items", "justify-content", "flex-direction", "flex-wrap"],
      correctAnswer: 1,
      explanation: "Properti `justify-content` mengatur distribusi elemen-elemen anak di sepanjang sumbu utama (biasanya horizontal), dengan nilai seperti center, space-between."
    },
    {
      id: 5,
      question: "Properti CSS manakah yang digunakan untuk membulatkan sudut-sudut tajam sebuah kartu panel atau tombol peta agar terkesan modern?",
      options: ["border-style", "border-width", "border-radius", "box-shadow"],
      correctAnswer: 2,
      explanation: "Properti `border-radius` menerima satuan piksel (px) atau persen (%) untuk melengkungkan sudut elemen secara halus."
    },
    {
      id: 6,
      question: "Teknik CSS apa yang digunakan agar gaya tampilan website dapat beradaptasi secara otomatis ketika dibuka di layar handphone yang sempit?",
      options: ["CSS Animations", "Media Queries (@media)", "CSS Variables", "Absolute margins"],
      correctAnswer: 1,
      explanation: "Media Queries memungkinkan kita menulis blok CSS khusus yang hanya aktif ketika lebar viewport layar menyentuh ukuran batas tertentu (breakpoint)."
    },
    {
      id: 7,
      question: "Properti layout flexbox manakah yang wajib disetel agar elemen-elemen anak otomatis melompat ke baris baru ketika ruang kontainer sudah habis?",
      options: [
        "flex-direction: column",
        "flex-wrap: wrap",
        "align-content: stretch",
        "display: block"
      ],
      correctAnswer: 1,
      explanation: "Secara default flex-items akan dipaksa menyusut dalam satu baris. Menggunakan `flex-wrap: wrap` mengizinkan elemen turun ke bawah secara natural."
    },
    {
      id: 8,
      question: "Dalam mendesain antarmuka modern, efek visual apa yang memberikan bayangan lembut di bawah kartu dashboard agar terlihat melayang di atas peta?",
      options: ["text-shadow", "box-shadow", "background-shadow", "opacity"],
      correctAnswer: 1,
      explanation: "Properti `box-shadow` memberikan efek kedalaman (depth) 3D palsu pada elemen dengan menentukan offset bayangan, keburaman (blur), dan warna."
    },
    {
      id: 9,
      question: "Apa arti dari nilai CSS properti `position: absolute`?",
      options: [
        "Elemen akan mengalir secara normal mengikuti alur dokumen.",
        "Elemen diposisikan relatif terhadap viewport layar browser dan tidak bergeser saat di-scroll.",
        "Elemen ditarik keluar dari alur dokumen normal dan diposisikan secara presisi relatif terhadap leluhur (parent) terdekatnya yang berstatus non-static.",
        "Elemen otomatis bersembunyi dan tidak dapat diklik."
      ],
      correctAnswer: 2,
      explanation: "Menggunakan `position: absolute` memungkinkan kita meletakkan kontrol HUD koordinat atau tombol zoom tepat di atas peta secara melayang."
    },
    {
      id: 10,
      question: "Bagaimana cara membuat efek transisi perubahan warna tombol yang halus saat disorot kursor (hover)?",
      options: [
        "Menggunakan properti transition CSS (misal `transition: background 0.3s ease`)",
        "Menulis fungsi Javascript interaktif yang mengganti stylesheet.",
        "Mengimpor animasi video GIF berulang.",
        "Mengubah format gambar tombol menjadi SVG terkompresi."
      ],
      correctAnswer: 0,
      explanation: "Properti `transition` menginstruksikan browser untuk memperhalus perubahan properti CSS yang dipicu oleh selector seperti `:hover`."
    }
  ],
  6: [
    {
      id: 1,
      question: "Manakah cara deklarasi variabel di JavaScript modern (ES6) yang membatasi cakupan variabel hanya di dalam blok kode (block scope) tempat ia dibuat?",
      options: ["var", "let & const", "global", "def"],
      correctAnswer: 1,
      explanation: "`let` dan `const` memiliki cakupan lokal blok (block-scoped `{}`), mengeliminasi risiko polusi variabel global atau hoisting aneh yang sering terjadi pada `var`."
    },
    {
      id: 2,
      question: "Apa perbedaan krusial antara pendeklarasian variabel menggunakan `let` dan `const`?",
      options: [
        "Const hanya dapat menyimpan data bertipe angka, sedangkan Let bisa teks.",
        "Nilai variabel Let dapat diubah/ditulis ulang kapan saja (mutable); sedangkan variabel Const bertindak sebagai konstanta yang nilainya tidak dapat di-reassign (immutable) setelah diinisialisasi.",
        "Let membutuhkan memori penyimpanan komputer lebih besar dari Const.",
        "Const otomatis diekspor ke database server sedangkan Let tidak."
      ],
      correctAnswer: 1,
      explanation: "Gunakan `const` untuk referensi yang tidak akan di-reassign demi menjaga konsistensi kode dan mencegah bug yang tidak disengaja."
    },
    {
      id: 3,
      question: "Manakah tipe data JavaScript di bawah ini yang digunakan untuk menyimpan kumpulan data terurut yang diakses menggunakan indeks angka?",
      options: ["Object", "Array", "String", "Boolean"],
      correctAnswer: 1,
      explanation: "Array dideklarasikan menggunakan kurung siku `[...]` dan berisi daftar elemen terurut yang diindeks mulai dari angka 0."
    },
    {
      id: 4,
      question: "Tipe data manakah yang paling ideal untuk merepresentasikan fitur spasial tunggal yang memiliki atribut kompleks (kunci dan nilai/key-value pairs)?",
      options: ["Array", "Object", "Function", "Null"],
      correctAnswer: 1,
      explanation: "Objek JavaScript ditulis menggunakan kurung kurawal `{}` dan menyimpan pasangan key-value, sangat pas untuk mewakili bagian `properties` di GeoJSON."
    },
    {
      id: 5,
      question: "Method Array manakah yang digunakan untuk memproses dan menyaring elemen array agar menyisakan data yang lolos kriteria tertentu saja (misal mencari peserta dengan nilai > 80)?",
      options: ["array.map()", "array.forEach()", "array.filter()", "array.push()"],
      correctAnswer: 2,
      explanation: "`filter()` mengembalikan array baru berisi semua elemen yang lolos uji kondisi fungsi callback penyaring."
    },
    {
      id: 6,
      question: "Bagaimana cara menulis conditional statement (percabangan logika) di JavaScript?",
      options: [
        "if (kondisi) { ... }",
        "if kondisi: ...",
        "select kondisi case ...",
        "either (kondisi) or { ... }"
      ],
      correctAnswer: 0,
      explanation: "Blok `if` mengevaluasi kondisi di dalam tanda kurung biasa `()`, jika bernilai true maka blok kode di dalam kurung kurawal `{}` akan dieksekusi."
    },
    {
      id: 7,
      question: "Manakah penulisan fungsi Arrow Function (sintaks modern ES6) yang valid di JavaScript?",
      options: [
        "const myFunc = function() => { }",
        "const myFunc = () => { }",
        "def myFunc() => { }",
        "arrow myFunc() { }"
      ],
      correctAnswer: 1,
      explanation: "Arrow Function `() => { }` menyediakan sintaks penulisan fungsi yang lebih ringkas dan mempertahankan lexical binding terhadap nilai `this`."
    },
    {
      id: 8,
      question: "Apa kegunaan dari method `console.log()`?",
      options: [
        "Menampilkan kotak dialog peringatan pop-up di layar pengguna.",
        "Mencetak informasi atau melacak isi nilai variabel ke tab Console Developer Tools browser untuk tujuan inspeksi/debugging.",
        "Mengirimkan data langsung ke server database cloud MAPID.",
        "Memaksa browser client berhenti memproses skrip JavaScript."
      ],
      correctAnswer: 1,
      explanation: "`console.log()` adalah sahabat terdekat developer untuk mengintip isi data spasial, melacak alur eksekusi fungsi, atau menangkap log error."
    },
    {
      id: 9,
      question: "Apa output dari evaluasi perbandingan nilai dan tipe data berikut: `100 === '100'`?",
      options: ["true", "false", "undefined", "NaN"],
      correctAnswer: 1,
      explanation: "Operator `===` (strict equality) memeriksa kesamaan nilai SEKALIGUS tipe datanya. Karena tipe data kiri adalah Number dan kanan adalah String, hasilnya adalah false."
    },
    {
      id: 10,
      question: "Method Array manakah yang digunakan untuk menyisipkan satu elemen baru ke posisi paling akhir dari sebuah Array?",
      options: ["array.pop()", "array.shift()", "array.push()", "array.join()"],
      correctAnswer: 2,
      explanation: "`push()` memodifikasi array asli dengan menambahkan satu atau lebih elemen baru ke ujung ekor array dan mengembalikan panjang array baru."
    }
  ],
  7: [
    {
      id: 1,
      question: "Apa kepanjangan dari istilah DOM dalam JavaScript browser?",
      options: [
        "Database Object Model",
        "Document Object Model",
        "Data Organization Method",
        "Dynamic Object Management"
      ],
      correctAnswer: 1,
      explanation: "DOM (Document Object Model) adalah API antarmuka pemrograman untuk dokumen HTML. DOM merepresentasikan halaman web sebagai pohon struktur objek (node tree)."
    },
    {
      id: 2,
      question: "Fungsi bawaan JavaScript manakah yang paling modern dan serbaguna untuk menargetkan/memilih satu elemen HTML berdasarkan selektor CSS (seperti class atau ID)?",
      options: [
        "document.getElementByTagName()",
        "document.querySelector()",
        "document.getElementById()",
        "document.findCSS()"
      ],
      correctAnswer: 1,
      explanation: "`querySelector()` menerima string selektor CSS standar apa pun dan mengembalikan elemen DOM pertama yang cocok."
    },
    {
      id: 3,
      question: "Method DOM manakah yang digunakan untuk mendaftarkan aksi interaksi (seperti mendeteksi klik tombol) agar memicu baris kode JavaScript tertentu?",
      options: [
        "element.triggerEvent()",
        "element.addEventListener()",
        "element.onClick()",
        "element.bindAction()"
      ],
      correctAnswer: 1,
      explanation: "`addEventListener('nama_event', callback)` mendaftarkan pendengar event pada target DOM sehingga callback terpanggil setiap kali event tersebut terpicu."
    },
    {
      id: 4,
      question: "Bagaimana cara mengubah isi teks di dalam sebuah elemen HTML secara dinamis menggunakan DOM manipulation?",
      options: [
        "element.textContent = 'Teks Baru';",
        "element.writeText('Teks Baru');",
        "element.src = 'Teks Baru';",
        "element.value = 'Teks Baru';"
      ],
      correctAnswer: 0,
      explanation: "Mengisi properti `textContent` atau `innerText` akan menimpa seluruh teks konten di dalam tag elemen target secara aman."
    },
    {
      id: 5,
      question: "Bagaimana cara mengambil nilai string input teks (misalnya tautan pengumpulan tugas) dari sebuah elemen input HTML?",
      options: [
        "inputElement.textContent",
        "inputElement.value",
        "inputElement.getAttribute('text')",
        "inputElement.innerHTML"
      ],
      correctAnswer: 1,
      explanation: "Elemen form input (seperti `<input>` atau `<textarea>`) menyimpan data ketikan pengguna di dalam properti `.value`."
    },
    {
      id: 6,
      question: "Method JavaScript modern manakah yang digunakan untuk melakukan pemanggilan data dari API eksternal (seperti API GEO MAPID) secara asinkron (Asynchronous)?",
      options: ["XMLHTTPRequest", "fetch()", "axios.get()", "ajax()"],
      correctAnswer: 1,
      explanation: "API `fetch()` adalah standar web modern berbasis Promise yang mempermudah request HTTP asinkron langsung dari browser tanpa library luar."
    },
    {
      id: 7,
      question: "Apa fungsi utama dari blok penanganan error `try { ... } catch (error) { ... }` di JavaScript?",
      options: [
        "Mencegah browser mendeploy aplikasi jika ada bug.",
        "Mengisolasi kode yang berisiko memicu error (misal parsing data JSON rusak) agar program tidak crash total, dan membelokkan alur penanganan error secara elegan.",
        "Menghapus seluruh variabel global untuk menghemat memori.",
        "Memaksa fungsi asinkron berjalan secara sinkron."
      ],
      correctAnswer: 1,
      explanation: "Mengurung operasi sensitif (seperti parsing JSON atau request network) dengan `try-catch` menjamin aplikasi tetap berjalan mulus meskipun terjadi kendala tak terduga."
    },
    {
      id: 8,
      question: "Sintaksis modern manakah yang digunakan untuk mempermudah penulisan operasi asinkron agar terlihat seperti baris kode sinkron yang rapi?",
      options: ["then / catch", "async / await", "promise / resolve", "try / catch"],
      correctAnswer: 1,
      explanation: "Kata kunci `async` menandai sebuah fungsi asinkron dan `await` menunda eksekusi baris berikutnya sampai Promise di depannya selesai diselesaikan."
    },
    {
      id: 9,
      question: "Method DOM manakah yang digunakan untuk memodifikasi daftar class gaya pada elemen (misal menambahkan class aktif atau menghapus class tersembunyi)?",
      options: [
        "element.className = 'active'",
        "element.classList.add() / element.classList.remove()",
        "element.setStyle('class', 'active')",
        "element.attributes.add('class')"
      ],
      correctAnswer: 1,
      explanation: "Objek properti `classList` menyediakan helper manipulasi class yang sangat lengkap seperti `.add()`, `.remove()`, `.toggle()`, dan `.contains()`."
    },
    {
      id: 10,
      question: "Fungsi bawaan JavaScript manakah yang digunakan untuk mengoversi data String berformat JSON menjadi objek JavaScript utuh agar bisa diakses propertinya?",
      options: [
        "JSON.stringify()",
        "JSON.parse()",
        "JSON.toObject()",
        "String.parseJSON()"
      ],
      correctAnswer: 1,
      explanation: "`JSON.parse(string)` membaca teks mentah beraliran JSON dan membangun struktur objek/array JS yang cocok, sedangkan `JSON.stringify(object)` melakukan kebalikannya."
    }
  ],
  8: [
    {
      id: 1,
      question: "Apa keunggulan utama peta berbasis Vector Tiles (seperti MapLibre GL JS) dibandingkan Raster Tiles tradisional?",
      options: [
        "Vector tiles memiliki ukuran file gambar yang jauh lebih besar.",
        "Vector tiles mengirimkan data geometri asli ke browser, memungkinkan proses styling, rotasi peta 3D yang sangat mulus, dan interaktivitas tingkat tinggi langsung di sisi client tanpa blur saat di-zoom.",
        "Vector tiles tidak membutuhkan kartu grafis (GPU) untuk merender visual.",
        "Vector tiles hanya dapat menampilkan peta hitam-putih."
      ],
      correctAnswer: 1,
      explanation: "Vector tiles mengirim koordinat matematika geometris mentah. Browser client memanfaatkan WebGL kartu grafis untuk merender visual peta secara dinamis di setiap tingkat perbesaran."
    },
    {
      id: 2,
      question: "Objek global apa di dalam pustaka MapLibre GL JS yang diinstansiasi untuk membangun sebuah peta baru di halaman web?",
      options: [
        "maplibregl.CreateMap()",
        "new maplibregl.Map()",
        "maplibregl.Init()",
        "new maplibregl.WebMap()"
      ],
      correctAnswer: 1,
      explanation: "Konstruktor `new maplibregl.Map(options)` dipanggil dengan membawa konfigurasi objek wajib untuk melahirkan elemen kanvas peta fungsional."
    },
    {
      id: 3,
      question: "Di dalam objek konfigurasi `new maplibregl.Map()`, properti manakah yang digunakan untuk mengincar ID elemen HTML kontainer pembungkus peta?",
      options: ["id", "target", "container", "element"],
      correctAnswer: 2,
      explanation: "Properti `container` menerima string ID elemen HTML tempat peta akan diletakkan (misal `container: 'map'`)."
    },
    {
      id: 4,
      question: "Secara default, format urutan array koordinat center manakah yang digunakan oleh MapLibre GL JS?",
      options: [
        "[Latitude, Longitude]",
        "[Longitude, Latitude]",
        "[X, Y, Z]",
        "[Easting, Northing]"
      ],
      correctAnswer: 1,
      explanation: "Seperti standar Web Mercator, MapLibre GL JS mewajibkan penulisan koordinat pusat peta dalam urutan `[Bujur/Longitude, Lintang/Latitude]`."
    },
    {
      id: 5,
      question: "Bagaimana cara menyertakan library CSS dan JavaScript MapLibre GL JS ke dalam proyek web kita?",
      options: [
        "Tidak perlu diimpor, browser otomatis memiliki library MapLibre bawaan.",
        "Melalui CDN link CSS dan tag script JS MapLibre di file HTML, atau menginstalnya via NPM (`npm i maplibre-gl`) dalam pengembangan modern.",
        "Dengan mengunduh citra peta dalam format JPG lalu diletakkan di folder proyek.",
        "Dengan menghubungkannya langsung ke database SQL."
      ],
      correctAnswer: 1,
      explanation: "Anda dapat memuat aset CDN MapLibre lewat tag `<link>` dan `<script>` pada HTML, atau melalui npm/yarn untuk setup arsitektur berbasis module bundler."
    },
    {
      id: 6,
      question: "Apa fungsi dari properti `style` pada inisialisasi MapLibre GL JS?",
      options: [
        "Mengatur lebar dan tinggi elemen kanvas peta di layar.",
        "Menentukan skema desain visual peta, sumber ubin data vektor/raster, dan definisi layer dasar (basemap) berformat JSON.",
        "Mengubah warna teks tombol kontrol zoom.",
        "Menyimpan kredensial API key."
      ],
      correctAnswer: 1,
      explanation: "Properti `style` menunjuk ke URL file JSON spesifikasi Mapbox Style yang mendeskripsikan font peta, susunan basemap, ubin jalan, bangunan, dll."
    },
    {
      id: 7,
      question: "Dalam MapLibre, tingkat kedekatan tampilan peta dengan permukaan tanah diatur oleh properti...",
      options: ["scale", "zoom", "pitch", "bearing"],
      correctAnswer: 1,
      explanation: "Properti `zoom` menerima angka desimal (biasanya antara 0 hingga 22) untuk mengatur level kedekatan perbesaran kamera peta."
    },
    {
      id: 8,
      question: "Properti inisialisasi MapLibre manakah yang digunakan untuk memiringkan sudut pandang kamera (3D Perspective) agar efek 3D gedung terlihat menonjol?",
      options: ["bearing", "pitch", "rotation", "skew"],
      correctAnswer: 1,
      explanation: "Properti `pitch` mengatur kemiringan sudut kamera dalam satuan derajat (0 melambangkan pandangan 2D tegak lurus dari atas ke bawah, 60-85 melambangkan miring perspektif)."
    },
    {
      id: 9,
      question: "Properti inisialisasi MapLibre manakah yang digunakan untuk memutar arah hadap peta (rotasi arah mata angin kamera)?",
      options: ["bearing", "pitch", "direction", "orientation"],
      correctAnswer: 0,
      explanation: "Properti `bearing` mengatur rotasi peta dalam derajat searah jarum jam dari arah Utara (0 melambangkan Utara tegak lurus ke atas)."
    },
    {
      id: 10,
      question: "Mengapa disarankan mematikan interaktivitas rotasi peta pada beberapa jenis dashboard analisis bisnis WebGIS?",
      options: [
        "Karena browser akan otomatis crash jika peta diputar.",
        "Agar peta dasar selalu terkunci stabil menghadap ke arah Utara, memudahkan pembacaan distribusi spasial bagi pengguna awam tanpa kebingungan arah kompas.",
        "Karena MapLibre tidak mendukung fitur rotasi sama sekali.",
        "Agar konsumsi kuota API Key menjadi lebih hemat."
      ],
      correctAnswer: 1,
      explanation: "Mengunci opsi rotasi (`dragRotate: false`, `touchZoomRotate: false`) menghindarkan user memutar peta secara tidak sengaja yang bisa mendistorsi persepsi spasial."
    }
  ],
  9: [
    {
      id: 1,
      question: "Dalam MapLibre GL JS, apa perbedaan konseptual antara 'Source' dan 'Layer'?",
      options: [
        "Source adalah nama database eksternal, sedangkan Layer adalah file styling CSS.",
        "Source mendefinisikan data mentah spasial (koordinat geometri dan atribut) yang akan ditampilkan; sedangkan Layer mendefinisikan bagaimana data dari Source tersebut digambar secara visual (misal sebagai titik merah, garis tebal, atau poligon transparan).",
        "Source bertugas untuk menangkap interaksi klik user, sedangkan Layer bertugas memutar peta.",
        "Source hanya mendukung format gambar satelit, sedangkan Layer hanya mendukung GeoJSON."
      ],
      correctAnswer: 1,
      explanation: "Source adalah pemasok data (geometri/atribut) di balik layar, sedangkan Layer adalah representasi visual di atas kanvas yang terikat pada salah satu Source."
    },
    {
      id: 2,
      question: "Method JavaScript manakah yang digunakan untuk mendaftarkan sumber data spasial baru (seperti objek GeoJSON) ke dalam instansiasi peta MapLibre?",
      options: [
        "map.addLayer()",
        "map.addSource()",
        "map.setFeature()",
        "map.pushData()"
      ],
      correctAnswer: 1,
      explanation: "`map.addSource(id, options)` mendaftarkan sumber data spasial baru ke dalam map state dengan memberikan ID referensi unik."
    },
    {
      id: 3,
      question: "Method JavaScript manakah yang digunakan untuk menggambar secara visual data yang telah didaftarkan di Source ke atas peta?",
      options: [
        "map.draw()",
        "map.addLayer()",
        "map.addSource()",
        "map.injectLayer()"
      ],
      correctAnswer: 1,
      explanation: "`map.addLayer(options)` digunakan untuk merender data spasial dari Source ke peta dengan menentukan tipe layer dan gaya visualisasinya."
    },
    {
      id: 4,
      question: "Di dalam pemanggilan method `map.addSource()`, opsi properti manakah yang digunakan untuk menentukan format data yang dimasukkan (misalnya 'geojson')?",
      options: ["format", "type", "dataType", "sourceType"],
      correctAnswer: 1,
      explanation: "Properti `type` menetapkan jenis sumber data, seperti 'geojson', 'vector', 'raster', 'raster-dem', atau 'video'."
    },
    {
      id: 5,
      question: "Tipe layer MapLibre manakah yang paling pas digunakan untuk merender data spasial bertipe geometri Area (Polygon) agar terisi warna solid?",
      options: ["circle", "line", "fill", "symbol"],
      correctAnswer: 2,
      explanation: "Tipe layer `fill` merender poligon tertutup dengan opsi pewarnaan solid, transparansi, pola arsiran (pattern), serta garis tepi."
    },
    {
      id: 6,
      question: "Tipe layer MapLibre manakah yang digunakan jika kita ingin menggambar objek jalan raya (LineString) agar terlihat sebagai garis kontinu?",
      options: ["fill", "line", "circle", "heatmap"],
      correctAnswer: 1,
      explanation: "Tipe layer `line` ditujukan khusus untuk menggambar garis atau outline poligon dengan pengaturan ketebalan, warna, dan jenis putus-putus (dasharray)."
    },
    {
      id: 7,
      question: "Manakah format data masukan paling valid untuk properti `data` di dalam konfigurasi source bertipe 'geojson'?",
      options: [
        "String path file CSV lokal.",
        "Objek GeoJSON utuh (JavaScript Object) atau URL string yang mengarah ke file JSON/GeoJSON eksternal.",
        "Kumpulan biner data Shapefile zip.",
        "Array koordinat mentah tanpa informasi geometri."
      ],
      correctAnswer: 1,
      explanation: "Properti `data` di source 'geojson' dapat menerima objek JavaScript bertipe GeoJSON secara langsung atau string URL endpoint API yang mengembalikan format GeoJSON."
    },
    {
      id: 8,
      question: "Di dalam objek konfigurasi layer, properti manakah yang digunakan untuk mengikat layer tersebut ke ID sumber data yang sesuai?",
      options: ["id", "source", "source-layer", "data-source"],
      correctAnswer: 1,
      explanation: "Properti `source` diisi string ID dari Source yang sudah didaftarkan sebelumnya melalui `map.addSource()`."
    },
    {
      id: 9,
      question: "Bagian properti layer manakah yang digunakan untuk menulis gaya visual seperti ukuran lingkaran (`circle-radius`) atau warna lingkaran (`circle-color`)?",
      options: ["layout", "paint", "properties", "styles"],
      correctAnswer: 1,
      explanation: "Properti `paint` menangani visualisasi estetika detail tingkat pixel seperti warna, ketebalan, keburaman, bayangan yang dirender kartu grafis."
    },
    {
      id: 10,
      question: "Grup properti layer manakah yang digunakan untuk mengatur visibilitas layer (`visibility`) atau letak teks penanda (`text-anchor`)?",
      options: ["paint", "layout", "configuration", "attributes"],
      correctAnswer: 1,
      explanation: "Properti `layout` mendefinisikan bagaimana browser memposisikan dan merencanakan objek spasial sebelum kartu grafis menggambarnya (paint)."
    }
  ],
  10: [
    {
      id: 1,
      question: "Fungsi bawaan MapLibre GL JS manakah yang dipanggil untuk memunculkan kotak popup informasi dinamis di atas peta?",
      options: [
        "map.showPopup()",
        "new maplibregl.Popup()",
        "new maplibregl.InfoWindow()",
        "map.addPopup()"
      ],
      correctAnswer: 1,
      explanation: "Konstruktor `new maplibregl.Popup(options)` menginstansiasi objek popup yang nantinya dapat dipasang ke koordinat tertentu di atas peta."
    },
    {
      id: 2,
      question: "Method popup manakah yang digunakan untuk menentukan posisi koordinat `[Bujur, Lintang]` berdirinya balon popup tersebut?",
      options: ["setLngLat()", "setHTML()", "addTo()", "setPosition()"],
      correctAnswer: 0,
      explanation: "`setLngLat([longitude, latitude])` memposisikan letak popup secara spasial pada koordinat geografis bumi."
    },
    {
      id: 3,
      question: "Method popup manakah yang diisi dengan tag HTML untuk menyajikan tabel atribut data dinamis di dalam balon popup?",
      options: ["setText()", "setHTML()", "setContent()", "renderHTML()"],
      correctAnswer: 1,
      explanation: "`setHTML(stringHTML)` menyuntikkan susunan elemen HTML (seperti tabel atau gambar) ke dalam popup untuk menyajikan informasi kaya estetika."
    },
    {
      id: 4,
      question: "Method popup manakah yang dipanggil paling akhir agar popup tersebut menempel secara fisik ke kanvas peta target?",
      options: ["append()", "addTo(map)", "setMap(map)", "render()"],
      correctAnswer: 1,
      explanation: "`addTo(map)` menempelkan popup ke instans peta aktif untuk segera digambar di koordinat yang sesuai."
    },
    {
      id: 5,
      question: "Bagaimana cara mengubah ikon kursor mouse menjadi telunjuk (pointer) ketika mouse melayang di atas titik layer peta agar pengguna tahu titik tersebut bisa diklik?",
      options: [
        "map.setCursor('pointer');",
        "map.getCanvas().style.cursor = 'pointer';",
        "map.style.cursor = 'pointer';",
        "document.style.cursor = 'pointer';"
      ],
      correctAnswer: 1,
      explanation: "Mengubah properti kursor CSS pada elemen kanvas peta (`map.getCanvas().style.cursor = 'pointer'`) adalah trik standar UX WebGIS."
    },
    {
      id: 6,
      question: "Method penting MapLibre manakah yang digunakan untuk mengambil array fitur data spasial (geometri & atribut) yang berada tepat di bawah posisi kursor mouse saat diklik?",
      options: [
        "map.getFeatures()",
        "map.queryRenderedFeatures()",
        "map.selectFeatures()",
        "map.getFeaturesAtPoint()"
      ],
      correctAnswer: 1,
      explanation: "`map.queryRenderedFeatures(point, options)` melakukan query spasial sisi client yang sangat cepat, mengembalikan semua objek spasial di koordinat pixel tersebut."
    },
    {
      id: 7,
      question: "Bagaimana cara mendengarkan event klik user yang terjadi khusus pada sebuah layer bernama 'kantor-mapid'?",
      options: [
        "map.onClick('kantor-mapid', (e) => { ... });",
        "map.on('click', 'kantor-mapid', (e) => { ... });",
        "document.getElementById('kantor-mapid').addEventListener('click', ...);",
        "map.layer('kantor-mapid').on('click', ...);"
      ],
      correctAnswer: 1,
      explanation: "Sintaks `map.on('click', 'layer-id', callback)` mendaftarkan pendengar klik spasial yang disaring khusus untuk layer tersebut."
    },
    {
      id: 8,
      question: "Di dalam callback event klik peta, di manakah kita bisa membaca titik koordinat geografis lokasi klik tersebut secara presisi?",
      options: ["e.coordinates", "e.lngLat", "e.point", "e.pixel"],
      correctAnswer: 1,
      explanation: "Objek argumen event `e` menyimpan properti `e.lngLat` (berisi Bujur Lintang spasial) dan `e.point` (posisi piksel X Y layar)."
    },
    {
      id: 9,
      question: "Bagaimana cara menambahkan kontrol navigasi standar (tombol Zoom In, Zoom Out, dan Rotasi Kompas) ke pojok peta?",
      options: [
        "map.addZoomButtons()",
        "map.addControl(new maplibregl.NavigationControl())",
        "map.addComponent(new maplibregl.Zoom())",
        "new maplibregl.Controls().addTo(map)"
      ],
      correctAnswer: 1,
      explanation: "`map.addControl(new maplibregl.NavigationControl(), position)` memasang modul kontrol navigasi resmi bawaan MapLibre."
    },
    {
      id: 10,
      question: "Properti kustomisasi popup manakah yang wajib disetel agar balon popup menutup otomatis saat pengguna mengklik area kosong lain di peta?",
      options: [
        "closeOnClick: true",
        "closeOnBlur: true",
        "autoClose: true",
        "clickToDismiss: true"
      ],
      correctAnswer: 0,
      explanation: "Opsi `closeOnClick: true` adalah pengaturan standar UX untuk menjaga kenyamanan layar dari tumpukan popup yang tidak dibutuhkan."
    }
  ],
  11: [
    {
      id: 1,
      question: "Apa tujuan utama dari visualisasi peta Heatmap?",
      options: [
        "Menampilkan rute perjalanan tercepat antar kota.",
        "Merepresentasikan konsentrasi intensitas atau densitas spasial dari kumpulan data titik menggunakan gradasi warna gradien hangat-dingin.",
        "Mengukur batas elevasi ketinggian tanah secara topografis.",
        "Menampilkan batas wilayah negara secara administratif."
      ],
      correctAnswer: 1,
      explanation: "Heatmap mengubah ribuan data titik rapat menjadi visual permukaan warna kontinu yang melambangkan tingkat kepadatan spasial objek di lapangan."
    },
    {
      id: 2,
      question: "Di dalam MapLibre GL JS, tipe layer (layer type) manakah yang digunakan untuk memvisualisasikan heatmap?",
      options: ["density", "heatmap", "blur-point", "gradient"],
      correctAnswer: 1,
      explanation: "Tipe layer `heatmap` merender densitas spasial secara real-time memanfaatkan shader WebGL yang efisien di sisi browser client."
    },
    {
      id: 3,
      question: "Properti paint layer heatmap manakah yang digunakan untuk mengontrol seberapa luas area pengaruh penyebaran (radius keburaman) dari setiap titik data?",
      options: ["heatmap-weight", "heatmap-radius", "heatmap-intensity", "heatmap-spread"],
      correctAnswer: 1,
      explanation: "`heatmap-radius` menentukan radius pencarian pengaruh spasial dalam satuan piksel. Semakin besar radius, semakin halus dan lebar gradien warna yang terbentuk."
    },
    {
      id: 4,
      question: "Properti paint layer heatmap manakah yang bertugas mengatur tingkat kontribusi signifikansi (bobot kepentingan) dari masing-masing titik berdasarkan kolom atribut angka tertentu?",
      options: ["heatmap-radius", "heatmap-weight", "heatmap-intensity", "heatmap-color"],
      correctAnswer: 1,
      explanation: "`heatmap-weight` dapat diikat pada kolom atribut numerik (misal jumlah transaksi/penjualan) agar titik ber-nilai besar memancarkan panas yang lebih membara."
    },
    {
      id: 5,
      question: "Bagaimana cara kerja properti `heatmap-color` dalam mendefinisikan gradien warna?",
      options: [
        "Menerima satu string warna solid tunggal.",
        "Menerima ekspresi interpolasi skala 0.0 (densitas nol/transparan) hingga 1.0 (densitas maksimal/panas merah) untuk menetapkan peta gradasi warna gradien.",
        "Mengubah warna teks legenda peta.",
        "Menentukan warna outline tepi lingkaran titik."
      ],
      correctAnswer: 1,
      explanation: "`heatmap-color` menggunakan sintaks interpolasi RAMPA warna (biasanya menggunakan `['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(...)', 1, 'rgb(...)']`) untuk membangun spektrum gradien warna."
    },
    {
      id: 6,
      question: "Mengapa visualisasi heatmap harus disetel agar memudar (transparan penuh) ketika level zoom peta diperbesar sangat dekat dengan tanah?",
      options: [
        "Karena browser akan mengalami crash jika heatmap di-zoom terlalu dekat.",
        "Agar ketika kamera sudah sangat dekat, visual heatmap tidak lagi menutupi detail jalan raya/basemap, dan otomatis digantikan oleh visualisasi titik lokasi individu asli yang lebih presisi.",
        "Karena MapLibre tidak mampu merender warna di level zoom tinggi.",
        "Karena koordinat spasial akan otomatis meleset jika dipaksakan."
      ],
      correctAnswer: 1,
      explanation: "Ini adalah taktik UX kartografi: gunakan `heatmap-opacity` bertransisi memudar pada zoom tinggi, berbarengan dengan munculnya (fade-in) layer bertipe `circle`."
    },
    {
      id: 7,
      question: "Properti paint layer heatmap manakah yang bertugas sebagai pengali global untuk melipatgandakan kecerahan warna heatmap di seluruh wilayah peta?",
      options: ["heatmap-weight", "heatmap-intensity", "heatmap-radius", "heatmap-opacity"],
      correctAnswer: 1,
      explanation: "`heatmap-intensity` bertindak sebagai penguat/multiplier sinyal panas global secara dinamis berdasarkan level perbesaran zoom peta."
    },
    {
      id: 8,
      question: "Gaya visualisasi spasial manakah yang paling pas bersinergi dipadukan bersama heatmap?",
      options: [
        "Peta kontur tanah bergunung.",
        "Legenda warna interaktif yang menjelaskan rentang arti dari spektrum warna dingin (kepadatan rendah) hingga hangat (kepadatan tinggi).",
        "Model 3D animasi perputaran awan.",
        "Grafik garis fluktuasi nilai saham bulanan."
      ],
      correctAnswer: 1,
      explanation: "Tanpa legenda spektrum warna, pembaca peta tidak bisa memahami arti dari gradasi warna heatmap tersebut secara kuantitatif."
    },
    {
      id: 9,
      question: "Apakah heatmap cocok digunakan untuk memvisualisasikan data rute jalan raya (LineString) secara kartografis?",
      options: [
        "Sangat cocok, rute jalan memang seharusnya divisualisasikan dengan warna gradien panas.",
        "Tidak cocok, heatmap dirancang khusus untuk memvisualisasikan akumulasi densitas dari sebaran data bertipe koordinat Titik (Point).",
        "Cocok, asalkan garis jalan raya diubah warnanya menjadi merah solid terlebih dahulu.",
        "Bisa, asalkan data jalan raya disimpan dalam format file Shapefile zip."
      ],
      correctAnswer: 1,
      explanation: "Heatmap didesain untuk menghitung kerapatan titik per satuan luas. Untuk data jalan, gunakan visualisasi multiline tergradasi atau layer bertipe `line`."
    },
    {
      id: 10,
      question: "Use-case industri manakah di bawah ini yang sangat pas dianalisis menggunakan visualisasi heatmap?",
      options: [
        "Memantau status online server database.",
        "Menganalisis wilayah rawan kriminalitas (crime hotspot) di perkotaan berdasarkan konsentrasi titik laporan polisi.",
        "Mengukur kecepatan akses loading halaman frontend.",
        "Menghitung rasio kompresi data spasial GeoJSON."
      ],
      correctAnswer: 1,
      explanation: "Pemetaan sebaran kriminalitas, kecelakaan lalu lintas, atau persebaran pelanggan ritel adalah use-case klasik hotspot analysis menggunakan heatmap."
    }
  ],
  12: [
    {
      id: 1,
      question: "Apa tujuan utama dilakukannya analisis spasial 'Buffer' (Radius)?",
      options: [
        "Mencari nilai koordinat paling tengah dari sebuah poligon spasial.",
        "Membangun zona area poligon baru di sekeliling fitur spasial (bisa titik, garis, atau poligon) berdasarkan jarak radius jangkauan tertentu yang telah ditentukan.",
        "Memperkecil ukuran memori penyimpanan file GeoJSON.",
        "Mengatur skema warna basemap menjadi gelap-terang."
      ],
      correctAnswer: 1,
      explanation: "Buffering menciptakan zona jangkauan spasial yang sangat berguna untuk mengukur dampak pengaruh lokasi, seperti area terdampak kebisingan kereta atau radius antar kurir."
    },
    {
      id: 2,
      question: "Library JavaScript asinkronus open-source manakah yang sangat terkenal di industri untuk melakukan kalkulasi analisis spasial canggih (seperti buffering) langsung di sisi browser client?",
      options: ["Lodash", "Turf.js", "React.js", "Chart.js"],
      correctAnswer: 1,
      explanation: "Turf.js menyediakan ratusan fungsi manipulasi spasial GIS berstandar industri yang ditulis murni dalam JavaScript untuk dieksekusi cepat di client."
    },
    {
      id: 3,
      question: "Method bawaan Turf.js manakah yang dipanggil untuk menghasilkan geometri poligon zona jangkauan radius di sekitar titik?",
      options: ["turf.circle() / turf.buffer()", "turf.distance()", "turf.area()", "turf.intersect()"],
      correctAnswer: 0,
      explanation: "`turf.buffer(point, distance, options)` atau `turf.circle(center, radius, options)` menghasilkan poligon lingkaran spasial yang akurat di atas ellipsoid bumi."
    },
    {
      id: 4,
      question: "Bagaimana cara kita menampilkan poligon radius yang dihasilkan oleh Turf.js ke atas peta MapLibre?",
      options: [
        "Dengan mengekspornya ke format file .shp lokal di harddisk.",
        "Dengan memperbarui data di Source peta menggunakan method `map.getSource('id').setData(geojsonRadius)`.",
        "Dengan menulis ulang sintaks stylesheet globals.css.",
        "Dengan memanggil kembali perintah inisialisasi `new maplibregl.Map()`."
      ],
      correctAnswer: 1,
      explanation: "`setData(newData)` memperbarui isi data di source GeoJSON secara instan tanpa merusak state peta yang sedang berjalan, memicu render ulang geometri poligon baru."
    },
    {
      id: 5,
      question: "Di dalam method `turf.buffer()`, opsi properti manakah yang digunakan untuk menentukan unit satuan jarak (seperti 'kilometers', 'meters', atau 'miles')?",
      options: ["unit", "units", "measure", "scale"],
      correctAnswer: 1,
      explanation: "Properti `units` menerima nilai string standar (misal `units: 'kilometers'` atau `units: 'meters'`) untuk memvalidasi presisi jarak radius spasial."
    },
    {
      id: 6,
      question: "Mengapa disarankan mengatur tingkat transparansi (`fill-opacity`) yang cukup tipis pada layer poligon radius di atas peta?",
      options: [
        "Karena warna tebal akan membebani RAM komputer pengguna.",
        "Agar poligon radius tidak menutupi visualisasi basemap jalan atau titik-titik penting (POIs) di bawahnya, menjaga keterbacaan peta yang baik.",
        "Karena MapLibre tidak mendukung poligon dengan warna pekat 100%.",
        "Agar poligon radius otomatis ter-update lebih cepat."
      ],
      correctAnswer: 1,
      explanation: "Menjaga opacity poligon di angka 0.15 s.d. 0.3 menjamin user tetap dapat melihat jalan, nama gedung, dan POI penting di balik cakupan radius jangkauan."
    },
    {
      id: 7,
      question: "Method Turf.js manakah yang digunakan untuk menghitung jarak lurus geografis antara dua titik koordinat spasial di bumi?",
      options: ["turf.distance()", "turf.buffer()", "turf.midpoint()", "turf.length()"],
      correctAnswer: 0,
      explanation: "`turf.distance(point1, point2, options)` menghitung jarak garis lengkung terpendek di permukaan bola bumi (great-circle distance)."
    },
    {
      id: 8,
      question: "Konsep GIS manakah yang memotong sekumpulan data titik berdasarkan batas poligon radius yang aktif (misal menyaring minimarket yang masuk di radius 1 km)?",
      options: ["Spatial Buffering", "Spatial Join / Point-in-Polygon (turf.booleanPointInPolygon)", "Coordinate Projection", "BBOX Clipping"],
      correctAnswer: 1,
      explanation: "Pemeriksaan Point-in-Polygon (`turf.booleanPointInPolygon`) menyaring titik-titik spasial mana saja yang secara geometris berada di dalam perimeter poligon radius jangkauan."
    },
    {
      id: 9,
      question: "Use-case komersial manakah di bawah ini yang memanfaatkan analisis radius?",
      options: [
        "Mengukur total durasi pemutaran musik di website.",
        "Menampilkan wilayah jangkauan pesan-antar restoran (misal radius pengiriman 5 kilometer dari outlet) untuk memvalidasi pesanan pelanggan.",
        "Menghitung jumlah kata pada artikel di halaman web.",
        "Mendeteksi tipe sistem operasi yang dipakai pengguna."
      ],
      correctAnswer: 1,
      explanation: "Bisnis kuliner dan e-commerce lokal memanfaatkan radius jangkauan spasial untuk menentukan jangkauan operasional pengiriman logistik secara efisien."
    },
    {
      id: 10,
      question: "Apa keuntungan utama melakukan pemrosesan analisis spasial (seperti radius Turf.js) di browser client (client-side) dibandingkan mengirimkannya ke server backend (server-side)?",
      options: [
        "Hasil analisis dijamin 100% bebas dari risiko bug program.",
        "Interaktivitas instan tanpa jeda tunggu pengiriman data lewat internet (zero network latency), menghemat beban kerja komputasi server utama.",
        "Client-side otomatis mengamankan data dari serangan hacker global.",
        "Tidak perlu menulis kode program JavaScript."
      ],
      correctAnswer: 1,
      explanation: "Dengan menghitung di browser pengguna via Turf.js, peta merespon geseran kursor radius secara real-time tanpa perlu bolak-balik mengirim request ke database server."
    }
  ],
  13: [
    {
      id: 1,
      question: "Apa definisi yang paling tepat mengenai 'Isochrone' dalam analisis transportasi spasial?",
      options: [
        "Garis atau poligon di atas peta yang menghubungkan titik-titik dengan waktu tempuh perjalanan yang sama menuju satu lokasi pusat, menggunakan moda transportasi tertentu.",
        "Alat pengukur tingkat kemiringan permukaan lereng bukit spasial.",
        "Metode kompresi database spasial berkecepatan tinggi.",
        "Tingkat transparansi warna pada peta satelit."
      ],
      correctAnswer: 0,
      explanation: "Isochrone berasal dari kata Yunani 'isos' (sama) dan 'chronos' (waktu). Poligon Isochrone memetakan jangkauan area tempuh nyata berbasis jaringan jalan raya."
    },
    {
      id: 2,
      question: "Apa perbedaan krusial antara analisis radius lingkaran biasa (Buffer) dengan analisis Isochrone?",
      options: [
        "Radius buffer dihitung menggunakan satuan waktu, sedangkan Isochrone menggunakan satuan kilometer.",
        "Radius buffer dihitung berdasarkan jarak lurus udara ('as the crow flies') mengabaikan rintangan; sedangkan Isochrone dihitung berdasarkan jaringan jalan riil, kecepatan kendaraan, hambatan lalu lintas, dan arah jalan satu arah.",
        "Buffer selalu menghasilkan bentuk poligon yang tidak beraturan sedangkan Isochrone selalu lingkaran sempurna.",
        "Isochrone hanya bisa dihitung menggunakan data spasial berformat Shapefile."
      ],
      correctAnswer: 1,
      explanation: "Radius udara mengabaikan hambatan fisik (sungai, gedung, dsb). Isochrone menyajikan jangkauan berkendara yang jauh lebih realistis karena mematuhi aturan jaringan jalan nyata."
    },
    {
      id: 3,
      question: "Bagaimana sebuah aplikasi WebGIS frontend mendapatkan poligon Isochrone secara dinamis?",
      options: [
        "Dengan menghitung rumus matematika jalan menggunakan loop JavaScript di client-side.",
        "Melakukan request asinkronus (fetch API) ke API Isochrone eksternal (seperti MAPID Isochrone API, OpenRouteService, atau Mapbox API) dengan mengirim titik pusat dan parameter waktu tempuh.",
        "Menggambar poligon secara manual menggunakan digitize tool di layar.",
        "Membaca file citra satelit raster yang tersimpan di server lokal."
      ],
      correctAnswer: 1,
      explanation: "Perhitungan rute jaringan jalan sangat kompleks dan membutuhkan database jaringan jalan global. Frontend cukup mengirim koordinat pusat dan menerima poligon GeoJSON hasil kalkulasi server API."
    },
    {
      id: 4,
      question: "Di dalam pemanggilan API Isochrone, parameter input apa saja yang umumnya wajib kita kirimkan?",
      options: [
        "Username database dan password admin.",
        "Koordinat titik pusat (`[bujur, lintang]`), waktu batas tempuh (misal '15 menit'), dan moda transportasi (jalan kaki, motor, mobil).",
        "Lebar resolusi monitor layar client dan versi sistem operasi.",
        "Nama basemap yang sedang diaktifkan di MapLibre."
      ],
      correctAnswer: 1,
      explanation: "Parameter utama ini dibutuhkan mesin kalkulasi routing untuk menelusuri segmen jaringan jalan yang relevan dan menghitung batas akumulasi waktu tempuh."
    },
    {
      id: 5,
      question: "Format data spasial apakah yang dikembalikan oleh API Isochrone untuk kemudian dirender sebagai layer poligon di MapLibre?",
      options: ["GeoJSON berjenis Polygon / MultiPolygon", "Citra gambar raster PNG transparan", "File biner DXF AutoCAD", "Kumpulan teks koordinat mentah CSV"],
      correctAnswer: 0,
      explanation: "Respons berformat GeoJSON dengan geometri Polygon atau MultiPolygon sangat mudah di-parse dan langsung dimasukkan ke source peta MapLibre."
    },
    {
      id: 6,
      question: "Use-case perencanaan tata kota (smart city) manakah yang paling ideal memanfatkan analisis Isochrone?",
      options: [
        "Menghitung rasio pajak daerah tahunan.",
        "Menganalisis jangkauan layanan fasilitas kesehatan darurat (akses rumah sakit dalam batas waktu tanggap darurat berkendara 10 dan 15 menit).",
        "Membuat sistem absensi kehadiran online pegawai kelurahan.",
        "Mempercepat proses load data peta dasar."
      ],
      correctAnswer: 1,
      explanation: "Analisis isochrone membantu tata kota menilai aksesibilitas fasilitas umum vital agar merata dijangkau masyarakat dalam rentang waktu yang aman."
    },
    {
      id: 7,
      question: "Bagaimana cara menampilkan visualisasi bertumpuk dari area jangkauan isochrone waktu yang berbeda (misal 5 menit hijau, 10 menit kuning, 15 menit merah)?",
      options: [
        "Dengan membuat 3 halaman website yang terpisah.",
        "Dengan merender poligon-poligon waktu tersebut secara bertumpuk di peta, memastikan poligon waktu terbesar (15 menit) diletakkan di paling bawah agar tidak menutupi poligon kecil.",
        "Dengan memadukan warna poligon menjadi hitam pekat.",
        "Dengan mengunduh file video animasi perjalanan kurir."
      ],
      correctAnswer: 1,
      explanation: "Poligon jangkauan yang lebih kecil (waktu tempuh singkat) harus ditumpuk di atas poligon besar agar tidak tersembunyi/tertutupi (occlusion)."
    },
    {
      id: 8,
      question: "Moda transportasi manakah yang biasanya menghasilkan poligon Isochrone paling luas pada batas waktu tempuh yang sama (misal sama-sama 15 menit)?",
      options: [
        "Jalan Kaki (Walking)",
        "Sepeda (Cycling)",
        "Sepeda Motor / Mobil (Driving)",
        "Semuanya menghasilkan luas poligon yang identik"
      ],
      correctAnswer: 2,
      explanation: "Kecepatan berkendara mobil/motor di jalan raya jauh lebih tinggi dibanding jalan kaki, sehingga mampu menempuh segmen jalan yang lebih jauh dalam rentang waktu yang sama."
    },
    {
      id: 9,
      question: "Hambatan fisik di lapangan manakah yang otomatis dihitung oleh algoritma routing Isochrone saat membatasi area jangkauan?",
      options: [
        "Suhu udara rata-rata perkotaan.",
        "Jaringan jalan searah (one-way streets), kemacetan lalu lintas, jembatan penyeberangan sungai, dan pembatas jalan toll.",
        "Warna marka jalan raya.",
        "Merek kendaraan yang dikendarai oleh pengguna."
      ],
      correctAnswer: 1,
      explanation: "Algoritma pencarian jalur terpendek (seperti Dijkstra atau A*) pada grafik jalan raya memperhitungkan batasan bobot (weight) hukum lalu lintas fisik jalan."
    },
    {
      id: 10,
      question: "Mengapa visualisasi Isochrone sangat bernilai tinggi dalam studi penentuan lokasi gerai ritel komersial baru?",
      options: [
        "Karena visualisasi Isochrone otomatis mendatangkan investasi modal gratis.",
        "Karena menyajikan pemetaan jangkauan konsumen riil yang logis berdasarkan kemudahan waktu perjalanan mereka menuju toko, bukan sekadar jarak burung linear.",
        "Karena Isochrone mempercepat rendering visual peta hingga 10 kali lipat.",
        "Karena data isochrone dijamin tidak pernah berubah selamanya."
      ],
      correctAnswer: 1,
      explanation: "Konsumen berbelanja berdasarkan kemudahan akses waktu tempuh berkendara riil. Analisis isochrone memetakan 'Catchment Area' (area tangkapan pasar) bisnis secara akurat."
    }
  ],
  14: [
    {
      id: 1,
      question: "Apa tujuan utama dari proses 'Refinement' dalam pengembangan WebGIS?",
      options: [
        "Mengganti seluruh library JavaScript menjadi bahasa Python spasial.",
        "Mengoptimalkan kode sumber, membersihkan asset, mempercepat waktu memuat (loading), menyempurnakan interaktivitas UX, dan memastikan kesiapan deployment produk.",
        "Menghapus seluruh fitur peta agar website menjadi lebih ringan.",
        "Membuat dokumentasi petunjuk penggunaan dalam format cetak tebal."
      ],
      correctAnswer: 1,
      explanation: "Refinement merapikan sisi arsitektur kode, merampingkan file, menangani edge-cases, dan memoles elemen visual agar layak dipamerkan sebagai portofolio profesional."
    },
    {
      id: 2,
      question: "Mengapa kita disarankan menampilkan komponen 'Loading Skeleton' atau 'Progress Spinner' saat peta sedang diinisialisasi?",
      options: [
        "Untuk mempercepat koneksi internet client secara otomatis.",
        "Memberikan umpan balik visual (feedback) yang baik bagi pengguna agar mereka tahu bahwa aplikasi sedang memproses pemuatan peta/data spasial, mencegah kebingungan layar kosong.",
        "Karena MapLibre mewajibkan keberadaan spinner agar peta bisa merender.",
        "Untuk menyembunyikan log error JavaScript di console."
      ],
      correctAnswer: 1,
      explanation: "UX loading state yang baik mencegah pengguna mengira aplikasi web rusak/hang saat sedang mengunduh ubin peta dasar atau data spasial berukuran besar."
    },
    {
      id: 3,
      question: "Manakah tindakan optimasi performa WebGIS yang paling tepat untuk menangani file GeoJSON yang berukuran terlalu besar (misal > 50 Megabytes)?",
      options: [
        "Mengompres data dengan mengubah ekstensi file menjadi .zip lalu dipanggil langsung oleh fetch API.",
        "Melakukan penyederhanaan geometri poligon (simplification via QGIS/Mapshaper), menyaring atribut yang tidak perlu, atau mengonversi data menjadi format Vector Tiles spasial.",
        "Menghapus setengah koordinat titik secara acak menggunakan Notepad.",
        "Menurunkan tingkat resolusi warna monitor laptop client."
      ],
      correctAnswer: 1,
      explanation: "GeoJSON besar membebani bandwidth dan RAM browser client. Teknik simplifikasi menyederhanakan titik geometri tanpa merusak bentuk dasar kartografinya secara signifikan."
    },
    {
      id: 4,
      question: "Mengapa kredensial rahasia (seperti Database Password) tidak boleh ditulis langsung (hardcoded) secara terang-terangan di file JavaScript frontend?",
      options: [
        "Karena browser akan otomatis memblokir file JavaScript tersebut.",
        "Karena kode JavaScript frontend dikirimkan utuh ke browser client, sehingga siapa saja dapat mengintip kredensial tersebut dengan mudah melalui fitur View Source / Developer Tools, memicu ancaman kebocoran database spasial privat.",
        "Karena kredensial rahasia memicu peningkatan beban komputasi CPU browser.",
        "Karena MapLibre tidak mendukung koneksi database terenkripsi."
      ],
      correctAnswer: 1,
      explanation: "Sisi client (frontend) tidak pernah aman untuk menyimpan rahasia. Operasi sensitif database wajib ditangani backend server yang dilindungi kredensial aman."
    },
    {
      id: 5,
      question: "Platform hosting modern open-source manakah yang sangat disukai developer untuk mendeploy website frontend HTML/CSS/JS statis secara gratis, cepat, dan otomatis terhubung ke repositori GitHub?",
      options: ["PostgreSQL cloud", "Netlify / GitHub Pages / Vercel", "QGIS Desktop Server", "Anaconda Python Suite"],
      correctAnswer: 1,
      explanation: "Platform seperti Netlify, Vercel, dan GitHub Pages dirancang untuk menghosting aset frontend statis langsung dari repositori Git secara efisien dan aman."
    },
    {
      id: 6,
      question: "Dalam pengembangan web modern, apa fungsi dari file `.env`?",
      options: [
        "Menyimpan baris kode logika animasi css.",
        "Menyimpan variabel lingkungan (environment variables) seperti API key atau URL server backend secara terpisah dari kode sumber utama, memudahkan manajemen konfigurasi antar environment (dev, production).",
        "Mengatur ukuran resolusi visual peta dasar.",
        "Mengompres ukuran gambar basemap."
      ],
      correctAnswer: 1,
      explanation: "File `.env` menampung parameter konfigurasi dinamis. Di platform hosting, kita dapat mengatur variabel lingkungan ini pada dashboard deployment tanpa membeberkannya di repositori publik."
    },
    {
      id: 7,
      question: "Command npm manakah yang dijalankan untuk memvalidasi kualitas kode dan menangkap kesalahan sintaksis/struktur error di proyek Next.js sebelum build?",
      options: ["npm run dev", "npm run lint", "npm run start", "npm run clean"],
      correctAnswer: 1,
      explanation: "`npm run lint` memicu ESLint untuk memindai file kode, mendeteksi variabel yang tidak terpakai, sintaks rusak, atau pelanggaran best-practice standar coding."
    },
    {
      id: 8,
      question: "Command npm manakah yang dijalankan untuk mengompilasi dan membangun aplikasi Next.js menjadi paket bundel produksi (production bundle) siap saji yang optimal?",
      options: ["npm run build", "npm run dev", "npm run watch", "npm run debug"],
      correctAnswer: 0,
      explanation: "`npm run build` melakukan optimasi kompilasi, minifikasi JS/CSS, optimasi gambar, dan menghasilkan halaman statis (SSG/ISR) yang super cepat."
    },
    {
      id: 9,
      question: "Apa kriteria minimum yang wajib dipenuhi agar proyek WebGIS dinilai siap dipublikasikan (portfolio-ready)?",
      options: [
        "Aplikasi harus memiliki minimal 10 halaman menu yang sangat panjang.",
        "Memiliki visual antarmuka (UI/UX) yang bersih rapi, peta interaktif lancar dimuat, fungsionalitas spasial berjalan tanpa bug error di console, serta dideploy secara publik dengan link akses aktif.",
        "Menggunakan database PostgreSQL lokal yang tidak terhubung ke hosting cloud.",
        "Kode sumber disembunyikan seluruhnya dari publik secara total."
      ],
      correctAnswer: 1,
      explanation: "Portfolio yang menarik bagi industri adalah portfolio yang memiliki problem-solving context yang jelas, fungsional, dan dapat diakses langsung oleh rekruter secara online."
    },
    {
      id: 10,
      question: "Mengapa penting bagi seorang praktisi WebGIS untuk menulis dokumentasi ringkas (README) pada repositori GitHub proyek mereka?",
      options: [
        "README wajib diisi agar file JavaScript bisa terbaca oleh web server.",
        "Membantu orang lain (dan calon rekruter) memahami dengan cepat: tujuan aplikasi WebGIS dibuat, masalah apa yang diselesaikan, cara kerja arsitektur sistem, teknologi tools yang digunakan, serta panduan instalasi lokal.",
        "README digunakan untuk menyimpan API key rahasia agar aman.",
        "Untuk meningkatkan nilai peringkat di papan skor kuis secara otomatis."
      ],
      correctAnswer: 1,
      explanation: "Dokumentasi README.md yang terstruktur dengan baik mencerminkan profesionalisme engineering, mempermudah kolaborasi tim, dan meningkatkan nilai jual portofolio karir."
    }
  ],
  15: [
    {
      id: 1,
      question: "Apa peran utama bahasa pemrograman Python di industri pengolahan data spasial (GIS)?",
      options: [
        "Merender antarmuka peta interaktif di dalam browser client secara real-time.",
        "Mengolah, menganalisis, membersihkan data spasial skala besar, serta melakukan preprocessing data spasial secara otomatis di sisi backend / data engineering.",
        "Menggantikan fungsi HTML/CSS dalam merancang tombol website.",
        "Meningkatkan kecepatan jaringan internet server hosting."
      ],
      correctAnswer: 1,
      explanation: "Python memiliki ekosistem library geospasial yang sangat perkasa untuk mengotomatisasi pemrosesan data, kalkulasi statistik spasial berat, dan data warehousing."
    },
    {
      id: 2,
      question: "Library Python manakah yang bertindak sebagai standar utama industri untuk membaca, menulis, dan memanipulasi data spasial vektor (seperti tabel koordinat) layaknya Pandas?",
      options: ["Matplotlib", "GeoPandas", "Shapely", "Fiona"],
      correctAnswer: 1,
      explanation: "GeoPandas memperluas kemampuan Pandas dengan menambahkan kolom khusus `geometry` untuk menampung objek spasial dan mendukung operasi GIS secara tabular."
    },
    {
      id: 3,
      question: "Library Python manakah yang bertugas menangani kalkulasi matematika geometri spasial dasar (seperti menghitung centroid, irisan poligon, atau jarak) secara internal di belakang GeoPandas?",
      options: ["NumPy", "Shapely", "PyProj", "Rasterio"],
      correctAnswer: 1,
      explanation: "Shapely fokus pada manipulasi dan analisis geometri spasial planar, melakukan operasi topologis berstandar OGC."
    },
    {
      id: 4,
      question: "Dalam Python, representasi tipe data spasial vektor tabel lengkap dengan kolom geometrinya ditampung di dalam objek...",
      options: ["DataFrame", "GeoDataFrame", "GeoSeries", "SpatialArray"],
      correctAnswer: 1,
      explanation: "GeoDataFrame adalah struktur data tabular utama di GeoPandas yang wajib memiliki minimal satu kolom geometri spasial aktif."
    },
    {
      id: 5,
      question: "Method GeoPandas manakah yang dipanggil untuk memuat (membaca) file spasial eksternal (misal .geojson atau Shapefile) langsung menjadi sebuah GeoDataFrame?",
      options: ["gpd.read_file()", "gpd.load_spatial()", "gpd.read_geojson()", "gpd.open()"],
      correctAnswer: 0,
      explanation: "`gpd.read_file('path_ke_file')` otomatis mengenali format file spasial biner maupun teks berkat dukungan engine fiona di belakangnya."
    },
    {
      id: 6,
      question: "Properti atau kolom khusus wajib manakah yang melambangkan koordinat objek spasial di dalam sebuah GeoDataFrame?",
      options: ["coordinates", "geometry", "shape", "geom_type"],
      correctAnswer: 1,
      explanation: "Kolom `geometry` menampung objek-objek geometri spasial (Point, LineString, Polygon) yang diproses menggunakan engine Shapely."
    },
    {
      id: 7,
      question: "Bagaimana cara mengekspor (menyimpan) kembali data spasial yang telah diolah di GeoPandas menjadi file GeoJSON agar siap digunakan di WebGIS frontend kita?",
      options: [
        "gdf.save_file('output.geojson', format='json')",
        "gdf.to_file('output.geojson', driver='GeoJSON')",
        "gdf.write_geojson('output.geojson')",
        "gdf.export('output.geojson')"
      ],
      correctAnswer: 1,
      explanation: "Method `to_file()` memfasilitasi penulisan GeoDataFrame kembali ke file fisik disk, di mana penentuan `driver='GeoJSON'` menjamin keluaran berformat teks GeoJSON standar."
    },
    {
      id: 8,
      question: "Library Python manakah yang bertindak khusus menangani proses proyeksi koordinat dan transformasi EPSG secara presisi?",
      options: ["PyProj", "Shapely", "Fiona", "Geopy"],
      correctAnswer: 0,
      explanation: "PyProj adalah interface Python untuk pustaka komputasi proyeksi kartografi PROJ, sangat krusial dalam mengonversi koordinat antar EPSG."
    },
    {
      id: 9,
      question: "Use-case integrasi Python spasial dan WebGIS yang paling efisien di industri adalah...",
      options: [
        "Merancang tata letak CSS grid dashboard.",
        "Membuat script ETL (Extract-Transform-Load) otomatis yang mengunduh data satelit berkala, melakukan komputasi analisis spasial rumit dengan Python, lalu mengirimkan hasilnya ke API GEO MAPID secara terjadwal untuk segera ditampilkan di peta WebGIS client.",
        "Mendeteksi masukan email pengguna di form login.",
        "Mengurangi tingkat resolusi visual peta dasar."
      ],
      correctAnswer: 1,
      explanation: "Python unggul dalam pemrosesan data backend / pipeline otomatis. Python mengolah 'big data' spasial yang rumit di balik layar, lalu menyuplai data siap saji yang ringan ke WebGIS frontend."
    },
    {
      id: 10,
      question: "Method GeoDataFrame manakah yang digunakan untuk memproyeksikan ulang (transformasi CRS) sistem koordinat data spasial (misal dari EPSG:4326 derajat menjadi EPSG:3857 meter)?",
      options: ["gdf.set_crs()", "gdf.to_crs()", "gdf.project()", "gdf.reproject()"],
      correctAnswer: 1,
      explanation: "`to_crs(epsg=3857)` menghitung ulang seluruh titik geometri spasial di GeoDataFrame ke sistem referensi koordinat target terproyeksi secara matematis."
    }
  ]
};
