// i18n — kamus bilingual Indonesia/Inggris untuk seluruh UI
// Semua teks UI (label, placeholder, pesan error, toast) wajib lewat fungsi t().

export type Lang = 'id' | 'en'

const id = {
  // Umum
  'app.brand': 'Sudo Squad',
  'app.name': 'Survei Akademik',
  'lang.id': 'ID',
  'lang.en': 'EN',
  'badge.optional': 'Opsional',
  'common.notAnswered': 'Tidak dijawab',
  'footer.text': 'Dibuat oleh Tim Sudo Squad · Data hanya untuk keperluan lomba',
  'footer.copyright': '© 2025 Sudo Squad',

  // Halaman survei
  'survey.title':
    'Survei Pengelolaan Jadwal & Informasi Akademik Mahasiswa',
  'survey.desc':
    'Survei ini dibuat oleh tim Sudo Squad untuk memahami kendala mahasiswa dalam memantau jadwal dan tugas. Waktu pengisian sekitar 3 menit. Data hanya digunakan untuk keperluan lomba.',
  'results.link': 'Lihat hasil survei',
  'results.title': 'Hasil Survei Akademik',
  'results.description': 'Ringkasan jawaban mahasiswa tentang jadwal dan informasi akademik.',
  'results.privacy': 'Halaman ini hanya menampilkan data agregat, tanpa jawaban atau kontak individu.',
  'results.responseCount': 'Total Respons',
  'results.avgWifi': 'Rata-rata hambatan Wi-Fi · Q8',
  'results.avgStudy': 'Rata-rata kesulitan tempat belajar · Q9',
  'results.avgOverall': 'Rata-rata manfaat solusi · Q12',
  'results.outOf5': 'dari 5',
  'results.groups': 'Jumlah Grup WhatsApp · Q4',
  'results.trial': 'Kesediaan Uji Coba · Q13',
  'results.loading': 'Memuat ringkasan hasil…',
  'results.loadError': 'Hasil survei tidak dapat dimuat.',
  'results.retry': 'Coba Lagi',
  'results.empty': 'Belum ada respons. Hasil akan muncul setelah respons pertama masuk.',
  'results.backToSurvey': 'Kembali ke survei',
  'progress.part': 'Bagian {x} dari 3',
  'section1.title': 'Data Responden',
  'section2.title': 'Masalah yang Pernah Dialami',
  'section3.title': 'Tanggapan terhadap Solusi',

  'q1.title': 'Status mahasiswa',
  'q2.title': 'Angkatan',
  'q2.placeholder': 'Pilih angkatan',
  'q3.title': 'Program studi',
  'q3.placeholder': 'cth: Teknik Informatika',

  'q4.title':
    'Berapa grup WhatsApp akademik (kelas, praktikum, angkatan) yang Anda ikuti?',
  'q5.title':
    'Dari mana saja Anda biasanya menerima informasi jadwal dan tugas?',
  'q5.otherPlaceholder': 'Tuliskan sumber lainnya…',
  'q6.title':
    'Dalam satu semester ini, apakah Anda pernah mengalami hal berikut?',
  'q7.title': 'Menurut Anda, apa penyebab utamanya?',
  'q7.otherPlaceholder': 'Tuliskan penyebab lainnya…',
  'q8.title':
    'Seberapa sering Wi-Fi kampus menghambat Anda mengerjakan tugas?',
  'q8.left': 'Tidak pernah',
  'q8.right': 'Sangat sering',
  'q9.title':
    'Seberapa sulit menemukan tempat belajar yang tidak ramai di kampus?',
  'q9.left': 'Sangat mudah',
  'q9.right': 'Sangat sulit',
  'q10.title':
    'Khusus mahasiswa internasional: seberapa sulit memahami pengumuman akademik dalam bahasa Indonesia?',
  'q10.left': 'Sangat mudah',
  'q10.right': 'Sangat sulit',

  'intro3.body':
    'Kami merencanakan aplikasi yang mengumpulkan jadwal kuliah, praktikum, bimbingan, dan tenggat tugas dalam satu tempat, dilengkapi pengingat otomatis, info perubahan kelas dari ketua kelas dan asisten lab, info keramaian area kampus dan Wi-Fi, serta pilihan bahasa Indonesia/Inggris.',
  'q11.title': 'Seberapa membantu fitur berikut bagi Anda?',
  'q12.title': 'Secara keseluruhan, apakah aplikasi ini akan membantu Anda?',
  'q12.left': 'Tidak membantu',
  'q12.right': 'Sangat membantu',
  'q13.title':
    'Apakah Anda bersedia mencoba aplikasi ini selama uji coba dua minggu?',
  'q14.title': 'Fitur apa yang belum ada tetapi Anda butuhkan?',
  'q14.placeholder': 'Tuliskan fitur yang Anda butuhkan…',
  'q15.title': 'Masukkan alamat email aktif Anda.',
  'q15.placeholder': 'email@contoh.com',

  // Validasi
  'error.required': 'Wajib diisi',
  'error.selectOne': 'Pilih minimal satu opsi',
  'error.answerAll': 'Jawab semua baris',
  'error.invalidEmail': 'Masukkan alamat email yang valid',
  'matrix.answered': '{a}/{b} terjawab',

  // Tombol
  'btn.next': 'Lanjut',
  'btn.back': 'Kembali',
  'btn.submit': 'Kirim Survei',
  'btn.submitting': 'Mengirim…',

  // Terima kasih
  'thanks.title': 'Terima kasih!',
  'thanks.body':
    'Respons Anda sudah kami terima dan akan sangat membantu tim Sudo Squad dalam mengembangkan aplikasi ini.',
  'thanks.again': 'Isi survei lagi',

  // Toast
  'toast.success': 'Survei berhasil dikirim!',
  'toast.error': 'Gagal mengirim survei. Silakan coba lagi.',

  // Admin — login
  'admin.login.title': 'Login Admin',
  'admin.login.subtitle':
    'Masukkan password untuk melihat hasil survei.',
  'admin.login.label': 'Password',
  'admin.login.placeholder': 'Masukkan password',
  'admin.login.submit': 'Masuk',
  'admin.login.submitting': 'Memeriksa…',
  'admin.login.error': 'Password salah. Coba lagi.',
  'admin.login.back': 'Kembali ke survei',

  // Admin — dashboard
  'admin.dash.title': 'Dashboard Admin',
  'admin.dash.subtitle': 'Hasil Survei Akademik',
  'admin.dash.total': 'Total Respons',
  'admin.dash.avgWifi': 'Rata-rata Q8 · Wi-Fi',
  'admin.dash.avgStudy': 'Rata-rata Q9 · Belajar',
  'admin.dash.avgOverall': 'Rata-rata Q12 · Manfaat',
  'admin.dash.outOf5': 'dari 5',
  'admin.dash.distQ4': 'Distribusi Q4 · Jumlah Grup WA',
  'admin.dash.distQ13': 'Distribusi Q13 · Bersedia Uji Coba',
  'admin.dash.responses': '{n} respons',
  'admin.dash.filterStatus': 'Status Mahasiswa',
  'admin.dash.filterAngkatan': 'Angkatan',
  'admin.dash.filterProdi': 'Cari program studi…',
  'admin.dash.all': 'Semua',
  'admin.dash.col.date': 'Tanggal',
  'admin.dash.col.status': 'Status',
  'admin.dash.col.angkatan': 'Angkatan',
  'admin.dash.col.prodi': 'Program Studi',
  'admin.dash.col.score': 'Manfaat (Q12)',
  'admin.dash.showing': 'Menampilkan {n} dari {m} respons',
  'admin.dash.empty': 'Belum ada respons survei.',
  'admin.dash.emptyFiltered': 'Tidak ada respons yang cocok dengan filter.',
  'admin.dash.loading': 'Memuat data…',
  'admin.dash.loadError': 'Gagal memuat data.',
  'admin.dash.retry': 'Coba Lagi',
  'admin.dash.export': 'Export CSV',
  'admin.dash.logout': 'Keluar',
  'admin.dash.detail.title': 'Detail Respons',
  'admin.dash.detail.subtitle': 'Seluruh jawaban responden per bagian',
  'admin.dash.close': 'Tutup',

  // Toast admin
  'admin.toast.welcome': 'Login berhasil. Selamat datang!',
  'admin.toast.logout': 'Anda telah keluar.',
} as const

