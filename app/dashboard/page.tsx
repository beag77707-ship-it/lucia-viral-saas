"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import GenerateModal from "@/components/GenerateModal";
import { PlayCircle, CheckCircle, Clock, Video } from "lucide-react";

const chartData = [
  { day: '0', views: 10 },
  { day: '3', views: 40 },
  { day: '6', views: 25 },
  { day: '9', views: 55 },
  { day: '12', views: 45 },
  { day: '15', views: 75 },
  { day: '18', views: 55 },
  { day: '21', views: 76 },
  { day: '24', views: 65 },
  { day: '27', views: 95 },
  { day: '30', views: 100 },
];

const queueItems = [
  { id: 1, title: "10 AI Tools for Creators", status: "Draft", tag: "Blue", icon: PlayCircle },
  { id: 2, title: "The Future of Design", status: "Completed", tag: "Video", icon: Video },
  { id: 3, title: "Viral Tech Trends", status: "Processing", tag: "Loading", icon: Clock },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-6 pb-20">
        
        {/* TOP ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create Content Action */}
          <div className="lg:col-span-4 bg-dark-800 rounded-2xl p-6 flex flex-col justify-center border border-white/5">
            <h2 className="text-xl font-bold mb-4">Create new content with AI</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg transition-colors self-start"
            >
              Generate Now
            </button>
          </div>

          {/* Stats */}
          <div className="lg:col-span-8 bg-dark-800 rounded-2xl border border-white/5 flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm font-medium mb-1">Total Content</span>
              <span className="text-3xl font-bold text-white">1.2K</span>
            </div>
            <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm font-medium mb-1">Viral Score</span>
              <span className="text-3xl font-bold text-white">88%</span>
            </div>
            <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm font-medium mb-1">Engagement</span>
              <span className="text-3xl font-bold text-white">14.5K</span>
            </div>
            <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm font-medium mb-1">Total Views</span>
              <span className="text-3xl font-bold text-white">2.1M</span>
            </div>
          </div>
        </div>

        {/* MIDDLE ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart */}
          <div className="lg:col-span-8 bg-dark-800 rounded-2xl border border-white/5 p-6 h-[380px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Content Performance (Last 30 Days)</h2>
              <select className="bg-dark-900 border border-white/10 text-sm text-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:border-primary">
                <option>Analytics</option>
                <option>Views</option>
              </select>
            </div>
            <div className="flex-1 w-full h-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Queue */}
          <div className="lg:col-span-4 bg-dark-800 rounded-2xl border border-white/5 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Script Generation Queue</h2>
              <button className="text-gray-400 hover:text-white">•••</button>
            </div>
            
            <div className="space-y-4 flex-1">
              {queueItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    item.id === 1 ? 'bg-[#1e3a8a]/20 border-blue-500/30' : 
                    item.id === 2 ? 'bg-[#064e3b]/20 border-green-500/30' : 
                    'bg-[#78350f]/20 border-orange-500/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-bold ${
                      item.id === 1 ? 'text-blue-500' : 
                      item.id === 2 ? 'text-green-500' : 
                      'text-orange-500'
                    }`}>{item.id}</span>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                      <div className="flex gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          item.id === 1 ? 'border-blue-500/50 text-blue-400' : 
                          item.id === 2 ? 'border-green-500/50 text-green-400' : 
                          'border-orange-500/50 text-orange-400'
                        }`}>{item.status}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          item.id === 1 ? 'border-blue-500/50 text-blue-400' : 
                          item.id === 2 ? 'border-green-500/50 text-green-400' : 
                          'border-orange-500/50 text-orange-400'
                        }`}>{item.tag}</span>
                      </div>
                    </div>
                  </div>
                  <item.icon className={`w-5 h-5 ${
                    item.id === 1 ? 'text-blue-500' : 
                    item.id === 2 ? 'text-green-500' : 
                    'text-orange-500'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-dark-800 rounded-2xl border border-white/5 p-6 min-h-[300px]">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Video Preview & Refinement</h2>
              <button className="text-gray-400 hover:text-white">•••</button>
            </div>
            <div className="w-full h-48 bg-dark-900 rounded-xl flex items-center justify-center border border-white/5">
              <span className="text-gray-500 text-sm">Selecciona un proyecto para previsualizar</span>
            </div>
          </div>

          <div className="bg-dark-800 rounded-2xl border border-white/5 p-6 min-h-[300px]">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Recent Generated Scripts</h2>
              <button className="text-gray-400 hover:text-white">•••</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs uppercase bg-dark-900/50 text-gray-500 border-b border-white/5">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Title</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 font-medium text-white">Cómo automatizar Instagram</td>
                    <td className="px-4 py-3">12 Oct 2026</td>
                    <td className="px-4 py-3"><span className="text-green-400 bg-green-400/10 px-2 py-1 rounded">Listo</span></td>
                    <td className="px-4 py-3 text-primary cursor-pointer hover:underline">Ver Script</td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="px-4 py-3 font-medium text-white">5 Herramientas de IA</td>
                    <td className="px-4 py-3">10 Oct 2026</td>
                    <td className="px-4 py-3"><span className="text-orange-400 bg-orange-400/10 px-2 py-1 rounded">Borrador</span></td>
                    <td className="px-4 py-3 text-primary cursor-pointer hover:underline">Ver Script</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <GenerateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        session={session} 
      />
    </>
  );
}
