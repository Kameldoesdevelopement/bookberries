// ZR Express delivery pricing and desk locations per wilaya
// Prices from ZR Express PDF (all 520 DA replaced with 570 DA per user instruction)
// "hors wilaya de Tlemcen" — shipped from Tlemcen

export interface WilayaPricing {
  home: number;
  desk: number; // 0 means no desk delivery
}

export const WILAYA_PRICING: Record<string, WilayaPricing> = {
  "Adrar":              { home: 1400, desk: 970 },
  "Chlef":              { home: 800,  desk: 570 },
  "Laghouat":           { home: 950,  desk: 670 },
  "Oum El Bouaghi":     { home: 800,  desk: 570 },
  "Batna":              { home: 800,  desk: 570 },
  "Béjaïa":             { home: 800,  desk: 570 },
  "Biskra":             { home: 950,  desk: 670 },
  "Béchar":             { home: 1100, desk: 720 },
  "Blida":              { home: 750,  desk: 570 },
  "Bouira":             { home: 800,  desk: 570 },
  "Tamanrasset":        { home: 1600, desk: 1120 },
  "Tébessa":            { home: 900,  desk: 570 },
  "Tlemcen":            { home: 400,  desk: 250 },
  "Tiaret":             { home: 750,  desk: 570 },
  "Tizi Ouzou":         { home: 800,  desk: 570 },
  "Alger":              { home: 650,  desk: 470 },
  "Djelfa":             { home: 950,  desk: 670 },
  "Jijel":              { home: 800,  desk: 570 },
  "Sétif":              { home: 800,  desk: 570 },
  "Saïda":              { home: 750,  desk: 570 },
  "Skikda":             { home: 800,  desk: 570 },
  "Sidi Bel Abbès":     { home: 700,  desk: 570 },
  "Annaba":             { home: 850,  desk: 570 },
  "Guelma":             { home: 850,  desk: 570 },
  "Constantine":        { home: 800,  desk: 570 },
  "Médéa":              { home: 750,  desk: 570 },
  "Mostaganem":         { home: 700,  desk: 570 },
  "M'Sila":             { home: 900,  desk: 670 },
  "Mascara":            { home: 700,  desk: 570 },
  "Ouargla":            { home: 1000, desk: 720 },
  "Oran":               { home: 700,  desk: 570 },
  "El Bayadh":          { home: 1000, desk: 670 },
  "Illizi":             { home: 1600, desk: 1120 },
  "Bordj Bou Arréridj": { home: 800,  desk: 570 },
  "Boumerdès":          { home: 800,  desk: 570 },
  "El Tarf":            { home: 850,  desk: 570 },
  "Tindouf":            { home: 1400, desk: 970 },
  "Tissemsilt":         { home: 750,  desk: 570 },
  "El Oued":            { home: 1000, desk: 720 },
  "Khenchela":          { home: 800,  desk: 570 },
  "Souk Ahras":         { home: 800,  desk: 570 },
  "Tipaza":             { home: 800,  desk: 570 },
  "Mila":               { home: 800,  desk: 570 },
  "Aïn Defla":          { home: 750,  desk: 570 },
  "Naâma":              { home: 1000, desk: 670 },
  "Aïn Témouchent":     { home: 650,  desk: 570 },
  "Ghardaïa":           { home: 1000, desk: 670 },
  "Relizane":           { home: 750,  desk: 570 },
  "Timimoun":           { home: 1400, desk: 970 },
  "Bordj Badji Mokhtar": { home: 1600, desk: 1120 },
  "Ouled Djellal":      { home: 950,  desk: 670 },
  "Béni Abbès":         { home: 1200, desk: 970 },
  "In Salah":           { home: 1600, desk: 1120 },
  "In Guezzam":         { home: 1600, desk: 0 },
  "Touggourt":          { home: 1000, desk: 720 },
  "Djanet":             { home: 1600, desk: 1120 },
  "El M'Ghair":         { home: 1000, desk: 0 },
  "El Meniaa":          { home: 1000, desk: 720 },
};

// Desk locations per wilaya (wilayas not listed here have a single default desk)
export const WILAYA_DESKS: Record<string, string[]> = {
  "Chlef": ["مكتب شلف", "مكتب تنس"],
  "Oum El Bouaghi": ["مكتب ام البواقي", "مكتب عين البيضاء"],
  "Béjaïa": ["مكتب بجاية", "مكتب اقبو"],
  "Blida": ["مكتب بليدة", "مكتب بوقرة", "مكتب موزاية"],
  "Alger": [
    "مكتب بئرخادم - Hub Birkhadem",
    "مكتب رغاية - Hub Reghaia",
    "مكتب القبة - Hub Kouba",
    "مكتب براقي - Hub Baraki",
    "مكتب بئرتوتة - Hub Birtouta",
    "مكتب أولاد فايت - Hub Ouled Fayet",
  ],
  "Jijel": ["مكتب جيجل", "مكتب الطاهير"],
  "Sétif": ["مكتب سطيف", "مكتب العلمة"],
  "Annaba": ["مكتب عنابة", "مكتب البوني"],
  "Constantine": [
    "مكتب زواغي - Hub Zouaghi",
    "مكتب المنظر الجميل - Hub Belle Vue",
    "مكتب قسنطينة - Hub Constantine",
  ],
  "Ouargla": ["مكتب ورقلة", "مكتب حاسي مسعود"],
  "Oran": [
    "مكتب المرشد - Hub El Morchid",
    "مكتب ماراڤال - Hub Maraval",
    "مكتب كاناستال - Hub Canastel",
  ],
  "Boumerdès": [
    "مكتب دلس - Hub Dellys",
    "مكتب برج منايل - Hub Bordj Menaiel",
    "مكتب بومرداس - Hub Boumerdes",
  ],
};

// Wilayas where desk delivery is NOT available (desk price = 0)
export const NO_DESK_WILAYAS = ["In Guezzam", "El M'Ghair"];
