import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Gemini için

// API anahtarınızı .env.local dosyasından alın
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

if (!GEMINI_API_KEY) {
  // API anahtarının tanımlı olmaması durumunda hata fırlat
  console.error("HATA: GOOGLE_API_KEY ortam değişkeni ayarlanmamış.");
  console.error("Lütfen .env.local dosyanızda GOOGLE_API_KEY=YOUR_API_KEY_HERE şeklinde ayarlayın.");
  // Uygulamanın geliştirme ortamında başlamasını engellemek için hata fırlatmak faydalı olabilir,
  // ancak API çağrısı sırasında da kontrol edebiliriz.
  // throw new Error('GOOGLE_API_KEY environment variable not set.');
}

// API anahtarı varsa GenAI modelini başlat, yoksa null bırak
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
// Modeli seçerken kontrol et
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null; // veya "gemini-1.5-flash", "gemini-1.5-pro"

export async function POST(req: NextRequest) {
  try {
    const { question, extracted_content } = await req.json(); // Frontend'den JSON body'i al

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ message: 'Invalid question provided.' }, { status: 400 });
    }
    if (!extracted_content || typeof extracted_content !== 'object' || Object.keys(extracted_content).length === 0) {
      // Yüklenmiş belge yoksa veya geçersizse yanıt ver
      return NextResponse.json({
        answer: "Herhangi bir belge yüklenmediği veya geçersiz olduğu için sorunuza yanıt veremiyorum. Lütfen önce bakım belgelerinizi yükleyin.",
        sourceFile: null
      }, { status: 200 }); // Başarılı bir yanıt olarak 200 döndürürüz.
    }

    if (!model) { // API anahtarı eksikse veya model başlatılamadıysa
        return NextResponse.json({
            answer: "Yapay zeka modeli kullanıma hazır değil. Lütfen GOOGLE_API_KEY'inizin doğru ayarlandığından emin olun.",
            sourceFile: null
        }, { status: 500 });
    }

    // --- Bağlam Oluşturma (RAG - Retrieval Augmented Generation basitleştirilmiş hali) ---
    let relevantContent = '';
    let sourceFile: string | null = null;
    const lowerQuestion = question.toLowerCase();

    // Soru ile ilgili en alakalı belgeyi bulmaya çalış (basit anahtar kelime eşleştirme)
    for (const fileName in extracted_content) {
      const content = extracted_content[fileName];
      const lowerContent = content.toLowerCase();

      // Basit kelime eşleşmesi veya önceden tanımlanmış anahtar kelimeler
      const keywordsInQuestion = lowerQuestion.split(/\s+/).filter(word => word.length > 2); // 2 karakterden uzun kelimeler
      const isRelevantByKeywords = keywordsInQuestion.some(keyword => lowerContent.includes(keyword));

      if (
        isRelevantByKeywords ||
        (lowerQuestion.includes('battery') && lowerContent.includes('battery')) ||
        (lowerQuestion.includes('charger') && lowerContent.includes('charger')) ||
        (lowerQuestion.includes('engine') && lowerContent.includes('engine')) ||
        (lowerQuestion.includes('repair') && lowerContent.includes('repair')) ||
        (lowerQuestion.includes('error') && lowerContent.includes('error')) ||
        (lowerQuestion.includes('fault') && lowerContent.includes('fault')) ||
        (lowerQuestion.includes('troubleshoot') && lowerContent.includes('troubleshoot')) ||
        (lowerQuestion.includes('maintenance') && lowerContent.includes('maintenance')) ||
        (lowerQuestion.includes('part') && lowerContent.includes('part'))
      ) {
        // İlgili belgenin ilk birkaç karakterini (token limitini aşmamak için) al
        // Daha iyi bir RAG için buraya chunking (parçalama) ve embedding arama eklenebilir.
        relevantContent += `\n--- Dosya: ${fileName} Başlangıç --- \n${content.substring(0, Math.min(content.length, 2500))}...\n`; // Daha fazla içerik alabiliriz.
        sourceFile = sourceFile ? `${sourceFile}, ${fileName}` : fileName;
        
        // Çok fazla içerik göndermemek için erken çıkış
        if (relevantContent.length > 5000) { // Toplamda 5000 karakterden fazla olmasın
          relevantContent += "\n[Daha fazla belge içeriği kesildi...]";
          break;
        }
      }
    }
    
    // Eğer belge içeriğinde doğrudan ilgili bilgi bulunamazsa, tüm yüklenmiş belgelerin başını kullan
    if (relevantContent.trim() === '') {
        console.warn("Doğrudan ilgili içerik bulunamadı. Tüm yüklü belgelerin başından genel bir özet oluşturuluyor.");
        relevantContent = `Aşağıdaki bakım belgeleri yüklendi. Soruyu bu belgelerdeki genel bilgilere dayanarak yanıtlamaya çalışın. Eğer sorunun cevabı doğrudan belgede yoksa, genel bilginizle veya belgede ilgili olmadığını belirterek yanıtlayın.\n`;
        let totalLen = relevantContent.length;
        for (const fileName in extracted_content) {
            const content = extracted_content[fileName];
            const snippet = content.substring(0, Math.min(content.length, 1000)); // Her belgeden 1000 karakter
            if (totalLen + snippet.length > 5000) { // Toplam prompt boyutu için tahmini limit
                relevantContent += `--- Dosya: ${fileName} Başlangıç ---\n${snippet}...\n`;
                break;
            }
            relevantContent += `--- Dosya: ${fileName} Başlangıç ---\n${snippet}...\n`;
            totalLen += snippet.length;
        }
    }


    // --- LLM'e Gönderilecek Prompt Oluşturma ---
    const prompt = `Aşağıdaki bakım belgelerinden alıntılar sağlandı. Bu alıntılara dayanarak, kullanıcının sorusuna detaylı ve doğru bir yanıt verin. Eğer belgede yeterli bilgi yoksa, bunu kibarca belirtin ve genel bilginizden faydalanarak (varsa) yardımcı olmaya çalışın. Yanıtı Türkçe verin.

Belgeler:
${relevantContent}

Kullanıcının Sorusu: "${question}"

Yanıt:`;

    console.log("LLM'e gönderilen Prompt (ilk 1000 karakter):", prompt.substring(0, Math.min(prompt.length, 1000)) + "...");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      answer: text,
      sourceFile: sourceFile || "Yüklenen belgeler", // Kaynak dosya bulunamazsa genel mesaj
    }, { status: 200 });

  } catch (error: any) {
    console.error('API /api/ask hatası:', error);
    // Hata mesajını frontend'e döndür
    return NextResponse.json(
      { message: 'Soru işlenirken sunucu tarafında bir hata oluştu.', error: error.message },
      { status: 500 }
    );
  }
}