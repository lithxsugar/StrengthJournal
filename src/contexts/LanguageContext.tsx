import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'id';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export const translations: Translations = {
  // Navigation
  nav_home: { en: 'My Journey', id: 'Jejak Langkah' },
  nav_new: { en: 'New', id: 'Baru' },
  nav_strengths: { en: 'Strengths', id: 'Kekuatan' },
  nav_insights: { en: 'Insights', id: 'Wawasan' },
  nav_logout: { en: 'Logout', id: 'Keluar' },
  
  // Auth
  auth_title: { en: 'Strengths Journal', id: 'Jurnal Kekuatan' },
  auth_subtitle: { en: 'Reflect on your daily actions through the lens of character strengths.', id: 'Refleksikan tindakan harian Anda melalui kacamata kekuatan karakter.' },
  auth_button: { en: 'Continue with Google', id: 'Lanjutkan dengan Google' },
  
  // Home
  home_streak: { en: 'Day Streak', id: 'Hari Beruntun' },
  home_search: { en: 'Search your reflections...', id: 'Cari refleksi Anda...' },
  home_filter: { en: 'All Strengths', id: 'Semua Kekuatan' },
  home_no_entries: { en: 'No entries found. Start your journey today.', id: 'Tidak ada entri ditemukan. Mulai perjalanan Anda hari ini.' },
  home_new_entry: { en: 'New Entry', id: 'Entri Baru' },
  
  // New Entry
  new_entry_title: { en: 'New Reflection', id: 'Refleksi Baru' },
  new_entry_date: { en: 'Date of Action', id: 'Tanggal Tindakan' },
  new_entry_strengths: { en: 'Character Strengths', id: 'Kekuatan Karakter' },
  new_entry_action: { en: 'Action Taken', id: 'Tindakan yang Diambil' },
  new_entry_action_placeholder: { en: 'What did you do today that demonstrated these strengths?', id: 'Apa yang Anda lakukan hari ini yang menunjukkan kekuatan ini?' },
  new_entry_time: { en: 'Time', id: 'Waktu' },
  new_entry_place: { en: 'Place', id: 'Tempat' },
  new_entry_place_placeholder: { en: 'Where did this happen?', id: 'Di mana ini terjadi?' },
  new_entry_obstacles: { en: 'Obstacles', id: 'Rintangan' },
  new_entry_obstacles_placeholder: { en: 'Any challenges you faced?', id: 'Ada tantangan yang Anda hadapi?' },
  new_entry_opportunities: { en: 'Opportunities', id: 'Peluang' },
  new_entry_opportunities_placeholder: { en: 'How can you use this strength more?', id: 'Bagaimana Anda bisa menggunakan kekuatan ini lebih banyak?' },
  
  // Common Actions
  common_save: { en: 'Save', id: 'Simpan' },
  common_saving: { en: 'Saving...', id: 'Menyimpan...' },
  common_edit: { en: 'Edit', id: 'Edit' },
  common_cancel: { en: 'Cancel', id: 'Batal' },
  common_delete: { en: 'Delete', id: 'Hapus' },
  common_delete_confirm: { en: 'Are you sure you want to delete this entry? This action cannot be undone.', id: 'Apakah Anda yakin ingin menghapus entri ini? Tindakan ini tidak dapat dibatalkan.' },
  common_delete_confirm_title: { en: 'Delete Entry?', id: 'Hapus Entri?' },
  new_entry_strengths_error: { en: 'Please select at least one character strength.', id: 'Silakan pilih setidaknya satu kekuatan karakter.' },
  new_entry_strengths_help: { en: 'Select one or more strengths you embodied during this action.', id: 'Pilih satu atau lebih kekuatan yang Anda tunjukkan selama tindakan ini.' },
  
  // Insights
  insights_total_entries: { en: 'Total Reflections', id: 'Total Refleksi' },
  insights_distribution: { en: 'Strength Distribution', id: 'Distribusi Kekuatan' },

  // Virtues
  virtue_wisdom: { en: 'Wisdom', id: 'Kebijaksanaan' },
  virtue_courage: { en: 'Courage', id: 'Keberanian' },
  virtue_humanity: { en: 'Humanity', id: 'Kemanusiaan' },
  virtue_justice: { en: 'Justice', id: 'Keadilan' },
  virtue_temperance: { en: 'Temperance', id: 'Kesederhanaan' },
  virtue_transcendence: { en: 'Transcendence', id: 'Transendensi' },

  // Character Strengths
  strength_teamwork: { en: 'Teamwork', id: 'Kerjasama' },
  strength_kindness: { en: 'Kindness', id: 'Kebaikan' },
  strength_hope: { en: 'Hope', id: 'Harapan' },
  strength_perspective: { en: 'Perspective', id: 'Perspektif' },
  strength_religiousness: { en: 'Religiousness/spirituality', id: 'Religiusitas/Spiritualitas' },
  strength_creativity: { en: 'Creativity', id: 'Kreativitas' },
  strength_gratitude: { en: 'Gratitude', id: 'Syukur' },
  strength_persistence: { en: 'Persistence/perseverence', id: 'Ketekunan/Kegigihan' },
  strength_open_mindedness: { en: 'Open-mindedness/judgement', id: 'Keterbukaan Pikiran/Penilaian' },
  strength_forgiveness: { en: 'Forgiveness', id: 'Pengampunan' },
  strength_appreciation: { en: 'Appreciation of beauty and excellence', id: 'Penghargaan terhadap Keindahan dan Keunggulan' },
  strength_leadership: { en: 'Leadership', id: 'Kepemimpinan' },
  strength_love_of_learning: { en: 'Love of learning', id: 'Kecintaan Belajar' },
  strength_fairness: { en: 'Fairness', id: 'Keadilan' },
  strength_curiosity: { en: 'Curiosity', id: 'Keingintahuan' },
  strength_bravery: { en: 'Bravery', id: 'Keberanian' },
  strength_zest: { en: 'Zest', id: 'Semangat' },
  strength_humor: { en: 'Humor', id: 'Humor' },
  strength_modesty: { en: 'Modesty/humility', id: 'Kesederhanaan/Kerendahan Hati' },
  strength_social_intelligence: { en: 'Social Intelligence', id: 'Kecerdasan Sosial' },
  strength_self_regulation: { en: 'Self-regulation', id: 'Regulasi Diri' },
  strength_prudence: { en: 'Prudence', id: 'Kebijaksanaan' },
  strength_love: { en: 'Love', id: 'Cinta' },

  // Strength Descriptions
  desc_teamwork: { en: 'Working well as a member of a group or team; being loyal to the group; doing one\'s share.', id: 'Bekerja dengan baik sebagai anggota kelompok atau tim; setia kepada kelompok; melakukan bagian seseorang.' },
  desc_kindness: { en: 'Doing favors and good deeds for others; helping them; taking care of them.', id: 'Melakukan bantuan dan perbuatan baik untuk orang lain; membantu mereka; merawat mereka.' },
  desc_hope: { en: 'Expecting the best in the future and working to achieve it; believing that a good future is something that can be brought about.', id: 'Mengharapkan yang terbaik di masa depan dan bekerja untuk mencapainya; percaya bahwa masa depan yang baik adalah sesuatu yang dapat diwujudkan.' },
  desc_perspective: { en: 'Being able to provide wise counsel to others; having ways of looking at the world that make sense to oneself and to other people.', id: 'Mampu memberikan nasihat bijak kepada orang lain; memiliki cara memandang dunia yang masuk akal bagi diri sendiri dan orang lain.' },
  desc_religiousness: { en: 'Having coherent beliefs about the higher purpose and meaning of the universe; knowing where one fits within the larger scheme.', id: 'Memiliki keyakinan yang koheren tentang tujuan dan makna alam semesta yang lebih tinggi; mengetahui di mana seseorang cocok dalam skema yang lebih besar.' },
  desc_creativity: { en: 'Thinking of novel and productive ways to conceptualize and do things; includes artistic achievement but is not limited to it.', id: 'Memikirkan cara-cara baru dan produktif untuk mengonseptualisasikan dan melakukan sesuatu; termasuk pencapaian artistik tetapi tidak terbatas padanya.' },
  desc_gratitude: { en: 'Being aware of and thankful for the good things that happen; taking time to express thanks.', id: 'Menyadari dan berterima kasih atas hal-hal baik yang terjadi; meluangkan waktu untuk mengucapkan terima kasih.' },
  desc_persistence: { en: 'Finishing what one starts; persisting in a course of action in spite of obstacles; "getting it out the door"; taking pleasure in completing tasks.', id: 'Menyelesaikan apa yang dimulai; bertahan dalam suatu tindakan meskipun ada rintangan; "mengeluarkannya dari pintu"; merasa senang dalam menyelesaikan tugas.' },
  desc_open_mindedness: { en: 'Thinking things through and examining them from all sides; not jumping to conclusions; being able to change one\'s mind in light of evidence; weighing all evidence fairly.', id: 'Memikirkan segala sesuatunya dan memeriksanya dari semua sisi; tidak terburu-buru mengambil kesimpulan; mampu berubah pikiran berdasarkan bukti; menimbang semua bukti secara adil.' },
  desc_forgiveness: { en: 'Forgiving those who have done wrong; accepting the shortcomings of others; giving people a second chance; not being vengeful.', id: 'Memaafkan mereka yang telah berbuat salah; menerima kekurangan orang lain; memberi orang kesempatan kedua; tidak pendendam.' },
  desc_appreciation: { en: 'Noticing and appreciating beauty, excellence, and/or skilled performance in various domains of life, from nature to art to mathematics to science to everyday experience.', id: 'Memperhatikan dan menghargai keindahan, keunggulan, dan/atau kinerja terampil dalam berbagai bidang kehidupan, dari alam hingga seni hingga matematika hingga sains hingga pengalaman sehari-hari.' },
  desc_leadership: { en: 'Encouraging a group of which one is a member to get things done and at the same time maintain good relations within the group; organizing group activities and seeing that they happen.', id: 'Mendorong kelompok di mana seseorang menjadi anggotanya untuk menyelesaikan berbagai hal dan pada saat yang sama menjaga hubungan baik dalam kelompok; mengorganisir kegiatan kelompok dan memastikan hal itu terjadi.' },
  desc_love_of_learning: { en: 'Mastering new skills, topics, and bodies of knowledge, whether on one\'s own or formally; obviously related to the strength of curiosity but goes beyond it to describe the tendency to add systematically to what one knows.', id: 'Menguasai keterampilan, topik, dan kumpulan pengetahuan baru, baik sendiri atau secara formal; jelas terkait dengan kekuatan keingintahuan tetapi melampauinya untuk menggambarkan kecenderungan untuk menambah secara sistematis apa yang diketahui.' },
  desc_fairness: { en: 'Treating all people the same according to notions of fairness and justice; not letting personal feelings bias decisions about others; giving everyone a fair chance.', id: 'Memperlakukan semua orang sama sesuai dengan gagasan keadilan dan kejujuran; tidak membiarkan perasaan pribadi membiaskan keputusan tentang orang lain; memberi setiap orang kesempatan yang adil.' },
  desc_curiosity: { en: 'Taking an interest in ongoing experience for its own sake; finding subjects and topics fascinating; exploring and discovering.', id: 'Tertarik pada pengalaman yang sedang berlangsung demi pengalamannya sendiri; menganggap subjek dan topik menarik; menjelajahi dan menemukan.' },
  desc_bravery: { en: 'Not shrinking from threat, challenge, difficulty, or pain; speaking up for what is right even if there is opposition; acting on convictions even if unpopular; includes physical bravery but is not limited to it.', id: 'Tidak gentar menghadapi ancaman, tantangan, kesulitan, atau rasa sakit; menyuarakan apa yang benar meskipun ada tentangan; bertindak berdasarkan keyakinan meskipun tidak populer; termasuk keberanian fisik tetapi tidak terbatas padanya.' },
  desc_zest: { en: 'Approaching life with excitement and energy; not doing things halfway or halfheartedly; living life as an adventure; feeling alive and activated.', id: 'Menjalani hidup dengan kegembiraan dan energi; tidak melakukan sesuatu setengah-setengah atau setengah hati; menjalani hidup sebagai petualangan; merasa hidup dan aktif.' },
  desc_humor: { en: 'Liking to laugh and tease; bringing smiles to other people; seeing the light side; making (not necessarily telling) jokes.', id: 'Suka tertawa dan menggoda; membawa senyum kepada orang lain; melihat sisi terang; membuat (tidak harus menceritakan) lelucon.' },
  desc_modesty: { en: 'Letting one\'s accomplishments speak for themselves; not seeking the spotlight; not regarding oneself as more special than one is.', id: 'Membiarkan pencapaian seseorang berbicara sendiri; tidak mencari sorotan; tidak menganggap diri sendiri lebih istimewa daripada yang sebenarnya.' },
  desc_social_intelligence: { en: 'Being aware of the motives and feelings of other people and oneself; knowing what to do to fit into different social situations; knowing what makes other people tick.', id: 'Menyadari motif dan perasaan orang lain dan diri sendiri; tahu apa yang harus dilakukan agar sesuai dengan situasi sosial yang berbeda; tahu apa yang membuat orang lain bersemangat.' },
  desc_self_regulation: { en: 'Regulating what one feels and does; being disciplined; controlling one\'s appetites and emotions.', id: 'Mengatur apa yang dirasakan dan dilakukan; disiplin; mengendalikan nafsu dan emosi.' },
  desc_prudence: { en: 'Being careful about one\'s choices; not taking undue risks; not saying or doing things that might later be regretted.', id: 'Berhati-hati dalam memilih; tidak mengambil risiko yang tidak semestinya; tidak mengatakan atau melakukan hal-hal yang mungkin nantinya disesali.' },
  desc_love: { en: 'Valuing close relations with others, in particular those in which sharing and caring are reciprocated; being close to people.', id: 'Menghargai hubungan dekat dengan orang lain, khususnya yang di dalamnya ada saling berbagi dan peduli; dekat dengan orang-orang.' },

  // Quotes
  quote_1: { en: 'Character is not something that you were born with and can’t change, like your fingerprints. It’s something you must take responsibility for forming.', id: 'Karakter bukanlah sesuatu yang Anda bawa sejak lahir dan tidak dapat diubah, seperti sidik jari Anda. Itu adalah sesuatu yang harus Anda pertanggungjawabkan pembentukannya.' },
  quote_2: { en: 'The greatness of a man is not in how much wealth he acquires, but in his integrity and his ability to affect those around him positively.', id: 'Kebesaran seseorang bukan pada seberapa banyak kekayaan yang ia peroleh, melainkan pada integritasnya dan kemampuannya untuk mempengaruhi orang-orang di sekitarnya secara positif.' },
  quote_3: { en: 'Our character is what we do when we think no one is looking.', id: 'Karakter kita adalah apa yang kita lakukan ketika kita merasa tidak ada orang yang melihat.' },
  quote_4: { en: 'The content of your character is your choice. Day by day, what you choose, what you think and what you do is who you become.', id: 'Isi karakter Anda adalah pilihan Anda. Hari demi hari, apa yang Anda pilih, apa yang Anda pikirkan, dan apa yang Anda lakukan adalah siapa Anda nantinya.' },
  quote_5: { en: 'Good character is not formed in a week or a month. It is created little by little, day by day. Protracted and patient effort is needed to develop good character.', id: 'Karakter yang baik tidak terbentuk dalam seminggu atau sebulan. Ia diciptakan sedikit demi sedikit, hari demi hari. Diperlukan upaya yang lama dan sabar untuk mengembangkan karakter yang baik.' },
  quote_label: { en: 'Quote of the Day', id: 'Kutipan Hari Ini' },
  quote_footer: { en: 'Inspired by the VIA Character Strengths Test', id: 'Terinspirasi oleh Tes Kekuatan Karakter VIA' },

  // Profile & Settings
  prof_title: { en: 'Profile & Settings', id: 'Profil & Pengaturan' },
  prof_username: { en: 'Display Name', id: 'Nama Tampilan' },
  prof_upload_photo: { en: 'Upload Photo', id: 'Unggah Foto' },
  prof_upload_hint: { en: 'Max 1MB. Recommended square image.', id: 'Maks 1MB. Disarankan gambar persegi.' },
  prof_save: { en: 'Save Changes', id: 'Simpan Perubahan' },
  prof_success: { en: 'Profile Updated!', id: 'Profil Diperbarui!' },
  prof_font_family: { en: 'Typography Style', id: 'Gaya Tipografi' },
  prof_font_size: { en: 'Text Size', id: 'Ukuran Teks' },
  prof_font_sans: { en: 'Modern Sans', id: 'Sans Modern' },
  prof_font_serif: { en: 'Classic Serif', id: 'Serif Klasik' },
  prof_font_mono: { en: 'Technical Mono', id: 'Mono Teknis' },
  prof_size_small: { en: 'Small', id: 'Kecil' },
  prof_size_medium: { en: 'Medium', id: 'Sedang' },
  prof_size_large: { en: 'Large', id: 'Besar' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  strengthToKey: (strength: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const strengthToKey = (strength: string) => {
    const keyMap: { [key: string]: string } = {
      "Teamwork": "strength_teamwork",
      "Kindness": "strength_kindness",
      "Hope": "strength_hope",
      "Perspective": "strength_perspective",
      "Religiousness/spirituality": "strength_religiousness",
      "Creativity": "strength_creativity",
      "Gratitude": "strength_gratitude",
      "Persistence/perseverence": "strength_persistence",
      "Open-mindedness/judgement": "strength_open_mindedness",
      "Forgiveness": "strength_forgiveness",
      "Appreciation of beauty and excellence": "strength_appreciation",
      "Leadership": "strength_leadership",
      "Love of learning": "strength_love_of_learning",
      "Fairness": "strength_fairness",
      "Curiosity": "strength_curiosity",
      "Bravery": "strength_bravery",
      "Zest": "strength_zest",
      "Humor": "strength_humor",
      "Modesty/humility": "strength_modesty",
      "Social Intelligence": "strength_social_intelligence",
      "Self-regulation": "strength_self_regulation",
      "Prudence": "strength_prudence",
      "Love": "strength_love"
    };
    return keyMap[strength] || strength;
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, strengthToKey }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
