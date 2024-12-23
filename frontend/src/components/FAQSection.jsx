import React, { useState } from 'react';
import './FAQSection.css';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Is Synchro free to use?",
      answer: "Yes, Synchro offers a free plan with essential features for small teams and individuals.",
    },
    {
      question: "Which programming languages are supported?",
      answer: "We support multiple languages including JavaScript, Python, C++, Java, and more.",
    },
    {
      question: "How secure is my code on Synchro?",
      answer: "Your code is securely stored with encryption, and only authorized team members can access it.",
    },
    {
      question: "Can I collaborate with external users?",
      answer: "Yes, you can invite external collaborators via a unique link or email invitation.",
    },
    {
      question: "Is there a limit on the number of users per workspace?",
      answer: "Our free plan supports up to 5 users per workspace. Upgrade to premium for unlimited users.",
    },
  ];

  return (
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <h3>{faq.question}</h3>
              <span className="faq-toggle">{activeIndex === index ? "-" : "+"}</span>
            </div>
            <div className="faq-answer">{activeIndex === index && <p>{faq.answer}</p>}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
