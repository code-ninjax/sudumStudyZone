'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import { ChevronDown, ChevronUp, Send } from 'lucide-react'
import Button from '@/components/Button'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [question, setQuestion] = useState('')

  const faqs = [
    {
      question: 'How do I access course materials?',
      answer: 'Once you\'re logged in, navigate to the Courses page and select your enrolled course. All materials including lecture notes, past questions, and marking schemes will be available for download.',
    },
    {
      question: 'How do I submit assignments?',
      answer: 'Go to your Dashboard, find the assignment under "Upcoming Assignments," and click on it. You\'ll be able to upload your work before the due date.',
    },
    {
      question: 'What is the Study Hub?',
      answer: 'The Study Hub is a collection of additional learning resources including video tutorials, cheat sheets, and study guides. Visit daily to earn points and maintain your learning streak!',
    },
    {
      question: 'How does the points system work?',
      answer: 'You earn points by visiting the Study Hub daily, submitting assignments on time, and completing courses. Points contribute to your overall progress and unlock achievements.',
    },
    {
      question: 'Can I download eBooks for offline reading?',
      answer: 'Yes! All eBooks in our library are available for download. Simply click the "Download" button on any eBook card.',
    },
    {
      question: 'How do I reset my password?',
      answer: 'On the login page, click "Forgot password?" and follow the instructions sent to your registered email address.',
    },
    {
      question: 'Are the courses self-paced?',
      answer: 'Most courses follow a structured schedule with specific deadlines for assignments. However, you can access materials at any time within the course duration.',
    },
    {
      question: 'How can I contact my instructor?',
      answer: 'You can reach out through the Contact page or check your course page for specific instructor office hours and contact information.',
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Question submitted:', question)
    setQuestion('')
  }

  return (
    <div className="min-h-screen bg-subtle-light dark:bg-background-dark py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about using AcademicHub
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-12 space-y-4 animate-slide-up">
          {faqs.map((faq, index) => (
            <Card key={index} className="cursor-pointer" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">
                    {faq.question}
                  </h3>
                  {openIndex === index && (
                    <p className="text-gray-700 dark:text-gray-300 mt-3 animate-slide-down">
                      {faq.answer}
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-primary-light dark:text-primary-dark" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Ask a Question Form */}
        <div className="max-w-2xl mx-auto animate-fade-in">
          <Card className="bg-gradient-to-br from-primary-light/5 to-accent-light/5 dark:from-primary-dark/5 dark:to-accent-dark/5">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              Didn't find your answer?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Submit your question and we'll get back to you as soon as possible.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                className="input-field resize-none"
                placeholder="Type your question here..."
                required
              />
              <Button type="submit" variant="primary" className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Submit Question
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