export type TKey = keyof typeof id

const en: Record<TKey, string> = {
  // General
  'app.brand': 'Sudo Squad',
  'app.name': 'Academic Survey',
  'lang.id': 'ID',
  'lang.en': 'EN',
  'badge.optional': 'Optional',
  'common.notAnswered': 'Not answered',
  'footer.text': 'Built by Team Sudo Squad · Data used for a competition only',
  'footer.copyright': '© 2025 Sudo Squad',

  // Survey page
  'survey.title': 'Academic Schedule & Information Survey',
  'survey.desc':
    'This survey takes about 3 minutes. Data is used only for our competition project.',
  'results.link': 'View survey results',
  'results.title': 'Academic Survey Results',
  'results.description': 'A summary of student responses about academic schedules and information.',
  'results.privacy': 'This page shows aggregate data only, with no individual answers or contact details.',
  'results.responseCount': 'Total Responses',
  'results.avgWifi': 'Average Wi-Fi difficulty · Q8',
  'results.avgStudy': 'Average study-space difficulty · Q9',
  'results.avgOverall': 'Average solution usefulness · Q12',
  'results.outOf5': 'out of 5',
  'results.groups': 'WhatsApp Group Count · Q4',
  'results.trial': 'Trial Willingness · Q13',
  'results.loading': 'Loading results summary…',
  'results.loadError': 'Survey results could not be loaded.',
  'results.retry': 'Retry',
  'results.empty': 'There are no responses yet. Results will appear after the first response.',
  'results.backToSurvey': 'Back to survey',
  'progress.part': 'Section {x} of 3',
  'section1.title': 'Respondent Data',
  'section2.title': 'Problems Experienced',
  'section3.title': 'Response to the Solution',

  'q1.title': 'Student status',
  'q2.title': 'Year of entry',
  'q2.placeholder': 'Select your year',
  'q3.title': 'Study program',
  'q3.placeholder': 'e.g. Computer Science',

  'q4.title': 'How many academic WhatsApp groups are you in?',
  'q5.title': 'Where do you usually get schedule and assignment info?',
  'q5.otherPlaceholder': 'Describe the other source…',
  'q6.title': 'This semester, have you experienced the following?',
  'q7.title': 'What do you think is the main cause?',
  'q7.otherPlaceholder': 'Describe the other cause…',
  'q8.title': 'How often does campus Wi-Fi slow down your work?',
  'q8.left': 'Never',
  'q8.right': 'Very often',
  'q9.title': 'How hard is it to find a quiet study spot on campus?',
  'q9.left': 'Very easy',
  'q9.right': 'Very hard',
  'q10.title':
    'International students only: how hard is it to understand announcements in Indonesian?',
  'q10.left': 'Very easy',
  'q10.right': 'Very hard',

  'intro3.body':
    'We are planning an app that gathers class, lab, and advising schedules plus assignment deadlines in one place, with automatic reminders, class-change updates from class reps and lab assistants, campus crowd and Wi-Fi info, and Indonesian/English language options.',
  'q11.title': 'How helpful would these features be?',
  'q12.title': 'Overall, would this app help you?',
  'q12.left': 'Not helpful',
  'q12.right': 'Very helpful',
  'q13.title': 'Would you join a two-week trial?',
  'q14.title': 'What feature is missing that you need?',
  'q14.placeholder': 'Describe the feature you need…',
  'q15.title': 'Enter your active email address.',
  'q15.placeholder': 'email@example.com',

  // Validation
  'error.required': 'This field is required',
  'error.selectOne': 'Select at least one option',
  'error.answerAll': 'Answer all rows',
  'error.invalidEmail': 'Enter a valid email address',
  'matrix.answered': '{a}/{b} answered',

  // Buttons
  'btn.next': 'Next',
  'btn.back': 'Back',
  'btn.submit': 'Submit Survey',
  'btn.submitting': 'Submitting…',

  // Thank you
  'thanks.title': 'Thank you!',
  'thanks.body':
    'Your response has been received and will greatly help the Sudo Squad team build this app.',
  'thanks.again': 'Fill the survey again',

  // Toast
  'toast.success': 'Survey submitted successfully!',
  'toast.error': 'Failed to submit the survey. Please try again.',

  // Admin — login
  'admin.login.title': 'Admin Login',
  'admin.login.subtitle': 'Enter the password to view survey results.',
  'admin.login.label': 'Password',
  'admin.login.placeholder': 'Enter password',
  'admin.login.submit': 'Sign in',
  'admin.login.submitting': 'Checking…',
  'admin.login.error': 'Incorrect password. Try again.',
  'admin.login.back': 'Back to survey',

  // Admin — dashboard
  'admin.dash.title': 'Admin Dashboard',
  'admin.dash.subtitle': 'Academic Survey Results',
  'admin.dash.total': 'Total Responses',
  'admin.dash.avgWifi': 'Avg. Q8 · Wi-Fi',
  'admin.dash.avgStudy': 'Avg. Q9 · Study Spot',
  'admin.dash.avgOverall': 'Avg. Q12 · Overall',
  'admin.dash.outOf5': 'out of 5',
  'admin.dash.distQ4': 'Q4 · WhatsApp Groups',
  'admin.dash.distQ13': 'Q13 · Trial Willingness',
  'admin.dash.responses': '{n} responses',
  'admin.dash.filterStatus': 'Student Status',
  'admin.dash.filterAngkatan': 'Year of Entry',
  'admin.dash.filterProdi': 'Search study program…',
  'admin.dash.all': 'All',
  'admin.dash.col.date': 'Date',
  'admin.dash.col.status': 'Status',
  'admin.dash.col.angkatan': 'Year',
  'admin.dash.col.prodi': 'Study Program',
  'admin.dash.col.score': 'Helpfulness (Q12)',
  'admin.dash.showing': 'Showing {n} of {m} responses',
  'admin.dash.empty': 'No survey responses yet.',
  'admin.dash.emptyFiltered': 'No responses match the filters.',
  'admin.dash.loading': 'Loading data…',
  'admin.dash.loadError': 'Failed to load data.',
  'admin.dash.retry': 'Retry',
  'admin.dash.export': 'Export CSV',
  'admin.dash.logout': 'Logout',
  'admin.dash.detail.title': 'Response Detail',
  'admin.dash.detail.subtitle': 'All answers of this respondent, per section',
  'admin.dash.close': 'Close',

  // Admin toast
  'admin.toast.welcome': 'Login successful. Welcome!',
  'admin.toast.logout': 'You have been logged out.',
}

export const translations: Record<Lang, Record<TKey, string>> = { id, en }

export function translate(
  lang: Lang,
  key: TKey,
  vars?: Record<string, string | number>,
): string {
  let text: string = translations[lang][key] ?? translations.id[key] ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, String(v))
    }
  }
  return text
}
