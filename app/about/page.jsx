const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-rose-500 mb-8">
          About Us
        </h1>
        <p className="text-center text-black mb-12">
          Welcome to our recruitment website. We are dedicated to connecting talented individuals with the right opportunities. Our mission is to simplify the hiring process and ensure both employers and job seekers find their perfect match.
        </p>
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-semibold text-rose-500 mb-6">
            Our Story
          </h2>
          <p className="text-black mb-6">
            Our company was founded with a vision to revolutionize the recruitment industry. With years of experience in the field, our team is committed to delivering top-notch services to both employers and job seekers. We believe in the power of connections and strive to make every hiring process smooth and efficient.
          </p>
          <h2 className="text-2xl font-semibold text-rose-500 mb-6">
            Our Team
          </h2>
          <p className="text-black mb-6">
            Our team consists of experienced professionals who are passionate about recruitment. Each member brings a unique set of skills and expertise, ensuring that we provide the best possible service. From recruiters to support staff, we are all dedicated to helping you achieve your career goals.
          </p>
          <h2 className="text-2xl font-semibold text-rose-500 mb-6">
            Our Values
          </h2>
          <ul className="list-disc list-inside text-black mb-6">
            <li className="mb-2">Integrity: We operate with transparency and honesty in all our dealings.</li>
            <li className="mb-2">Customer Focus: We put our clients' needs at the center of everything we do.</li>
            <li className="mb-2">Innovation: We continuously seek new ways to improve and adapt to industry changes.</li>
            <li className="mb-2">Excellence: We are committed to delivering high-quality services and results.</li>
          </ul>
          <p className="text-center text-black">
            Thank you for visiting our website. If you have any questions or need further information, feel free to <a href="/contact" className="text-blue-500 hover:underline">contact us</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
