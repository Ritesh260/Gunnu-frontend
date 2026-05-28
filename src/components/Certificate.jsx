// src/components/Certificate.jsx

import {
  ShieldCheck,
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

function Certificate() {
  return (
    <section
      id="certificate"
      className="relative py-24 bg-gradient-to-b from-black via-[#111111] to-black text-white overflow-hidden"
    >

      {/* Blur Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 blur-3xl rounded-full"></div>

      <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-600/10 blur-3xl rounded-full"></div>

      {/* Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* Heading */}
        <div className="text-center mb-16">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm mb-5">

            <ShieldCheck size={18} />

            Trusted & Certified

          </div>

          <h2 className="text-4xl sm:text-5xl font-bold leading-tight">

            Government Approved <br />

            <span className="text-yellow-500">
              Food Outlet
            </span>

          </h2>

          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">

            Gunnu Chinese Corner follows proper food safety,
            hygiene and government standards to ensure fresh,
            safe and quality food for every customer.

          </p>

        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* LEFT SIDE - CERTIFICATE */}
          <div className="relative group">

            {/* Glow */}
            <div className="absolute -inset-3 bg-gradient-to-r from-yellow-500/20 to-red-500/20 blur-2xl rounded-[40px]"></div>

            {/* Card */}
            <div className="relative bg-white rounded-[32px] p-4 shadow-2xl border border-white/20 overflow-hidden">

              {/* Verified Badge */}
              <div className="absolute top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 z-20">

                <BadgeCheck size={16} />

                Verified

              </div>

              {/* Certificate Image */}
              <img
                src="/certificate.png"
                alt="FSSAI Certificate"
                className="w-full rounded-[24px] object-cover transition duration-500 group-hover:scale-[1.02]"
              />

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div>

            {/* Title */}
            <h3 className="text-3xl sm:text-4xl font-bold leading-tight">

              Serving Fresh & Hygienic Food
              With Complete Trust

            </h3>

            {/* Description */}
            <p className="mt-6 text-gray-400 leading-relaxed text-lg">

              We maintain proper food quality, hygiene standards,
              and customer safety with certified kitchen practices
              approved under food safety regulations.

            </p>

            {/* Features */}
            <div className="mt-8 space-y-5">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">

                  <CheckCircle2
                    className="text-green-400"
                    size={22}
                  />

                </div>

                <div>

                  <h4 className="font-semibold text-lg">
                    FSSAI Certified
                  </h4>

                  <p className="text-gray-400 text-sm mt-1">
                    Licensed and certified food business.
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">

                  <CheckCircle2
                    className="text-yellow-400"
                    size={22}
                  />

                </div>

                <div>

                  <h4 className="font-semibold text-lg">
                    Hygienic Kitchen
                  </h4>

                  <p className="text-gray-400 text-sm mt-1">
                    Fresh ingredients & clean cooking process.
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">

                  <CheckCircle2
                    className="text-red-400"
                    size={22}
                  />

                </div>

                <div>

                  <h4 className="font-semibold text-lg">
                    Customer Safety
                  </h4>

                  <p className="text-gray-400 text-sm mt-1">
                    Quality food standards maintained daily.
                  </p>

                </div>

              </div>

            </div>

            {/* License Box */}
            <div className="mt-10 bg-gradient-to-r from-yellow-500 to-red-600 p-[1px] rounded-3xl">

              <div className="bg-black rounded-3xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                <div>

                  <p className="text-sm text-gray-400">
                    FSSAI License Number
                  </p>

                  <h4 className="text-2xl font-bold text-yellow-400 mt-1">
                    12345678932145
                  </h4>

                </div>

                {/* Verify Button */}
                <a
                  href="https://www.fssai.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-2xl font-semibold transition duration-300"
                >

                  Verify License

                  <ExternalLink size={18} />

                </a>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Certificate;