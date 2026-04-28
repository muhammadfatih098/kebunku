import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

export interface Plant {
  id: number;
  name: string;
  latinName: string;
  category: 'indoor' | 'outdoor';
  image: string;
  watering: string;
  sunlight: string;
  fertilizer: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  description: string;
  tags: string[];
}

@Injectable({ providedIn: 'root' })
export class PlantService {
  private bookmarksSubject = new BehaviorSubject<number[]>([]);
  bookmarks$ = this.bookmarksSubject.asObservable();

  readonly plants: Plant[] = [
    { id: 1, name: 'Monstera', latinName: 'Monstera deliciosa', category: 'indoor', image: 'assets/images/plants/01_monstera_deliciosa_600x800.png', watering: '2x seminggu', sunlight: 'Cahaya sedang tidak langsung', fertilizer: 'NPK cair, setiap bulan', difficulty: 'Mudah', description: 'Monstera adalah tanaman hias populer dengan daun berlubang unik yang memberikan nuansa tropis pada ruangan.', tags: ['Tropis', 'Hias', 'Populer'] },
    { id: 2, name: 'Lidah Mertua', latinName: 'Sansevieria trifasciata', category: 'indoor', image: 'assets/images/plants/02_sansevieria_trifasciata_lidah_mertua_600x800.png', watering: '1x dalam 2 minggu', sunlight: 'Toleran minim cahaya', fertilizer: 'Pupuk slow-release, 3 bulan sekali', difficulty: 'Mudah', description: 'Tanaman pembersih udara yang sangat tahan banting. Cocok untuk pemula dan ruangan dengan cahaya minim.', tags: ['Air Purifier', 'Tahan Banting', 'Pemula'] },
    { id: 3, name: 'Pothos', latinName: 'Epipremnum aureum', category: 'indoor', image: 'assets/images/plants/03_epipremnum_aureum_pothos_600x800.png', watering: '1x seminggu', sunlight: 'Cahaya rendah hingga sedang', fertilizer: 'Pupuk cair, 2 minggu sekali', difficulty: 'Mudah', description: 'Tanaman rambat yang mudah dirawat dan tumbuh cepat. Sempurna untuk digantung atau merambat di rak.', tags: ['Rambat', 'Gantung', 'Cepat Tumbuh'] },
    { id: 4, name: 'Peace Lily', latinName: 'Spathiphyllum wallisii', category: 'indoor', image: 'assets/images/plants/04_spathiphyllum_wallisii_peace_lily_600x800.png', watering: '2x seminggu', sunlight: 'Cahaya rendah, tidak langsung', fertilizer: 'Pupuk seimbang, sebulan sekali', difficulty: 'Sedang', description: 'Tanaman berbunga indah yang membersihkan udara. Akan "minta minum" dengan daunnya yang layu.', tags: ['Berbunga', 'Air Purifier', 'Elegan'] },
    { id: 5, name: 'ZZ Plant', latinName: 'Zamioculcas zamiifolia', category: 'indoor', image: 'assets/images/plants/05_zamioculcas_zamiifolia_zz_plant_600x800.png', watering: '1x dalam 3 minggu', sunlight: 'Cahaya rendah', fertilizer: 'Pupuk slow-release, 6 bulan sekali', difficulty: 'Mudah', description: 'ZZ Plant adalah tanaman yang hampir tidak bisa mati. Sangat cocok untuk yang sering lupa menyiram.', tags: ['Tahan Kering', 'Glossy', 'Pemula'] },
    { id: 6, name: 'Calathea', latinName: 'Calathea orbifolia', category: 'indoor', image: 'assets/images/plants/06_calathea_orbifolia_600x800.png', watering: '3x seminggu', sunlight: 'Cahaya terang tidak langsung', fertilizer: 'Pupuk cair encer, 2 minggu sekali', difficulty: 'Sulit', description: 'Calathea terkenal dengan daun bergambar cantik. Daunnya bergerak mengikuti cahaya matahari.', tags: ['Cantik', 'Unik', 'Tropis'] },
    { id: 7, name: 'Kaktus Mini', latinName: 'Mammillaria elongata', category: 'indoor', image: 'assets/images/plants/07_mammillaria_elongata_kaktus_mini_600x800.png', watering: '1x dalam 2-3 minggu', sunlight: 'Sinar matahari penuh', fertilizer: 'Pupuk kaktus, 2 bulan sekali', difficulty: 'Mudah', description: 'Koleksi kaktus mini yang menggemaskan. Butuh sedikit air dan banyak cahaya untuk tumbuh optimal.', tags: ['Sukulen', 'Dekorasi', 'Mini'] },
    { id: 8, name: 'Lidah Buaya', latinName: 'Aloe vera', category: 'indoor', image: 'assets/images/plants/08_aloe_vera_lidah_buaya_600x800.png', watering: '1x dalam 2 minggu', sunlight: 'Cahaya terang langsung', fertilizer: 'Pupuk kaktus, 3 bulan sekali', difficulty: 'Mudah', description: 'Tanaman serbaguna dengan gel yang bermanfaat untuk kulit. Sangat mudah dirawat dan tumbuh subur.', tags: ['Herbal', 'Kesehatan', 'Serbaguna'] },
    { id: 9, name: 'Pakis Boston', latinName: 'Nephrolepis exaltata', category: 'indoor', image: 'assets/images/plants/09_nephrolepis_exaltata_pakis_boston_600x800.png', watering: '3-4x seminggu', sunlight: 'Cahaya terang tidak langsung', fertilizer: 'Pupuk cair, sebulan sekali', difficulty: 'Sedang', description: 'Pakis dengan daun lebat yang menghijau. Menyukai kelembapan tinggi dan cahaya tidak langsung.', tags: ['Lebat', 'Hijau', 'Gantung'] },
    { id: 10, name: 'Rubber Plant', latinName: 'Ficus elastica', category: 'indoor', image: 'assets/images/plants/10_ficus_elastica_rubber_plant_600x800.png', watering: '1x seminggu', sunlight: 'Cahaya terang tidak langsung', fertilizer: 'Pupuk seimbang, sebulan sekali', difficulty: 'Sedang', description: 'Pohon karet hias dengan daun merah kehijauan yang megah. Memberi kesan bold pada ruangan.', tags: ['Statement Plant', 'Besar', 'Elegan'] },
    { id: 11, name: 'String of Pearls', latinName: 'Senecio rowleyanus', category: 'indoor', image: 'assets/images/plants/11_senecio_rowleyanus_string_of_pearls_600x800.png', watering: '1x dalam 2 minggu', sunlight: 'Cahaya terang tidak langsung', fertilizer: 'Pupuk sukulen, 2 bulan sekali', difficulty: 'Sedang', description: 'Tanaman unik dengan daun bulat seperti mutiara. Cantik digantung dengan sulur menjuntai.', tags: ['Sukulen', 'Gantung', 'Unik'] },
    { id: 12, name: 'Philodendron', latinName: 'Philodendron bipinnatifidum', category: 'indoor', image: 'assets/images/plants/12_philodendron_bipinnatifidum_600x800.png', watering: '2x seminggu', sunlight: 'Cahaya sedang tidak langsung', fertilizer: 'Pupuk cair, 2 minggu sekali', difficulty: 'Mudah', description: 'Philodendron adalah genus tanaman tropis dengan berbagai varietas menawan. Tumbuh cepat dan subur.', tags: ['Tropis', 'Besar', 'Populer'] },
    { id: 13, name: 'Anthurium', latinName: 'Anthurium andraeanum', category: 'indoor', image: 'assets/images/plants/13_anthurium_andraeanum_600x800.png', watering: '2x seminggu', sunlight: 'Cahaya terang tidak langsung', fertilizer: 'Pupuk berbunga, sebulan sekali', difficulty: 'Sedang', description: 'Anthurium dengan bunganya yang mengkilap seperti plastik. Berbunga sepanjang tahun jika terawat.', tags: ['Berbunga', 'Elegan', 'Tropis'] },
    { id: 14, name: 'Spider Plant', latinName: 'Chlorophytum comosum', category: 'indoor', image: 'assets/images/plants/14_chlorophytum_comosum_spider_plant_600x800.png', watering: '2x seminggu', sunlight: 'Cahaya sedang', fertilizer: 'Pupuk cair, sebulan sekali', difficulty: 'Mudah', description: 'Spider plant adalah tanaman hias gantung yang mudah beranak pinak. Pembersih udara yang efektif.', tags: ['Air Purifier', 'Gantung', 'Pemula'] },
    { id: 15, name: 'Dracaena', latinName: 'Dracaena marginata', category: 'indoor', image: 'assets/images/plants/15_dracaena_marginata_600x800.png', watering: '1x seminggu', sunlight: 'Cahaya sedang hingga terang', fertilizer: 'Pupuk slow-release, 3 bulan sekali', difficulty: 'Mudah', description: 'Dracaena dengan batang seperti bambu dan daun panjang ramping. Memberi kesan modern dan minimalis.', tags: ['Modern', 'Minimalis', 'Tall'] },
    { id: 16, name: 'Chinese Evergreen', latinName: 'Aglaonema commutatum', category: 'indoor', image: 'assets/images/plants/16_aglaonema_commutatum_chinese_evergreen_600x800.png', watering: '1x seminggu', sunlight: 'Cahaya rendah hingga sedang', fertilizer: 'Pupuk cair encer, sebulan sekali', difficulty: 'Mudah', description: 'Aglaonema hadir dalam berbagai warna merah, pink, dan hijau. Sangat adaptif di berbagai kondisi.', tags: ['Colorful', 'Adaptif', 'Pemula'] },
    { id: 17, name: 'Mawar', latinName: 'Rosa hybrida', category: 'outdoor', image: 'assets/images/plants/17_rosa_hybrida_mawar_600x800.png', watering: '3x seminggu', sunlight: 'Sinar matahari penuh 6+ jam', fertilizer: 'Pupuk mawar khusus, 2 minggu sekali', difficulty: 'Sulit', description: 'Ratu bunga yang abadi. Mawar hadir dalam ratusan varietas dengan warna dan aroma memukau.', tags: ['Berbunga', 'Harum', 'Klasik'] },
    { id: 18, name: 'Bougainvillea', latinName: 'Bougainvillea spectabilis', category: 'outdoor', image: 'assets/images/plants/18_bougainvillea_spectabilis_600x800.png', watering: '2x seminggu', sunlight: 'Sinar matahari penuh', fertilizer: 'Pupuk berbunga, sebulan sekali', difficulty: 'Mudah', description: 'Bougainvillea dengan braktea berwarna cerah. Sangat tahan panas dan cocok untuk pagar hidup.', tags: ['Tahan Panas', 'Cerah', 'Merambat'] },
    { id: 19, name: 'Melati', latinName: 'Jasminum sambac', category: 'outdoor', image: 'assets/images/plants/19_jasminum_sambac_melati_600x800.png', watering: '2-3x seminggu', sunlight: 'Sinar matahari penuh hingga sedang', fertilizer: 'Pupuk organik, sebulan sekali', difficulty: 'Sedang', description: 'Bunga nasional Indonesia yang harum semerbak. Sering digunakan untuk upacara adat dan pengantin.', tags: ['Harum', 'Tradisional', 'Putih'] },
    { id: 20, name: 'Kamboja', latinName: 'Plumeria rubra', category: 'outdoor', image: 'assets/images/plants/20_plumeria_rubra_kamboja_600x800.png', watering: '2x seminggu', sunlight: 'Sinar matahari penuh', fertilizer: 'Pupuk fosfat tinggi, 2 bulan sekali', difficulty: 'Mudah', description: 'Kamboja Bali yang ikonik dengan warna putih kekuningan dan aroma manis. Simbol ketenangan.', tags: ['Harum', 'Tropis', 'Ikonik'] },
    { id: 21, name: 'Heliconia', latinName: 'Heliconia rostrata', category: 'outdoor', image: 'assets/images/plants/21_heliconia_rostrata_600x800.png', watering: '3x seminggu', sunlight: 'Sinar matahari penuh hingga sedang', fertilizer: 'Pupuk kandang, 2 bulan sekali', difficulty: 'Sedang', description: 'Heliconia dengan braktea merah oranye dramatis. Memberi nuansa tropical resort pada taman.', tags: ['Dramatis', 'Tropis', 'Eksotis'] },
    { id: 22, name: 'Anggrek Bulan', latinName: 'Phalaenopsis amabilis', category: 'outdoor', image: 'assets/images/plants/22_phalaenopsis_amabilis_anggrek_bulan_600x800.png', watering: '1x seminggu', sunlight: 'Cahaya terang tidak langsung', fertilizer: 'Pupuk anggrek khusus, 2 minggu sekali', difficulty: 'Sulit', description: 'Anggrek bulan adalah bunga nasional Indonesia yang anggun. Berbunga hingga 3 bulan jika terawat.', tags: ['Mewah', 'Nasional', 'Berbunga'] },
    { id: 23, name: 'Bambu Air', latinName: 'Equisetum hyemale', category: 'outdoor', image: 'assets/images/plants/23_equisetum_hyemale_bambu_air_600x800.png', watering: 'Selalu lembap / semi akuatik', sunlight: 'Cahaya sedang hingga terang', fertilizer: 'Pupuk slow-release, 3 bulan sekali', difficulty: 'Sedang', description: 'Bambu air dengan batang berongga tegak. Sangat dekoratif untuk kolam kecil atau pot air.', tags: ['Akuatik', 'Dekoratif', 'Zen'] },
    { id: 24, name: 'Lavender', latinName: 'Lavandula angustifolia', category: 'outdoor', image: 'assets/images/plants/24_lavandula_angustifolia_lavender_600x800.png', watering: '1-2x seminggu', sunlight: 'Sinar matahari penuh 6-8 jam', fertilizer: 'Pupuk rendah nitrogen, musim tanam', difficulty: 'Sedang', description: 'Lavender ungu yang harum dan menenangkan. Mengusir serangga alami dan bermanfaat untuk aromaterapi.', tags: ['Harum', 'Ungu', 'Herbal'] },
    { id: 25, name: 'Pohon Palem', latinName: 'Areca lutescens', category: 'outdoor', image: 'assets/images/plants/25_areca_lutescens_pohon_palem_600x800.png', watering: '3x seminggu', sunlight: 'Sinar matahari penuh', fertilizer: 'Pupuk palem khusus, 2 bulan sekali', difficulty: 'Mudah', description: 'Palem kuning yang elegan untuk taman tropis. Memberikan nuansa resort mewah di halaman rumah.', tags: ['Tropis', 'Tinggi', 'Resort'] },
    { id: 26, name: 'Bunga Matahari', latinName: 'Helianthus annuus', category: 'outdoor', image: 'assets/images/plants/26_helianthus_annuus_bunga_matahari_600x800.png', watering: '2-3x seminggu', sunlight: 'Sinar matahari penuh 6-8 jam', fertilizer: 'Pupuk organik, 2 minggu sekali', difficulty: 'Mudah', description: 'Bunga matahari kuning cerah yang selalu menghadap matahari. Memberi keceriaan pada taman mana pun.', tags: ['Cerah', 'Musiman', 'Cepat Tumbuh'] },
    { id: 27, name: 'Kana', latinName: 'Canna indica', category: 'outdoor', image: 'assets/images/plants/27_canna_indica_kana_600x800.png', watering: '3x seminggu', sunlight: 'Sinar matahari penuh', fertilizer: 'Pupuk NPK, sebulan sekali', difficulty: 'Mudah', description: 'Kana dengan bunga oranye merah dramatis. Tumbuh subur di iklim tropis dan sangat mudah dirawat.', tags: ['Dramatis', 'Tropis', 'Tinggi'] },
    { id: 28, name: 'Pohon Mangga', latinName: 'Mangifera indica', category: 'outdoor', image: 'assets/images/plants/28_mangifera_indica_pohon_mangga_600x800.png', watering: '2x seminggu (bibit), jarang (dewasa)', sunlight: 'Sinar matahari penuh', fertilizer: 'Pupuk NPK + organik, 3 bulan sekali', difficulty: 'Sedang', description: 'Raja buah tropis. Pohon mangga yang berbuah lebat memberikan keteduhan sekaligus panen melimpah.', tags: ['Buah', 'Teduh', 'Produktif'] },
    { id: 29, name: 'Geranium', latinName: 'Pelargonium hortorum', category: 'outdoor', image: 'assets/images/plants/29_pelargonium_hortorum_geranium_600x800.png', watering: '2x seminggu', sunlight: 'Sinar matahari penuh hingga sedang', fertilizer: 'Pupuk berbunga, 2 minggu sekali', difficulty: 'Mudah', description: 'Geranium dengan bunga berkelompok yang meriah. Pilihan terbaik untuk pot balkon dan taman depan.', tags: ['Berbunga', 'Pot', 'Balkon'] },
    { id: 30, name: 'Pacar Air', latinName: 'Impatiens walleriana', category: 'outdoor', image: 'assets/images/plants/30_impatiens_walleriana_pacar_air_600x800.png', watering: '3-4x seminggu', sunlight: 'Cahaya sedang, hindari terik', fertilizer: 'Pupuk cair, 2 minggu sekali', difficulty: 'Mudah', description: 'Pacar air berbunga lebat sepanjang tahun dengan warna yang beragam. Ideal untuk area teduh.', tags: ['Lebat', 'Warna-warni', 'Teduh'] },
    { id: 31, name: 'Serai', latinName: 'Cymbopogon citratus', category: 'outdoor', image: 'assets/images/plants/31_cymbopogon_citratus_serai_600x800.png', watering: '2-3x seminggu', sunlight: 'Sinar matahari penuh', fertilizer: 'Pupuk organik, 2 bulan sekali', difficulty: 'Mudah', description: 'Serai adalah tanaman herbal serbaguna. Mengusir nyamuk secara alami dan digunakan dalam masakan.', tags: ['Herbal', 'Pengusir Nyamuk', 'Dapur'] },
    { id: 32, name: 'Bougenville Kuning', latinName: 'Bougainvillea glabra', category: 'outdoor', image: 'assets/images/plants/32_bougainvillea_glabra_bougenville_kuning_600x800.png', watering: '2x seminggu', sunlight: 'Sinar matahari penuh', fertilizer: 'Pupuk berbunga, sebulan sekali', difficulty: 'Mudah', description: 'Varietas bougainvillea dengan braktea kuning langka. Sangat eye-catching untuk pagar dan pergola.', tags: ['Langka', 'Kuning', 'Merambat'] }
  ];

