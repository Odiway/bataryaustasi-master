"use client";

import React, { useState, useRef } from 'react';
import { Upload, FileText, MessageSquare, Search, AlertCircle, CheckCircle, Clock, Wrench } from 'lucide-react';

// Type definitions
interface FileContent {
  [fileName: string]: string;
}

interface ConversationMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  sourceFile?: string;
}

const MaintenanceDocumentAnalyzer = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [extractedContent, setExtractedContent] = useState<FileContent>({});
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // Dosya yükleme durumu
  const [isAnswering, setIsAnswering] = useState<boolean>(false); // Soru yanıtlama durumu
  const [activeTab, setActiveTab] = useState<'upload' | 'analyze'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // handleFileUpload: Dosya yüklemeyi ve backend'e göndermeyi yönetir
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = Array.from(event.target.files || []);
    const newFiles = files.filter((file: File) =>
      file.type === 'application/pdf' ||
      file.type.includes('spreadsheet') ||
      file.type.includes('excel') ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls') ||
      file.type === 'text/csv' ||
      file.name.endsWith('.csv')
    );

    if (newFiles.length === 0) {
      alert('Lütfen sadece PDF, Excel veya CSV dosyaları yükleyiniz.');
      return;
    }

    setIsProcessing(true);
    setUploadedFiles(prev => [...prev, ...newFiles]);

    const formData = new FormData();
    newFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'Bilinmeyen Hata'}`);
      }

      const data = await response.json();
      console.log('Backend yanıtı (yükleme):', data);

      setExtractedContent(prev => ({
        ...prev,
        ...data.content
      }));

      alert('Dosyalar başarıyla yüklendi ve işlendi!');

      if (data.errors && data.errors.length > 0) {
        alert('Bazı dosyalar işlenirken sorun oluştu: ' + data.errors.join(', '));
      }

    } catch (error: any) {
      console.error('Dosya yükleme veya işleme hatası:', error);
      alert('Dosya yüklenirken veya işlenirken bir hata oluştu: ' + error.message);
      setUploadedFiles(prev => prev.filter(f => !newFiles.includes(f)));
    } finally {
      setIsProcessing(false);
    }
  };

  // handleQuestionSubmit: Kullanıcının sorusunu backend'e gönderir ve yanıtı alır
  const handleQuestionSubmit = async (): Promise<void> => {
    if (!currentQuestion.trim()) return;
    if (Object.keys(extractedContent).length === 0) {
        alert('Lütfen önce belge yükleyin.');
        return;
    }

    const userMessage: ConversationMessage = {
      type: 'user',
      content: currentQuestion,
      timestamp: new Date().toLocaleTimeString()
    };
    setConversation(prev => [...prev, userMessage]);
    setCurrentQuestion('');

    setIsAnswering(true); // Yanıtlama süreci başladı

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage.content,
          extracted_content: extractedContent, // Tüm işlenmiş belge içeriğini gönder
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'Bilinmeyen Hata'}`);
      }

      const data = await response.json();
      console.log('Backend yanıtı (soru):', data);

      const aiResponse: ConversationMessage = {
        type: 'ai',
        content: data.answer,
        sourceFile: data.sourceFile,
        timestamp: new Date().toLocaleTimeString()
      };

      setConversation(prev => [...prev, aiResponse]);

    } catch (error: any) {
      console.error('Soru sorma hatası:', error);
      const errorMessage: ConversationMessage = {
        type: 'ai',
        content: `Üzgünüm, sorunuzu yanıtlarken bir hata oluştu: ${error.message}. Lütfen konsolu kontrol edin.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsAnswering(false); // Yanıtlama süreci bitti
    }
  };

  const getFileIcon = (fileName: string): string => {
    if (fileName.toLowerCase().includes('pdf')) return '📄';
    if (fileName.toLowerCase().includes('xlsx') || fileName.toLowerCase().includes('excel')) return '📊';
    if (fileName.toLowerCase().includes('csv')) return '📑';
    return '📋';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3">
          <Wrench className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Maintenance Document Analyzer</h1>
            <p className="text-gray-600">TEMSA Industry 4.0 - Intelligent Document Q&A System</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="h-4 w-4 inline mr-2" />
              Upload Documents
            </button>
            <button
              onClick={() => setActiveTab('analyze')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'analyze'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Ask Questions
            </button>
          </nav>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="p-6">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload Maintenance Documents
              </h3>
              <p className="text-gray-600 mb-4">
                Drop PDF files (manuals, repair logs) or Excel/CSV files (technical specifications) here
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Choose Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Processing Indicator for file upload */}
            {isProcessing && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 animate-spin mr-3" />
                  <span className="text-blue-800">Processing documents...</span>
                </div>
              </div>
            )}

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h4>
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getFileIcon(file.name)}</span>
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {extractedContent[file.name] ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analyze Tab */}
        {activeTab === 'analyze' && (
          <div className="p-6">
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Uploaded</h3>
                <p className="text-gray-600">Please upload some documents first to start asking questions.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Question Input */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ask a question about your maintenance documents:
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={currentQuestion}
                      onChange={(e) => setCurrentQuestion(e.target.value)}
                      placeholder="e.g., We repaired a battery charger yesterday but it's giving errors today. Which parts did we use for that repair?"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleQuestionSubmit()}
                      disabled={isAnswering} // Disable input while AI is answering
                    />
                    <button
                      onClick={handleQuestionSubmit}
                      disabled={!currentQuestion.trim() || isAnswering} // Disable button while AI is answering
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isAnswering ? <Clock className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Processing Indicator for Q&A */}
                {isAnswering && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-blue-600 animate-spin mr-3" />
                        <span className="text-blue-800">Cevap hazırlanıyor...</span>
                    </div>
                )}

                {/* Sample Questions */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Sample Questions:</h4>
                  <div className="space-y-1 text-sm">
                    <button
                      onClick={() => setCurrentQuestion("We repaired a battery charger yesterday but it's giving errors today. Which parts did we use for that repair?")}
                      className="block text-blue-700 hover:text-blue-900 text-left"
                      disabled={isAnswering} // Disable sample questions while AI is answering
                    >
                      • "We repaired a battery charger yesterday but it's giving errors today. Which parts did we use?"
                    </button>
                    <button
                      onClick={() => setCurrentQuestion("What is the part number for the voltage regulator module?")}
                      className="block text-blue-700 hover:text-blue-900 text-left"
                      disabled={isAnswering}
                    >
                      • "What is the part number for the voltage regulator module?"
                    </button>
                    <button
                      onClick={() => setCurrentQuestion("How do I troubleshoot error code E07?")}
                      className="block text-blue-700 hover:text-blue-900 text-left"
                      disabled={isAnswering}
                    >
                      • "How do I troubleshoot error code E07?"
                    </button>
                  </div>
                </div>

                {/* Conversation History */}
                {conversation.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Conversation History</h4>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {conversation.map((message, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-100 ml-8'
                              : 'bg-gray-100 mr-8'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium">
                                  {message.type === 'user' ? 'Operator' : 'AI Assistant'}
                                </span>
                                <span className="text-xs text-gray-500">{message.timestamp}</span>
                              </div>
                              <div className="text-gray-800 whitespace-pre-line">
                                {message.content}
                              </div>
                              {message.sourceFile && (
                                <div className="mt-2 text-xs text-gray-600">
                                  Source: {message.sourceFile}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceDocumentAnalyzer;