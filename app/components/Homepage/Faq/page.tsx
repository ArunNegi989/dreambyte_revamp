"use client";

import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import styles from "./Faq.module.css";

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    question:
      "What makes Dream Byte Solutions the Best Digital Marketing Agency in Dehradun, Uttarakhand?",
    answer:
      "Dream Byte Solutions is considered in the top 10 Digital Marketing agencies in Dehradun Uttarakhand because of it's successful outcomes, expert staff, and personalized strategies for each business.",
  },
  {
    question: "How does Dream Byte Solutions drive growth for local business?",
    answer:
      "Dream Byte Solutions assists local businesses through targeted SEO, branding, and advertising services to enhance visibility, traffic, and sales.",
  },
  {
    question: "What services does Dream Byte Solutions offer?",
    answer:
      "Dream Byte Solutions is a top digital marketing Agency in Dehradun providing SEO, social media marketing, Google Ads, web development, and website design services.",
  },
  {
    question: "What Industries does Dream Byte Solutions serve?",
    answer:
      "Dream Byte Solutions serves healthcare, education, travel & tourism, e-commerce, startups, and corporate businesses with expert `Digital Marketing Services in Dehradun`",
  },
  {
    question: "Can I visit the Dream Byte Solutions office for consultations?",
    answer:
      "Yes, you are welcome to meet us in our office for a complimentary consultation. Dream Byte Solutions, is always available to guide and assist you.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className={styles.faq}>
      <div className={styles.container}>
        <h2 className={styles.heading}>FAQ&apos;s</h2>

        <div className={styles.list}>
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className={styles.item}>
                <button
                  className={styles.questionRow}
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={`${styles.question} ${
                      isOpen ? styles.questionOpen : ""
                    }`}
                  >
                    {item.question}
                  </span>
                  <span
                    className={`${styles.iconWrap} ${
                      isOpen ? styles.iconWrapOpen : ""
                    }`}
                  >
                    {isOpen ? <FaMinus size={14} /> : <FaPlus size={14} />}
                  </span>
                </button>

                <div
                  className={`${styles.answerWrap} ${
                    isOpen ? styles.answerWrapOpen : ""
                  }`}
                >
                  <p className={styles.answer}>{item.answer}</p>
                </div>

                {index !== FAQ_DATA.length - 1 && (
                  <div className={styles.divider} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}