import { motion } from 'framer-motion'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub, FaYoutube } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const socialLinks = [
  { icon: FaFacebookF, href: '#', color: '#1877F2' },
  { icon: FaTwitter, href: '#', color: '#1DA1F2' },
  { icon: FaInstagram, href: '#', color: '#E4405F' },
  { icon: FaLinkedinIn, href: '#', color: '#0A66C2' },
  { icon: FaGithub, href: '#', color: '#333' },
  { icon: FaYoutube, href: '#', color: '#FF0000' }
]

const footerLinks = [
  {
    title: 'Hakkımızda',
    links: [
      { name: 'Şirketimiz', href: '/about' },
      { name: 'Kariyer', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Basın', href: '/press' }
    ]
  },
  {
    title: 'Destek',
    links: [
      { name: 'Yardım Merkezi', href: '/help' },
      { name: 'Güvenlik', href: '/security' },
      { name: 'Gizlilik Politikası', href: '/privacy' },
      { name: 'İletişim', href: '/contact' }
    ]
  },
  {
    title: 'Hizmetler',
    links: [
      { name: 'Otel Rezervasyonu', href: '/hotels' },
      { name: 'Özel Teklifler', href: '/offers' },
      { name: 'Grup Rezervasyonları', href: '/groups' },
      { name: 'İş Ortaklığı', href: '/partnership' }
    ]
  }
]

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.footer
      className="bg-gray-900 text-white pt-16 pb-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Link to="/" className="flex items-center">
              <motion.img
                src="/hotel-logo.png"
                alt="Logo"
                className="h-12 w-auto"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <span className="ml-3 text-2xl font-bold">HotelBooking</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Lüks ve konforlu konaklama deneyimi için doğru adres. Size özel fırsatlarla unutulmaz bir tatil için hemen rezervasyon yapın.
            </p>
            <motion.div 
              className="flex space-x-4"
              variants={itemVariants}
            >
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transition-colors duration-300"
                    whileHover={{ 
                      scale: 1.2,
                      backgroundColor: social.color,
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-xl font-bold mb-4">Bültenimize Abone Olun</h3>
            <p className="text-gray-400 mb-6">
              En güncel fırsatlardan ve kampanyalardan haberdar olun
            </p>
            <motion.form 
              className="flex space-x-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Abone Ol
              </motion.button>
            </motion.form>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400"
        >
          <p>© {new Date().getFullYear()} HotelBooking. Tüm hakları saklıdır.</p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer 