import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb'; // Yeni oluşturduğumuz bağlantı modülü
// import { GoogleGenerativeAI } from '@google/generative-ai'; // LLM'i kullanıyorsanız kalsın
// ... (diğer importlarınız) ...

// API anahtarınızı .env.local dosyasından alın (LLM kullanıyorsanız)
// const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
// const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
// const model = genAI ? genAI.getGenerativeModel({ model: "gemini-pro" }) : null;

export async function POST(req: NextRequest) {
  let mongoClient; // Bağlantıyı tutmak için
  let db;         // Veritabanını tutmak için

  try {
    // Veritabanına bağlan
    ({ mongoClient, db } = await connectToDatabase()); // Bağlantıyı buradan alıyoruz

    const { question, extracted_content } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ message: 'Invalid question provided.' }, { status: 400 });
    }
    if (!extracted_content || typeof extracted_content !== 'object' || Object.keys(extracted_content).length === 0) {
      return NextResponse.json({
        answer: "Herhangi bir belge yüklenmediği için sorunuza yanıt veremiyorum. Lütfen önce bakım belgelerinizi yükleyin.",
        sourceFile: null
      }, { status: 200 });
    }

    // LLM'i kullanıyorsanız bu kısmı aktif bırakın ve model tanımını yukarıda tutun
    // if (!model) { /* ... */ }

    // --- LLM Çağrısı veya Basit Senaryo Yanıtlayıcısı ---
    let bestAnswer: string;
    let sourceFile: string | null = null;

    // Burada LLM'siz yanıtlayıcı kodunuz veya LLM entegrasyon kodunuz devam eder
    // Örnek olarak, önceki LLM'siz ask API'nizdeki logic'i buraya kopyalayın
    // Benim size en son verdiğim LLM'siz route.ts dosyasının içeriğini buraya yapıştırın.

    // ... (Önceki LLM'siz ask API kodunuzun tamamı buraya gelecek) ...
    // --- LLM'siz Yanıtlayıcı Başlangıcı ---
    bestAnswer = "Üzgünüm, sorunuzla ilgili doğrudan bir cevap bulamadım. Daha detaylı bilgi için lütfen teknik kılavuzlara başvurun.";
    const lowerQuestion = question.toLowerCase();

    for (const fileName in extracted_content) {
      const content = extracted_content[fileName];
      const lowerContent = content.toLowerCase();

      let relevantLines: string[] = [];

      if (lowerQuestion.includes('parça') || lowerQuestion.includes('component')) {
        const parts = content.match(/Part #:\s*(\S+)\s*-\s*([^\n]+)/gi);
        if (parts) {
            relevantLines.push("Belgede belirtilen bazı parçalar:");
            relevantLines.push(...parts.slice(0, 3));
        }
        const componentSections = content.match(/Section \d+\.\d+: .*Components/i);
        if (componentSections) relevantLines.push(...componentSections);
      }

      if (lowerQuestion.includes('onarım') || lowerQuestion.includes('repair') || lowerQuestion.includes('tamir')) {
        const repairLogs = content.match(/Repair History:[\s\S]*?(?=\n\n|$)/i);
        if (repairLogs) {
            relevantLines.push("Onarım geçmişi bölümünden bilgiler:");
            relevantLines.push(...repairLogs[0].split('\n').filter(line => line.trim()).slice(0, 5));
        }
        const commonRepairs = content.match(/Section \d+\.\d+: Common Repairs[\s\S]*?(?=\n\n|$)/i);
        if (commonRepairs) {
            relevantLines.push("Ortak Onarımlar bölümünden bilgiler:");
            relevantLines.push(...commonRepairs[0].split('\n').filter(line => line.trim()).slice(0, 5));
        }
      }
      
      if (lowerQuestion.includes('arıza kodu') || lowerQuestion.includes('error code') || lowerQuestion.includes('e07') || lowerQuestion.includes('e12')) {
        const errorCodes = content.match(/Error E\d+:\s*([^\n]+)/gi);
        if (errorCodes) {
            relevantLines.push("Belirlenen arıza kodları:");
            relevantLines.push(...errorCodes.slice(0, 3));
        }
        const troubleshooting = content.match(/Section \d+\.\d+: Troubleshooting Error Codes[\s\S]*?(?=\n\n|$)/i);
        if (troubleshooting) {
            relevantLines.push("Hata Kodları Sorun Giderme bölümünden bilgiler:");
            relevantLines.push(...troubleshooting[0].split('\n').filter(line => line.trim()).slice(0, 5));
        }
      }
      
      if (lowerQuestion.includes('battery') && lowerQuestion.includes('charger') && lowerQuestion.includes('yesterday') && lowerContent.includes('battery charger')) {
        bestAnswer = `Bakım kılavuzuna göre, dünkü pil şarj cihazı onarımında kullanılan parçalar ve bugünkü hatalarla ilgili bilgiler:

**Dünkü pil şarj cihazı onarımında kullanılan parçalar:**
- Voltaj regülatör modülü (Parça No: VR-450-X) - Bu değiştirildi.
- Soğutma fanı düzeneği (Parça No: CF-120MM-001) - Bu temizlendi.

**Bugünkü hatalar hakkında:**
Karşılaştığınız hatalar şunlarla ilgili olabilir:
- Hata E07: Voltaj düzenleme hatası
- Hata E12: Aşırı ısınma tespit edildi
- Hata E15: İletişim hatası

**Öneri:** Yeni voltaj regülatör modülünün (VR-450-X) doğru bağlandığından emin olun ve kontrol kartı (CCB-SMART-V2) bellenim güncellemesinin başarılı olup olmadığını doğrulayın.`;
        sourceFile = fileName;
        break;
      }
      
      if (relevantLines.length > 0) {
          bestAnswer = `**${fileName}** dosyasından bulunan ilgili bilgiler:\n` + relevantLines.join('\n');
          sourceFile = fileName;
          break;
      }
      if (relevantLines.length === 0 && content.length > 100) {
        bestAnswer = `**${fileName}** dosyasından: \n${content.substring(0, 500)}... (Daha fazla detay için sorunuzu spesifikleştirebilirsiniz.)`;
        sourceFile = fileName;
        break;
      }
    }
    // --- LLM'siz Yanıtlayıcı Sonu ---


    // --- Veriyi MongoDB'ye Kaydetme Örneği ---
    const conversationCollection = db.collection('conversations'); // 'conversations' adında bir koleksiyon oluşturun
    await conversationCollection.insertOne({
      question: question,
      answer: bestAnswer,
      sourceFile: sourceFile,
      timestamp: new Date(),
      extractedContentSnapshot: extracted_content // İstediğiniz kadar veri kaydedebilirsiniz
    });
    console.log("Soru-cevap kaydı MongoDB'ye eklendi.");
    // --- Kaydetme Örneği Sonu ---

    return NextResponse.json({
      answer: bestAnswer,
      sourceFile: sourceFile || "Yüklenen belgelerden doğrudan bulunamadı.",
    }, { status: 200 });

  } catch (error: any) {
    console.error('API /api/ask hatası:', error);
    return NextResponse.json(
      { message: 'Soru işlenirken sunucu tarafında bir hata oluştu.', error: error.message },
      { status: 500 }
    );
  }
}