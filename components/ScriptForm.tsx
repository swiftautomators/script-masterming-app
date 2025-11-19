
import React, { useRef } from 'react';
import { VideoLength, ProductState } from '../types';
import { Camera, Upload, X, Clock } from 'lucide-react';

interface ScriptFormProps {
  product: ProductState;
  setProduct: (p: ProductState) => void;
  videoLength: VideoLength;
  setVideoLength: (l: VideoLength) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const LENGTH_DESCRIPTIONS: Record<VideoLength, string> = {
  [VideoLength.Short]: "Highest conversion rate",
  [VideoLength.Medium]: "Balanced storytelling",
  [VideoLength.Long]: "Deep engagement",
  [VideoLength.ExtraLong]: "Tutorial-style",
  [VideoLength.DeepDive]: "In-depth education"
};

export const ScriptForm: React.FC<ScriptFormProps> = ({
  product,
  setProduct,
  videoLength,
  setVideoLength,
  onSubmit,
  isSubmitting
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setProduct({ ...product, image: base64Data });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl mx-auto border border-gray-100">
      
      {/* Image Upload */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-800 mb-3">Product Visuals</label>
        <div className="flex justify-center">
          {product.image ? (
            <div className="relative w-full h-56 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <img 
                src={`data:image/png;base64,${product.image}`} 
                alt="Product" 
                className="w-full h-full object-contain" 
              />
              <button 
                onClick={() => setProduct({...product, image: null})}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-tiktok-pink hover:text-tiktok-pink hover:bg-pink-50/50 transition-all group"
            >
              <Camera className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Upload photo to Analyze</span>
            </button>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      {/* Product Name */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-800 mb-2">Product Name</label>
        <input
          type="text"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          placeholder="e.g., Galaxy Star Projector"
          className="w-full px-5 py-3 bg-white text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-tiktok-teal focus:border-tiktok-teal outline-none transition-all placeholder-gray-400 shadow-sm"
        />
      </div>

      {/* Description */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-800 mb-2">Product Details</label>
        <textarea
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          placeholder="Paste TikTok Shop product URL or describe your product (e.g., 'wireless bluetooth headphones under $50 for working out')"
          rows={4}
          className="w-full px-5 py-3 bg-white text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-tiktok-teal focus:border-tiktok-teal outline-none transition-all resize-none placeholder-gray-400 shadow-sm"
        />
        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
          <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-bold text-[10px]">PRO TIP</span> 
          The more specific you are, the better your scripts will be!
        </p>
      </div>

      {/* Video Length */}
      <div className="mb-10">
        <label className="block text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          Target Video Length
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {Object.values(VideoLength).map((len) => (
            <button
              key={len}
              onClick={() => setVideoLength(len)}
              className={`relative flex flex-col items-center justify-center p-2 h-20 rounded-xl border transition-all duration-200 ${
                videoLength === len
                  ? 'bg-tiktok-black text-white border-tiktok-black shadow-lg scale-105 z-10'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <span className="text-sm font-bold mb-1">{len.split(' ')[0]}</span>
              <span className={`text-[10px] leading-tight text-center ${videoLength === len ? 'text-gray-300' : 'text-gray-400'}`}>
                {LENGTH_DESCRIPTIONS[len]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmitting || !product.name}
        className={`w-full py-5 rounded-xl text-white font-bold text-xl shadow-xl transform transition-all relative overflow-hidden group ${
          isSubmitting || !product.name
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] hover:shadow-2xl hover:scale-[1.02]'
        }`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
           {isSubmitting ? 'Generating...' : 'Research & Script'}
        </span>
        {!isSubmitting && product.name && (
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        )}
      </button>
    </div>
  );
};
