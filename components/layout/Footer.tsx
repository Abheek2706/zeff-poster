import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300">
      {/* Newsletter */}
      <div className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white text-lg font-bold">Stay in the loop</h3>
            <p className="text-sm text-zinc-400">Get updates on new drops, offers & more.</p>
          </div>
          <form className="flex w-full md:w-auto" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-zinc-800 border border-zinc-700 rounded-l-lg px-4 py-2.5 text-sm w-full md:w-72 outline-none focus:border-zinc-500 transition"
            />
            <button className="bg-white text-zinc-900 font-semibold px-6 py-2.5 rounded-r-lg text-sm hover:bg-zinc-200 transition shrink-0">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Links grid */}
      <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">About zeff.store</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            <li><span className="hover:text-white transition cursor-pointer">Careers</span></li>
            <li><span className="hover:text-white transition cursor-pointer">Blog</span></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition">All Items</Link></li>
            <li><Link href="/wishlist" className="hover:text-white transition">Wishlist</Link></li>
            <li><Link href="/profile" className="hover:text-white transition">My Account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="hover:text-white transition cursor-pointer">FAQ</span></li>
            <li><span className="hover:text-white transition cursor-pointer">Shipping Policy</span></li>
            <li><span className="hover:text-white transition cursor-pointer">Return Policy</span></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li>📧 support@zeff.store</li>
            <li>📱 +91 73197 61618</li>
            <li className="flex gap-3 pt-2">
              <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 cursor-pointer transition">𝕏</span>
              <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 cursor-pointer transition">📷</span>
              <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 cursor-pointer transition">▶</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-zinc-800 text-center py-5 text-xs text-zinc-500">
        © {new Date().getFullYear()} zeff.store. All rights reserved.
      </div>
    </footer>
  )
}
