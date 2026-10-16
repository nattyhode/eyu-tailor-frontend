export default function Services() {
  const services = [
    {
      title: "Custom Suits",
      description: "Crafted with precision and care, our custom suits are tailored to elevate your style.",
      image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800"
    },
    {
      title: "Cultural Dresses",
      description: "Celebrate your heritage with our exquisite cultural dresses, designed to impress.",
      image: "https://images.unsplash.com/photo-1610414779697-38e788eb89dd?w=800"
    },
    {
      title: "Casual Wear",
      description: "Everyday comfort meets individual style with our tailored casual garments.",
      image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800"
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Tailoring Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our bespoke services and custom solutions tailored to your unique preference.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col">
            <img 
              src={service.image} 
              alt={service.title} 
              className="w-full h-96 object-cover mb-6 bg-gray-200 rounded"
            />
            <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}