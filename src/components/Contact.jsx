// src/components/Contact.jsx

import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  Send,
  MessageCircle,
} from "lucide-react";

function Contact() {
  return (
    <section
      id="contact"
      className="relative py-24 bg-black text-white overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-red-800/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-500/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 text-yellow-400 bg-white/5 text-sm mb-5">
            <MessageCircle size={16} />
            Contact Us
          </span>

          <h2 className="text-4xl md:text-5xl font-bold">
            Get In <span className="text-yellow-500">Touch</span>
          </h2>

          <p className="text-gray-400 mt-5 leading-relaxed">
            Have a question, want to reserve a table or order delicious food?
            We’re always ready to serve you.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-10 mt-16">
          
          {/* Left Info */}
          <div className="space-y-6">
            
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 flex items-center justify-center">
                  <MapPin size={22} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">Address</h3>
                  <p className="text-gray-400 mt-1">
                    Mumbai, Maharashtra, India
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 flex items-center justify-center">
                  <Phone size={22} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">Phone</h3>
                  <p className="text-gray-400 mt-1">
                    +91 1234567899
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 flex items-center justify-center">
                  <Mail size={22} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">Email</h3>
                  <p className="text-gray-400 mt-1">
                    gunnuchinese@gmail.com
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 flex items-center justify-center">
                  <Clock3 size={22} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">Opening Hours</h3>
                  <p className="text-gray-400 mt-1">
                    Mon - Sun : 10 AM - 11 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
            <h3 className="text-2xl font-semibold mb-6">
              Send Message
            </h3>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10 focus:border-yellow-500 outline-none"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10 focus:border-yellow-500 outline-none"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10 focus:border-yellow-500 outline-none"
              />

              <textarea
                rows="5"
                placeholder="Write Your Message..."
                className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10 focus:border-yellow-500 outline-none resize-none"
              ></textarea>

              <button
                type="submit"
                className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 font-semibold hover:scale-105 transition duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;