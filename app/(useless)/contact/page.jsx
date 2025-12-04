const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-rose-500 mb-8">
          Contact Us
        </h1>
        <p className="text-center text-black mb-12">
        We&apos;d love to hear from you! Whether you have questions about our recruitment services, need assistance with your job search, or want to inquire about our hiring process, our team is here to help.</p>

<p className="text-center text-black mb-12"><strong>Get in Touch</strong></p>

<p className="text-center text-black mb-12"><strong>Phone:</strong> +91 987654321</p>
<p className="text-center text-black mb-12"><strong>Email:</strong> EmploEase@gmail.com</p>
<p className="text-center text-black mb-12"><strong>Address:</strong> 1, Bhoot Bangla, Lal Dungri Road, Mumbai</p>
<p className="text-center text-black mb-12"><strong>Business Hours:</strong> 9am-5pm</p>

<p className="text-center text-black mb-12"><strong>For Job Seekers</strong></p>
<p className="text-center text-black mb-12">If you&apos;re looking for your next career opportunity or have questions about job applications, please reach out to us at EmploEasejobs@gmail.com.</p>

<p className="text-center text-black mb-12"><strong>For Employers</strong></p>
<p className="text-center text-black mb-12">For inquiries about our recruitment services, partnership opportunities, or to discuss your hiring needs, contact us at EmploEasejobs@gmail.com.</p>

<p className="text-center text-black mb-12"><strong>General Inquiries</strong></p>
<p className="text-center text-black mb-12">For any general questions or feedback, feel free to use our contact form below, and we&apos;ll get back to you as soon as possible.</p>


        <div className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-md">
          <form>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-black font-semibold mb-2"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border border-rose-400 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-black font-semibold mb-2"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-rose-400 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="subject"
                className="block text-black font-semibold mb-2"
              >
                Subject:
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-2 border border-rose-400 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-black font-semibold mb-2"
              >
                Message:
              </label>
              <textarea
                id="message"
                name="message"
                required
                className="w-full px-4 py-2 border border-rose-400 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 h-32 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 active:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <p className="text-center text-black mb-12">Thank you for your interest in EmploEase. We look forward to connecting with you!</p>
    </div>
    
  );
};

export default ContactPage;