import Hero from '../components/Hero';
import { motion } from 'framer-motion';

export default function Home() {
  const features = [
    {
      icon: '🧠',
      title: 'AI-Powered Organization',
      description: 'Our advanced AI analyzes your files and suggests optimal organization structures.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Process thousands of files in seconds with our optimized algorithms.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data never leaves your Google Drive. We only request minimal permissions.'
    }
  ];

  return (
    <div  className="container mx-auto px-4 py-12 ">
      <Hero />
      
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Solution?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-xl hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-black font-semibold">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="glass mt-20 p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <div className="space-y-8">
          {[
            ' Connect your Google Drive',
            ' Select the files, and give name suggestion.',
            ' Let our AI analyze your files',
            ' Review suggested organization',
            ' Execute changes with one click'
          ].map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="bg-gray-600 rounded-full text-white w-8 h-8 flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-lg">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}