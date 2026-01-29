import React, { useState } from 'react';
import axios from 'axios';
import { Eraser, Sparkles } from "lucide-react";


const DocumentConverter = () => {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfName, setPdfName] = useState('');

  const handleTextToPdf = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPdfBlob(null);
    try {
      const response = await axios.post(
        '/api/convert/text-to-pdf',
        { text },
        { responseType: 'blob' }
      );
      setPdfBlob(response.data);
      setPdfName('text.pdf');
    } catch (err) {
      setError('Failed to convert text to PDF.');
    }
    setLoading(false);
    setText('');
  };

  const handleFileToPdf = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPdfBlob(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('/api/convert/file-to-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });
      setPdfBlob(response.data);
      setPdfName('file.pdf');
    } catch (err) {
      setError('Failed to convert file to PDF.');
    }
    setLoading(false);
    setFile(null);
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = window.URL.createObjectURL(new Blob([pdfBlob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', pdfName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          {/*<span className="inline-block w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>*/}
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Document Converter</h1>
        </div>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode('text')}
            className={`px-4 py-1 rounded-full border text-sm ${mode === 'text' ? 'bg-blue-50 text-blue-700 border-blue-400' : 'bg-gray-100 text-gray-600 border-gray-300'}`}
          >
            Text to PDF
          </button>
          <button
            type="button"
            onClick={() => setMode('file')}
            className={`px-4 py-1 rounded-full border text-sm ${mode === 'file' ? 'bg-blue-50 text-blue-700 border-blue-400' : 'bg-gray-100 text-gray-600 border-gray-300'}`}
          >
            File to PDF
          </button>
        </div>
        {mode === 'text' ? (
          <form onSubmit={handleTextToPdf}>
            <label className="block text-sm font-medium mb-2">Enter Text</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={7}
              placeholder="Enter your text here..."
              className="w-full mb-3 p-2 rounded-md border border-gray-300"
              required
            />
            <button type="submit" disabled={loading} className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
              {loading ? 'Converting...' : 'Convert to PDF'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleFileToPdf}>
            <label className="block text-sm font-medium mb-2">Upload File</label>
            <input
              type="file"
              accept=".txt,.jpg,.jpeg,.png"
              onChange={e => setFile(e.target.files[0])}
              className="mb-3"
              required
            />
            <button type="submit" disabled={loading || !file} className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
              {loading ? 'Converting...' : 'Convert to PDF'}
            </button>
          </form>
        )}
        {error && <div className="text-red-500 mt-3 text-sm">{error}</div>}
        <div className="mt-4 text-xs text-gray-500">Supported file types: .txt, .jpg, .jpeg, .png</div>
      </div>
      {/* Right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-block w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
          <h1 className="text-lg font-semibold">PDF Output</h1>
        </div>
        {!pdfBlob ? (
          <div className="flex-1 flex justify-center items-center text-gray-400 text-sm">
            <p>Convert your text or file to PDF and download it here.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 mt-4">
            <span className="text-[#4A7AFF] font-medium">PDF ready to download</span>
            <button
              onClick={handleDownload}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow"
            >
              Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentConverter;
