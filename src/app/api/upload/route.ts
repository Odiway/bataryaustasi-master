import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// PDF işleme şu an için manuel olarak devre dışı bırakılmıştır.
// Eğer pdf-parse sorununu çözerseniz (daha karmaşık olabilir), bu satırı aktif edebilirsiniz:
// import pdf from 'pdf-parse';

import * as xlsx from 'xlsx'; // xlsx kütüphanesinin kurulu olduğundan emin olun

// Geçici olarak yüklenecek dosyaların depolama dizini
const uploadDir = path.join(process.cwd(), 'uploads');

export async function POST(req: NextRequest) {
  // Yükleme dizininin var olduğundan emin olun
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const processedContents: { [fileName: string]: string } = {};
  const errors: string[] = [];

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json({ message: 'No files uploaded.' }, { status: 400 });
    }

    for (const file of files) {
      const fileName = file.name;
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const tempFilePath = path.join(uploadDir, `${Date.now()}-${fileName}`);

      fs.writeFileSync(tempFilePath, fileBuffer); // Dosyayı geçici olarak diske yaz

      let extractedData = '';

      try {
        if (file.type === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
          // PDF işleme şu anda devre dışı bırakılmıştır.
          // Eğer pdf-parse hatasını çözerseniz aşağıdaki yorum satırlarını açabilirsiniz.
          // const pdf = (await import('pdf-parse')).default; // Dinamik import
          // const data = await pdf(fileBuffer);
          // extractedData = data.text || '';
          extractedData = `PDF işleme şu anda devre dışı: ${fileName}`;
          errors.push(`PDF işleme atlandı (pdf-parse kütüphanesi hatası nedeniyle): ${fileName}`);
        } else if (file.type && (file.type.includes('excel') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv'))) {
          // Excel ve CSV işleme
          const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
          workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false });
            extractedData += `\n--- Sayfa: ${sheetName} ---\n`;
            (jsonData as any[][]).forEach((row: any[]) => {
              extractedData += row.join('\t') + '\n';
            });
          });
        } else {
          // Desteklenmeyen diğer dosya türleri veya resim tabanlı dosyalar için OCR denemesi (şimdilik basit)
          console.warn(`Attempting OCR for unsupported type or image: ${fileName}`);
          extractedData = `Metin tanıma (OCR) desteği bu aşamada sınırlıdır. Dosya: ${fileName}`;
          errors.push(`OCR (Tesseract.js) entegrasyonu sunucu tarafında ek kurulum gerektirir. Dosya: ${fileName}`);
        }
        processedContents[fileName] = extractedData;

      } catch (fileProcessError: any) {
        console.error(`Error processing file ${fileName}:`, fileProcessError);
        processedContents[fileName] = `Hata: Dosya işlenemedi. ${fileProcessError.message}`;
        errors.push(`Dosya işleme hatası ${fileName}: ${fileProcessError.message}`);
      } finally {
        try {
          fs.unlinkSync(tempFilePath); // İşlem bitince geçici dosyayı sil
        } catch (unlinkError) {
          console.error(`Error deleting temp file ${tempFilePath}:`, unlinkError);
        }
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({
        message: 'Bazı dosyalar işlenirken sorun oluştu.',
        content: processedContents,
        errors: errors
      }, { status: 206 }); // 206 Partial Content
    }

    return NextResponse.json({
      message: 'Dosyalar başarıyla yüklendi ve işlendi',
      content: processedContents
    }, { status: 200 }); // 200 OK

  } catch (err: any) {
    console.error('File upload or processing error:', err);
    return NextResponse.json({ message: 'Internal server error during file upload.', error: err.message }, { status: 500 }); // 500 Internal Server Error
  }
}