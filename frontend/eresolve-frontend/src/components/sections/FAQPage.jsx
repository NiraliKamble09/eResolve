import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageSquare, Mail, Phone, Clock, User, Shield, CreditCard, Settings } from 'lucide-react';

const FAQPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const faqData = [
    {
      id: 1,
      category: 'Account',
      question: t('faqQ1', 'How do I create a new account?'),
      answer: t('faqA1', 'To create a new account, click on the "Sign Up" button on the homepage. Fill in your personal information including name, email, and password. You will receive a verification email to activate your account. Follow the link in the email to complete the registration process.'),
      icon: <User className="w-5 h-5" />
    },
    {
      id: 2,
      category: 'Account',
      question: t('faqQ2', 'I forgot my password. How can I reset it?'),
      answer: t('faqA2', 'Click on "Forgot Password" on the login page. Enter your registered email address and we will send you a password reset link. Follow the instructions in the email to create a new password. Make sure to use a strong password with at least 8 characters.'),
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 3,
      category: 'Account',
      question: t('faqQ3', 'How do I update my profile information?'),
      answer: t('faqA3', 'Log into your account and navigate to the "Profile Settings" section. Here you can update your personal information, contact details, and preferences. Remember to save your changes before leaving the page.'),
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 4,
      category: 'Complaints',
      question: t('faqQ4', 'How do I submit a complaint?'),
      answer: t('faqA4', 'To submit a complaint, log into your account and go to the "New Complaint" section. Fill out the complaint form with a clear title, detailed description, select the appropriate category and priority level. You can also upload supporting documents or photos. Click "Submit" to send your complaint to our support team.'),
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      id: 5,
      category: 'Complaints',
      question: t('faqQ5', 'How can I track the status of my complaint?'),
      answer: t('faqA5', 'You can track your complaint status by logging into your account and visiting the "My Complaints" section. Each complaint shows its current status (Open, In Progress, Resolved, or Closed) along with any updates from our support team. You will also receive email notifications when the status changes.'),
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 6,
      category: 'Complaints',
      question: t('faqQ6', 'Can I upload files with my complaint?'),
      answer: t('faqA6', 'Yes, you can upload supporting documents, images, or screenshots with your complaint. We accept common file formats including JPG, PNG, PDF, and DOC files. Each file should be under 10MB in size. Multiple files can be uploaded for a single complaint.'),
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      id: 7,
      category: 'Complaints',
      question: t('faqQ7', 'Can I delete or edit my complaint after submission?'),
      answer: t('faqA7', 'You can delete your complaint from the "My Complaints" section if it has not been assigned to a staff member yet. However, you cannot edit the content of a submitted complaint. If you need to add more information, you can submit a new complaint or contact our support team.'),
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      id: 8,
      category: 'Billing',
      question: t('faqQ8', 'How does the billing system work?'),
      answer: t('faqA8', 'Our billing system processes charges automatically based on your subscription plan. You will receive an invoice via email before each billing cycle. We accept major credit cards and bank transfers. You can view your billing history and update payment methods in your account settings.'),
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: 9,
      category: 'Billing',
      question: t('faqQ9', 'Why was I charged twice for the same service?'),
      answer: t('faqA9', 'Double charging can occur due to payment processing delays or system errors. If you see duplicate charges, please submit a billing complaint with your invoice details. Our billing team will investigate and process a refund if necessary. Refunds typically take 3-5 business days to appear in your account.'),
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: 10,
      category: 'Technical',
      question: t('faqQ10', 'I cannot log into my account. What should I do?'),
      answer: t('faqA10', 'First, check that you are using the correct email and password. Try clearing your browser cache and cookies. If the problem persists, try resetting your password or contact our technical support team. Make sure your internet connection is stable and try using a different browser.'),
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 11,
      category: 'Technical',
      question: t('faqQ11', 'The website is loading slowly. How can I fix this?'),
      answer: t('faqA11', 'Slow loading can be caused by internet connection issues, browser problems, or server load. Try refreshing the page, clearing your browser cache, or using a different browser. Check your internet speed and try accessing the site from a different device. If the problem continues, please report it as a technical complaint.'),
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 12,
      category: 'Technical',
      question: t('faqQ12', 'Can I use the system on mobile devices?'),
      answer: t('faqA12', 'Yes, our system is fully responsive and works on smartphones and tablets. You can access all features including submitting complaints, tracking status, and uploading files from mobile devices. We recommend using the latest version of your mobile browser for the best experience.'),
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 13,
      category: 'General',
      question: t('faqQ13', 'How long does it take to resolve a complaint?'),
      answer: t('faqA13', 'Response times vary based on complaint complexity and priority level. High priority complaints are typically addressed within 24 hours, medium priority within 48 hours, and low priority within 72 hours. You will receive regular updates throughout the resolution process.'),
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 14,
      category: 'General',
      question: t('faqQ14', 'Can I contact support directly?'),
      answer: t('faqA14', 'Yes, you can contact our support team through multiple channels: submit a complaint through the portal, send an email to support@company.com, or call our helpline at 1-800-SUPPORT. Our support hours are Monday to Friday, 9 AM to 6 PM EST.'),
      icon: <Phone className="w-5 h-5" />
    },
    {
      id: 15,
      category: 'General',
      question: t('faqQ15', 'Is my personal information secure?'),
      answer: t('faqA15', 'We take data security seriously. All personal information is encrypted and stored securely. We follow industry-standard security practices and comply with data protection regulations. Your information is never shared with third parties without your consent.'),
      icon: <Shield className="w-5 h-5" />
    }
  ];

  // Use untranslated keys for logic, translated for display
  const categoryKeys = ['All', 'Account', 'Complaints', 'Billing', 'Technical', 'General'];
  const categories = categoryKeys.map(key => ({
    key,
    label:
      key === 'All' ? t('allCategories', 'All') :
      key === 'Account' ? t('categoryAccount', 'Account') :
      key === 'Complaints' ? t('categoryComplaints', 'Complaints') :
      key === 'Billing' ? t('categoryBilling', 'Billing') :
      key === 'Technical' ? t('categoryTechnical', 'Technical') :
      key === 'General' ? t('categoryGeneral', 'General') : key
  }));

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t(`category${item.category}`, item.category).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Account': return <User className="w-5 h-5" />;
      case 'Complaints': return <MessageSquare className="w-5 h-5" />;
      case 'Billing': return <CreditCard className="w-5 h-5" />;
      case 'Technical': return <Settings className="w-5 h-5" />;
      case 'General': return <HelpCircle className="w-5 h-5" />;
      default: return <HelpCircle className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Account': return '#0A21C0';
      case 'Complaints': return '#050A44';
      case 'Billing': return '#2C2E3A';
      case 'Technical': return '#B3B4BD';
      case 'General': return '#0A21C0';
      default: return '#0A21C0';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6" style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      {/* Header */}
      <div className="mb-8 rounded-xl p-8 text-white" style={{background: 'linear-gradient(135deg, #0A21C0 0%, #050A44 100%)'}}>
        <div className="flex items-center justify-between mb-4 w-full">
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-12 h-12" />
              <h1 className="text-4xl font-bold text-center">{t('faqHeader', 'Frequently Asked Questions')}</h1>
            </div>
          </div>
          <a href="/">
            <button className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 0a2 2 0 002-2v-5a2 2 0 00-2-2h-1.5" /></svg>
              {t('home', 'Home')}
            </button>
          </a>
        </div>
        <p className="text-xl opacity-90 max-w-2xl mx-auto text-center">
          {t('faqSubheader', 'Find quick answers to common questions about our complaint management system')}
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('faqSearchPlaceholder', 'Search FAQs...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 text-lg"
              style={{'--tw-ring-color': '#0A21C0'}}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 text-lg min-w-48"
            style={{'--tw-ring-color': '#0A21C0'}}
          >
            {categories.map(category => (
              <option key={category.key} value={category.key}>{category.label}</option>
            ))}
          </select>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {categories.slice(1).map(category => {
            const count = faqData.filter(item => item.category === category.key).length;
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category.key 
                    ? 'text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: selectedCategory === category.key ? getCategoryColor(category.key) : undefined
                }}
              >
                {getCategoryIcon(category.key)}
                <span className="font-medium">{category.label}</span>
                <span className="text-xs opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredFAQs.length === faqData.length 
            ? t('faqShowingAll', { count: filteredFAQs.length, defaultValue: 'Showing all {{count}} questions' })
            : t('faqFoundResults', { count: filteredFAQs.length, defaultValue: 'Found {{count}} result(s)' })
          }
          {selectedCategory !== 'All' && ` ${t('faqInCategory', { category: categories.find(c => c.key === selectedCategory)?.label || selectedCategory, defaultValue: 'in {{category}}' })}`}
          {searchTerm && ` ${t('faqForSearch', { search: searchTerm, defaultValue: 'for "{{search}}"' })}`}
        </p>
      </div>

      {/* FAQ Items */}
      {filteredFAQs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <HelpCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('faqNoResults', 'No FAQs found')}</h3>
          <p className="text-gray-600 mb-4">
            {t('faqNoResultsDesc', 'Try adjusting your search terms or browse different categories')}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory(t('allCategories', 'All'));
            }}
            className="px-4 py-2 text-white rounded-lg"
            style={{backgroundColor: '#0A21C0'}}
          >
            {t('faqShowAll', 'Show All FAQs')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFAQs.map((item) => {
            const isExpanded = expandedItems.has(item.id);
            return (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border-l-4" style={{borderColor: getCategoryColor(item.category)}}>
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full p-6 text-left flex items-start gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 p-2 rounded-lg" style={{backgroundColor: `${getCategoryColor(item.category)}15`, color: getCategoryColor(item.category)}}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-medium text-white"
                            style={{backgroundColor: getCategoryColor(item.category)}}
                          >
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.question}
                        </h3>
                        {!isExpanded && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.answer.substring(0, 150)}...
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="pl-16">
                      <div className="p-4 bg-gray-50 rounded-lg border-l-4" style={{borderColor: getCategoryColor(item.category)}}>
                        <p className="text-gray-700 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Contact Support Section */}
      <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{color: '#0A21C0'}}>{t('faqSupportTitle', 'Still need help?')}</h2>
          <p className="text-gray-600">{t('faqSupportDesc', "Can't find what you're looking for? Get in touch with our support team")}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors flex flex-col items-center justify-center">
            <div className="flex items-center justify-center w-full mb-4">
              <span className="w-12 h-12 p-3 rounded-lg flex items-center justify-center mr-3" style={{backgroundColor: '#0A21C0', color: 'white'}}>
                <MessageSquare className="w-6 h-6" />
              </span>
              <h3 className="font-semibold text-gray-900 text-left mb-0">{t('faqSupportCard1Title', 'Submit a Complaint')}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 text-left w-full pl-16">{t('faqSupportCard1Desc', 'Get personalized help by submitting a detailed complaint')}</p>
            <div className="w-full flex justify-start pl-16">
              <Link to="/userlogin">
                <button 
                  className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                  style={{backgroundColor: '#0A21C0'}}
                >
                  {t('faqSupportCard1Btn', 'Submit Complaint')}
                </button>
              </Link>
            </div>
          </div>

          <div className="text-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors flex flex-col items-center justify-center">
            <div className="flex items-center justify-center w-full mb-4">
              <span className="w-12 h-12 p-3 rounded-lg flex items-center justify-center mr-3" style={{backgroundColor: '#050A44', color: 'white'}}>
                <Mail className="w-6 h-6" />
              </span>
              <h3 className="font-semibold text-gray-900 text-left mb-0">{t('faqSupportCard2Title', 'Email Support')}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 text-left w-full pl-16">{t('faqSupportCard2Desc', "Send us an email and we'll respond within 24 hours")}</p>
            <div className="w-full flex justify-start pl-16">
              <a 
                href="mailto:support@company.com"
                className="inline-block px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{backgroundColor: '#050A44'}}
              >
                {t('faqSupportCard2Btn', 'support@company.com')}
              </a>
            </div>
          </div>

          <div className="text-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors flex flex-col items-center justify-center">
            <div className="flex items-center justify-center w-full mb-4">
              <span className="w-12 h-12 p-3 rounded-lg flex items-center justify-center mr-3" style={{backgroundColor: '#2C2E3A', color: 'white'}}>
                <Phone className="w-6 h-6" />
              </span>
              <h3 className="font-semibold text-gray-900 text-left mb-0">{t('faqSupportCard3Title', 'Call Support')}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 text-left w-full pl-16">{t('faqSupportCard3Desc', 'Speak directly with our support team')}</p>
            <div className="w-full flex justify-start pl-16">
              <a 
                href="tel:1-800-SUPPORT"
                className="inline-block px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{backgroundColor: '#2C2E3A'}}
              >
                {t('faqSupportCard3Btn', '1-800-SUPPORT')}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-1">
            <Clock className="w-4 h-4" />
            {t('faqSupportHours', 'Support Hours: Monday - Friday, 9:00 AM - 6:00 PM EST')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;