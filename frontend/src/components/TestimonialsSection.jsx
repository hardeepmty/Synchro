import React from 'react';
import './TestimonialsSection.css';

const testimonials = [
  {
    name: "Jane Doe",
    role: "Software Engineer",
    feedback: "Synchro transformed the way we collaborate remotely. It's seamless and efficient!",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "John Smith",
    role: "Team Lead",
    feedback: "The real-time collaboration feature is a game-changer for our team.",
    image: "https://i.pravatar.cc/150?img=10",
  },
  {
    name: "Alice Johnson",
    role: "Product Manager",
    feedback: "Using Synchro has streamlined our processes and saved countless hours.",
    image: "https://i.pravatar.cc/150?img=20",
  },
  {
    name: "Mike Brown",
    role: "DevOps Engineer",
    feedback: "The support for multiple languages and real-time updates is outstanding.",
    image: "https://i.pravatar.cc/150?img=25",
  },
];


const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">
      <h2>What Our Users Say</h2>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <img src={testimonial.image} alt={`${testimonial.name}`} className="user-image" />
            <p className="testimonial-feedback">"{testimonial.feedback}"</p>
            <span className="testimonial-name">{testimonial.name}</span>
            <span className="testimonial-role">{testimonial.role}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