  constructor() { this.loadBookmarks(); }

  private async loadBookmarks() {
    const { value } = await Preferences.get({ key: 'kebunku_bookmarks' });
    if (value) this.bookmarksSubject.next(JSON.parse(value));
  }

  private async saveBookmarks(ids: number[]) {
    await Preferences.set({ key: 'kebunku_bookmarks', value: JSON.stringify(ids) });
    this.bookmarksSubject.next(ids);
  }

  async toggleBookmark(id: number): Promise<boolean> {
    const current = this.bookmarksSubject.getValue();
    const isBookmarked = current.includes(id);
    const updated = isBookmarked ? current.filter(i => i !== id) : [...current, id];
    await this.saveBookmarks(updated);
    return !isBookmarked;
  }

  isBookmarked(id: number): boolean { return this.bookmarksSubject.getValue().includes(id); }
  getBookmarkedPlants(): Plant[] { return this.plants.filter(p => this.bookmarksSubject.getValue().includes(p.id)); }
  getPlantById(id: number): Plant | undefined { return this.plants.find(p => p.id === id); }
  getPlantsByCategory(category: 'all' | 'indoor' | 'outdoor'): Plant[] {
    if (category === 'all') return this.plants;
    return this.plants.filter(p => p.category === category);
  }
  searchPlants(query: string, category: 'all' | 'indoor' | 'outdoor' = 'all'): Plant[] {
    const q = query.toLowerCase().trim();
    const base = this.getPlantsByCategory(category);
    if (!q) return base;
    return base.filter(p => p.name.toLowerCase().includes(q) || p.latinName.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
  }
}
