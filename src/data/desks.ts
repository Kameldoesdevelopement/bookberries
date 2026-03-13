// ZR Express desk locations per wilaya
// Wilayas not listed here have a single default desk named after the wilaya
// In Guezzam has NO desk delivery available

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

// Wilayas where desk delivery is NOT available
export const NO_DESK_WILAYAS = ["In Guezzam"];
