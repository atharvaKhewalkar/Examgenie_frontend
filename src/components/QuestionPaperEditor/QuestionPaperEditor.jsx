import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './QuestionPaperEditor.css';

const QuestionPaperEditor = () => {
  const [questions, setQuestions] = useState([
    { text: "What is Machine Learning?" },
    { text: "Explain supervised vs unsupervised learning with examples." },
    { text: "Describe the steps involved in building a machine learning model." },
    { text: "What is overfitting and how can it be prevented?" },
    { text: "Compare decision trees and random forests." }
  ]);

  const [isPrintMode, setIsPrintMode] = useState(false);

  const handleEdit = (index, value) => {
    const updated = [...questions];
    updated[index].text = value;
    setQuestions(updated);
  };

  const handleDelete = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleSave = () => {
    console.log('Saved questions:', questions);
    alert('Changes saved!');
  };

  const downloadPDF = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      const input = document.getElementById('paper-preview');
      html2canvas(input).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('question_paper.pdf');
        setIsPrintMode(false);
      });
    }, 100);
  };

  return (
    <div className="editor-wrapper">
      <h2 className="editor-title">Question Paper Editor</h2>

      <div className="document-container" id="paper-preview">
        <h3 className={isPrintMode ? 'pdf-title' : 'hidden-preview'}>
          Department of Computer Science - Semester Exam
        </h3>

        {questions.map((q, index) => (
          <div key={index} className="question-block">
            {!isPrintMode && (
              <>
                <textarea
                  className="question-textarea"
                  value={`${index + 1}. ${q.text}`}
                  onChange={(e) =>
                    handleEdit(index, e.target.value.replace(/^\d+\.\s*/, ''))
                  }
                  rows={2}
                />
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(index)}
                >
                  🗑
                </button>
              </>
            )}
            {isPrintMode && (
              <div className="print-mode">{`${index + 1}. ${q.text}`}</div>
            )}
          </div>
        ))}
      </div>

      <div className="editor-actions">
        <button className="btn save-btn" onClick={handleSave}>
          💾 Save Changes
        </button>
        <button className="btn download-btn" onClick={downloadPDF}>
          ⬇️ Download PDF
        </button>
      </div>
    </div>
  );
};

export default QuestionPaperEditor;
