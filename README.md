# Mythic Table — Mobil RPG

Telefon öncelikli, tarayıcıda çalışan fantastik masaüstü RPG yardımcı uygulaması.

## Özellikler
- Karakter oluşturma ve cihazda kaydetme
- D4, D6, D8, D10, D12, D20 ve D100 zarları
- Zar değiştiricileri ve son atış geçmişi
- Macera günlüğü, kayıt silme
- JSON yedekleme ve geri yükleme
- Açık/koyu tema
- Mobil uyumlu arayüz ve temel çevrimdışı önbellek

## Çalıştırma

Dosyaları bir statik web sunucusuyla sun. Örneğin Termux'ta Python kuruluysa:

```bash
python -m http.server 8080
```

Ardından telefondaki tarayıcıdan `http://127.0.0.1:8080` adresini aç.

Service Worker ve uygulama kurulumu özellikleri HTTPS veya localhost gerektirir.

## Yol haritası
1. Temel mobil arayüz ve yerel kayıtlar
2. D&D SRD kurallarına uygun karakter istatistikleri ve oyun mekaniği
3. Savaş haritası, kareli alan ve token sistemi
4. Davet kodlu çevrim içi odalar, ortak zarlar ve oyun yöneticisi kontrolleri
5. Otomatik testler ve Android APK derlemesi

Çevrim içi çok oyunculu sistem ve APK bu ilk sürümde henüz uygulanmamıştır.

## Lisans ve içerik
Uygulama kodu MIT Lisansı altında sunulur. Ayrı olarak belirtilen üçüncü taraf içerikler kendi lisanslarına tabidir.

Bu çalışma, Wizards of the Coast LLC tarafından hazırlanan System Reference Document 5.2.1 ("SRD 5.2.1") materyallerini kullanırsa, şu atfı içermelidir:

"This work includes material from the System Reference Document 5.2.1 (SRD 5.2.1) by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode."

Bu başlangıç sürümünde resmî D&D sanat eserleri veya ticari kitap metinleri paketlenmemiştir. Uygulama resmî D&D ürünü değildir.
