import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Star } from 'lucide-react';

const Home = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com'}/api/orders/feedbacks`);
        if (response.data.success && response.data.data.length > 0) {
          setFeedbacks(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
      }
    };
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (feedbacks.length > 1) {
      const interval = setInterval(() => {
        setCurrentFeedbackIndex((prev) => (prev + 1) % feedbacks.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [feedbacks]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-20 px-4 md:px-12 flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto mt-20">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Authentic Biryani<br />Delivered Hot & Fresh
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            Experience the true taste of tradition with our signature biryani, cooked with premium basmati rice, tender meat, and aromatic spices.
          </p>
          <div className="flex gap-4 pt-4">
            <Link to="/checkout" className="bg-amber-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-amber-700 transition">
              Order Now
            </Link>
            <Link to="/menu" className="bg-gray-100 text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition">
              View Menu
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <img 
            src="/Chicken-Biryani-Recipe-removebg-preview.png" 
            alt="Biryani" 
            className="w-full max-w-lg mx-auto drop-shadow-2xl"
          />
        </div>
      </section>

      {/* Specialties */}
      <section className="py-20 px-4 md:px-12 bg-gray-50 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Specialties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {['Chicken Biryani', 'Mutton Biryani', 'Egg Biryani', 'Vegetarian Options'].map((item) => (
            <div key={item} className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-gray-900">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 px-4 md:px-12 bg-white max-w-7xl mx-auto rounded-3xl mb-20 shadow-sm border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Customers Say</h2>
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={24} fill="#eab308" className="text-yellow-500" />)}
          </div>
          
          {feedbacks.length > 0 ? (
            <div key={feedbacks[currentFeedbackIndex]._id} className="animate-fade-in transition-opacity duration-500">
              <p className="text-xl md:text-2xl text-gray-700 italic mb-8">
                "{feedbacks[currentFeedbackIndex].feedback.comment || 'Amazing taste and excellent service!'}"
              </p>
              <div>
                <strong className="block text-lg text-gray-900">{feedbacks[currentFeedbackIndex].customer.name}</strong>
                <span className="text-gray-500">{feedbacks[currentFeedbackIndex].customer.city}</span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xl md:text-2xl text-gray-700 italic mb-8">
                "We ordered Engineer's Biriyani for our family get-together, and they absolutely nailed the authentic taste."
              </p>
              <div>
                <strong className="block text-lg text-gray-900">Priya Sharma</strong>
                <span className="text-gray-500">Food Blogger, Chennai</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
