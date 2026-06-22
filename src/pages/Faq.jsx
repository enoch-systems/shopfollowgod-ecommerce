import React, { useState } from "react";
import Footer from "../pages/Footer";
import MountReveal from '../components/MountReveal';
import { ChevronDown, Search, Mail, MessageCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: "Do I have to create an account or register before shopping?",
    a: "No you don't, simply fill your delivery details at checkout.",
    category: "orders",
  },
  {
    q: "Are your outfits readily available for dispatch?",
    a: "Most items are stocked and ready to ship. If an item is out of stock it will be indicated on the product page.",
    category: "orders",
  },
  {
    q: "How long does delivery take?",
    a: "Delivery times vary by location — typically 2-7 business days domestically. International shipments take longer depending on destination.",
    category: "shipping",
  },
  {
    q: "I placed an order but I didn't get any mail from you?",
    a: "Check your spam folder first. If you still don't see order confirmation, email followgodng01@gmail.com with your order details.",
    category: "orders",
  },
  {
    q: "Do you take custom orders?",
    a: "Yes — for custom orders please contact us with the design details and we'll advise on pricing and lead time.",
    category: "orders",
  },
  {
    q: "What are your terms for exchange?",
    a: "Items must be unworn, with tags attached and returned within 14 days. Contact support to start an exchange.",
    category: "returns",
  },
  {
    q: "Do you accept card payment on this site?",
    a: "No we currently accept order(s) via Whatsapp for now.",
    category: "payments",
  },
  {
    q: "How do I know the size to order?",
    a: "Please consult the size guide on each product page. If unsure, reach out to support and we'll help pick the right size.",
    category: "orders",
  },
  {
    q: "Is shopping on this site safe?",
    a: "Yes — we use industry-standard security for checkout and never store your full payment details on our servers.",
    category: "security",
  },
  {
    q: "How can I get discounts?",
    a: "Subscribe to our mailing list or follow us on social media for exclusive offers and early drops.",
    category: "orders",
  },
  {
    q: "Do you have a walk-in store?",
    a: "Currently we operate online only — any pop-up or physical locations will be announced on our channels.",
    category: "orders",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  function toggle(i) {
    setOpenIndex((prev) => (prev === i ? -1 : i));
  }

  const filteredItems = FAQ_ITEMS.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <MountReveal className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
        {/* Simple header */}
        <div style={{ borderBottom: "1px solid #e5e7eb" }}>
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              padding: "48px 20px 36px",
            }}
            className="faq-header"
          >
            <style>{`
              @media (min-width: 768px) {
                .faq-header {
                  padding: 100px 24px 48px !important;
                }
              }
              @media (min-width: 1024px) {
                .faq-header {
                  padding: 140px 24px 56px !important;
                }
              }
            `}</style>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#9ca3af",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Help Center
              </p>
              <h1
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  fontWeight: 500,
                  color: "#111827",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  marginBottom: 12,
                }}
              >
                Frequently Asked Questions
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: "#6b7280",
                  lineHeight: 1.6,
                  maxWidth: 480,
                  margin: "0 auto",
                }}
              >
                Find answers to common questions about ordering, shipping, returns, and more.
              </p>

              {/* Search */}
              <div
                style={{
                  maxWidth: 400,
                  margin: "28px auto 0",
                  position: "relative",
                }}
              >
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#d1d5db",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px 11px 40px",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    background: "#f9fafb",
                    color: "#111827",
                    fontSize: 14,
                    outline: "none",
                    transition: "all 0.15s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#9ca3af";
                    e.target.style.background = "#ffffff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.background = "#f9fafb";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "36px 20px 64px",
          }}
          className="faq-list"
        >
          <style>{`
            @media (min-width: 768px) {
              .faq-list {
                padding: 80px 24px 100px !important;
              }
            }
            @media (min-width: 1024px) {
              .faq-list {
                padding: 120px 24px 140px !important;
              }
            }
          `}</style>
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <Search size={32} style={{ color: "#d1d5db", marginBottom: 12 }} />
              <p style={{ fontSize: 15, fontWeight: 500, color: "#374151", marginBottom: 6 }}>No results found</p>
              <p style={{ fontSize: 13, color: "#9ca3af" }}>
                Try a different search term.
              </p>
            </div>
          ) : (
            filteredItems.map((item, i) => {
              const isOpen = openIndex === i;
              const contentId = `faq-item-${i}`;
              return (
                <div
                  key={i}
                  style={{
                    borderBottom: i < filteredItems.length - 1 ? "1px solid #f3f4f6" : "none",
                  }}
                >
                  <button
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => toggle(i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      padding: "18px 0",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                      transition: "opacity 0.15s ease",
                    }}
                    className="faq-question"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: "#111827",
                        lineHeight: 1.5,
                        flex: 1,
                        minWidth: 0,
                      }}
                      className="faq-question-text"
                    >
                      {item.q}
                    </span>
                    <div
                      style={{
                        flexShrink: 0,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                      }}
                    >
                      <ChevronDown size={16} color="#9ca3af" />
                    </div>
                  </button>

                  <div
                    id={contentId}
                    style={{
                      overflow: "hidden",
                      transition: "max-height 0.25s ease",
                      maxHeight: isOpen ? 300 : 0,
                    }}
                  >
                    <div
                      style={{
                        padding: "0 0 18px 0",
                        fontSize: 14.5,
                        color: "#6b7280",
                        lineHeight: 1.7,
                      }}
                      className="faq-answer"
                    >
                      {item.a}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Contact CTA */}
          <div
            style={{
              marginTop: 48,
              padding: "28px 20px",
              background: "#f9fafb",
              borderRadius: 12,
              border: "1px solid #f3f4f6",
              textAlign: "center",
            }}
            className="faq-cta"
          >
            <style>{`
              @media (min-width: 768px) {
                .faq-cta {
                  margin-top: 80px !important;
                  padding: 40px !important;
                }
              }
              @media (min-width: 1024px) {
                .faq-cta {
                  margin-top: 120px !important;
                  padding: 48px !important;
                }
              }
            `}</style>
            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#374151",
                marginBottom: 4,
              }}
            >
              Still need help?
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#9ca3af",
                marginBottom: 20,
              }}
            >
              Our support team is ready to assist you.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="mailto:followgodng01@gmail.com"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 20px",
                  borderRadius: 8,
                  background: "#111827",
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#374151";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#111827";
                }}
              >
                <Mail size={14} />
                Email Support
              </a>
              <a
                href="https://wa.me/2349031161058"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 20px",
                  borderRadius: 8,
                  background: "#ffffff",
                  color: "#374151",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  border: "1px solid #e5e7eb",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#d1d5db";
                  e.currentTarget.style.background = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.background = "#ffffff";
                }}
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </MountReveal>
      <Footer />
    </>
  );
};

export default Faq;