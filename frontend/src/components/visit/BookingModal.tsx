import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, CheckCircle } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    guests: 1,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setFormData({ name: "", email: "", date: "", guests: 1 });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                aria-label="Close booking modal"
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                {!isSubmitted ? (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="font-serif text-3xl text-organo-green mb-2">
                        Book Your Visit
                      </h2>
                      <p className="text-organo-gray">Experince the harvest firsthand.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-bold text-organo-green uppercase tracking-wide mb-1"
                        >
                          Full Name
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-organo-green focus:ring-1 focus:ring-organo-green transition-all"
                          placeholder="Jane Doe"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-bold text-organo-green uppercase tracking-wide mb-1"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-organo-green focus:ring-1 focus:ring-organo-green transition-all"
                          placeholder="jane@example.com"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="bookingDate"
                            className="block text-sm font-bold text-organo-green uppercase tracking-wide mb-1"
                          >
                            Date
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3.5 text-gray-400" size={16} />
                            <input
                              id="bookingDate"
                              type="date"
                              required
                              value={formData.date}
                              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-organo-green focus:ring-1 focus:ring-organo-green transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="guests"
                            className="block text-sm font-bold text-organo-green uppercase tracking-wide mb-1"
                          >
                            Guests
                          </label>
                          <div className="relative">
                            <Users className="absolute left-3 top-3.5 text-gray-400" size={16} />
                            <input
                              id="guests"
                              type="number"
                              min="1"
                              max="10"
                              required
                              value={formData.guests}
                              onChange={(e) =>
                                setFormData({ ...formData, guests: parseInt(e.target.value) })
                              }
                              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-organo-green focus:ring-1 focus:ring-organo-green transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-organo-green text-white font-bold uppercase tracking-wider py-4 rounded-lg hover:bg-organo-green/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-2"
                      >
                        Confirm Booking
                      </button>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} />
                    </div>
                    <h3 className="font-serif text-3xl text-organo-green mb-4">You're Booked!</h3>
                    <p className="text-organo-gray mb-8">
                      We've sent a confirmation email to <strong>{formData.email}</strong>.<br />
                      We can't wait to see you at the farm!
                    </p>
                    <button
                      onClick={handleClose}
                      className="bg-organo-cream text-organo-green font-bold uppercase tracking-wider px-8 py-3 rounded-full hover:bg-organo-pistachio/20 transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
