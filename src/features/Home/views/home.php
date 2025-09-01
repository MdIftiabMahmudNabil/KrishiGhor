<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KrishiGhor – Empowering Transparent Agriculture</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.1/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-[#0c1d14] text-white font-sans leading-relaxed">

  <!-- Navbar -->
  <nav class="flex justify-between items-center px-6 py-4 bg-[#0c1d14]">
    <div class="text-lg font-bold">KrishiGhor</div>
    <div class="space-x-4 text-sm">
      <a href="#" class="hover:underline">Farmer Login</a>
      <a href="#" class="hover:underline">Buyer Login</a>
      <a href="#" class="hover:underline">Transporter Login</a>
      <a href="#" class="hover:underline">Admin</a>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="text-center py-24 px-6">
    <h1 class="text-5xl md:text-6xl font-bold mb-6">Together we empower farmers for the future</h1>
    <p class="text-xl text-green-300 mb-6">Track Prices. Move Crops. Get Paid.</p>
    <a href="#" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition">Join KrishiGhor</a>
  </section>

  <!-- Section Titles -->
  <section class="bg-white text-[#0c1d14] py-16 text-center space-y-6">
    <h2 class="text-3xl font-extrabold">The Project</h2>
    <h2 class="text-3xl font-extrabold">Price Transparency</h2>
    <h2 class="text-3xl font-extrabold">Smart Distribution</h2>
  </section>

  <!-- How We Work -->
  <section class="bg-[#0c1d14] text-white py-20">
    <div class="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
      <div class="md:w-1/2">
        <h3 class="text-2xl font-bold mb-4">How We Work</h3>
        <p class="text-lg text-gray-300">
          KrishiGhor enables farmers to list crops, monitor real-time pricing, and coordinate delivery with verified transporters—streamlining the entire agricultural supply chain digitally.
        </p>
      </div>
      <div class="md:w-1/2">
        <img src="https://images.unsplash.com/photo-1596568359552-92f39013c109?auto=format&fit=crop&w=700&q=80" class="rounded-lg shadow-lg" alt="KrishiGhor dashboard">
      </div>
    </div>
  </section>

  <!-- Testimonial -->
  <section class="bg-white text-[#0c1d14] py-16 text-center">
    <p class="text-xl italic max-w-2xl mx-auto">"With KrishiGhor, we’re finally earning what our crops deserve." — Abdul Karim, Farmer, Rangpur</p>
  </section>

  <!-- Partners -->
  <section class="bg-white py-12">
    <div class="text-center mb-6">
      <h4 class="text-xl font-bold text-[#0c1d14]">Our Partners</h4>
    </div>
    <div class="flex justify-center gap-10 flex-wrap">
      <img src="https://via.placeholder.com/100x40?text=Partner+1" alt="Partner 1" class="grayscale">
      <img src="https://via.placeholder.com/100x40?text=Partner+2" alt="Partner 2" class="grayscale">
    </div>
  </section>

  <!-- News Section -->
  <section class="bg-gray-50 text-[#0c1d14] py-16 px-6">
    <div class="max-w-4xl mx-auto">
      <h3 class="text-xl font-bold mb-6">Latest Updates</h3>
      <ul class="space-y-4 text-sm">
        <li><strong>July 18:</strong> Tomato prices surge due to flood-affected regions.</li>
        <li><strong>July 12:</strong> Storage API launched for Sylhet & Barisal regions.</li>
        <li><strong>July 1:</strong> KrishiGhor reaches 1000+ active users milestone!</li>
      </ul>
    </div>
  </section>

  <!-- Newsletter Signup -->
  <section class="bg-white py-16 text-[#0c1d14]">
    <div class="text-center mb-6">
      <h3 class="text-2xl font-bold">Sign up for our newsletter</h3>
    </div>
    <form action="newsletter.php" method="POST" class="max-w-lg mx-auto space-y-4 px-4">
      <input type="text" name="name" placeholder="Your name" class="w-full border px-4 py-2 rounded">
      <input type="email" name="email" placeholder="Your email" class="w-full border px-4 py-2 rounded">
      <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded w-full">Subscribe</button>
    </form>
  </section>

  <!-- Footer -->
  <footer class="bg-[#0c1d14] text-white py-12 px-6">
    <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-sm">
      <div>
        <h4 class="font-bold mb-2">KrishiGhor</h4>
        <p>Empowering agriculture with data, logistics, and price transparency.</p>
      </div>
      <div>
        <h4 class="font-bold mb-2">Quick Links</h4>
        <ul>
          <li><a href="#" class="hover:underline">About</a></li>
          <li><a href="#" class="hover:underline">Contact</a></li>
          <li><a href="#" class="hover:underline">Support</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold mb-2">Contact</h4>
        <p>Email: hello@krishighor.com</p>
        <p>Phone: +880 1234-567890</p>
      </div>
    </div>
  </footer>

</body>
</html>
