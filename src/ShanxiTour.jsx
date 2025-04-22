import React, { useState, useEffect, useRef } from 'react';
import { Map, Marker } from '@amap/amap-jsapi-loader';
import { Play, Pause, Volume2, MapPin, Calendar, Mountain, Home, Museum } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ShanxiTour = () => {
  const [activeDay, setActiveDay] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const mapContainerRef = useRef(null);
  const mapInstance = useRef(null);

  // 景点数据
  const tourData = [
    {
      day: 1,
      title: "山西博物院",
      description: "上午：抵达太原后，前往山西博物院，这里馆藏丰富，能让游客深入了解山西的历史文化。游览时间大约3-4小时。\n下午：继续在博物院参观，之后在附近就餐，品尝山西特色美食，如刀削面、平遥牛肉等。",
      location: [112.5489, 37.8706],
      icon: <Museum className="text-blue-500" />,
      image: "https://s.coze.cn/t/DvEy1Vs0eck/"
    },
    {
      day: 2,
      title: "云顶山",
      description: "上午：从太原出发前往云顶山，距离大约一百一十多公里，驾车前往。到达云顶山后，开始登山欣赏自然风光，感受山中的动植物生态。\n下午：在山顶的草甸上漫步，欣赏'天池'等景观，拍照留念。\n晚上：可以选择在云顶山附近住宿，体验乡村生活。",
      location: [111.7975, 38.3667],
      icon: <Mountain className="text-green-500" />,
      image: ""
    },
    {
      day: 3,
      title: "云顶山周边/太原市区",
      description: "上午：如果体力允许，可以继续在云顶山周边游玩，探索一些未开发的小景点。也可以选择返程回太原市区休整。\n下午：回到太原市区后，可以在市区自由活动，逛逛商业街，购买一些山西特产。",
      location: [112.5489, 37.8706],
      icon: <Home className="text-yellow-500" />,
      image: "https://s.coze.cn/t/yVQ5QUSydyA/"
    },
    {
      day: 4,
      title: "太原古县城",
      description: "上午：前往太原古县城，游览古城内的古建筑、街道等，感受历史的韵味。游览时间大约3-4小时。\n下午：结束古县城的游览后，准备返程。",
      location: [112.521, 37.857],
      icon: <MapPin className="text-purple-500" />,
      image: ""
    }
  ];

  // 初始化地图
  useEffect(() => {
    AMapLoader.load({
      key: 'd17c17f8f712c81a7e4241aff4faa7b0',
      plugins: ['AMap.Scale', 'AMap.ToolBar']
    }).then((AMap) => {
      mapInstance.current = new AMap.Map(mapContainerRef.current, {
        zoom: 8,
        center: [112.5489, 37.8706],
        viewMode: '2D'
      });

      // 添加景点标记
      tourData.forEach(spot => {
        new AMap.Marker({
          position: spot.location,
          map: mapInstance.current,
          title: spot.title
        });
      });

      // 添加缩放控件
      mapInstance.current.addControl(new AMap.ControlBar({
        showZoomBar: true,
        showControlButton: true,
        position: {
          right: '10px',
          top: '10px'
        }
      }));
    }).catch(e => {
      console.error('地图加载失败:', e);
    });

    return () => {
      mapInstance.current?.destroy();
    };
  }, []);

  // 播放音频
  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  // 切换景点
  const changeDay = (day) => {
    setActiveDay(day);
    // 移动地图到对应景点
    const spot = tourData.find(item => item.day === day);
    if (spot && mapInstance.current) {
      mapInstance.current.setCenter(spot.location);
      mapInstance.current.setZoom(13);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 头部 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-blue-800">山西五一旅游路线规划</h1>
          <p className="text-gray-600 mt-2">4天3晚深度体验山西自然与人文之美</p>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        {/* 路线导航 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex overflow-x-auto pb-2">
            {tourData.map((day) => (
              <button
                key={day.day}
                onClick={() => changeDay(day.day)}
                className={`flex-shrink-0 px-6 py-3 mr-2 rounded-lg transition-all ${activeDay === day.day ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <div className="flex items-center">
                  <Calendar className="mr-2" size={18} />
                  第{day.day}天
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 景点详情 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 景点信息 */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {tourData.filter(day => day.day === activeDay).map((spot) => (
                <motion.div
                  key={spot.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={spot.image} 
                      alt={spot.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h2 className="text-2xl font-bold text-white">{spot.title}</h2>
                      <div className="flex items-center text-white mt-1">
                        <MapPin size={16} className="mr-1" />
                        <span className="text-sm">山西省太原市</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {spot.icon}
                      <span className="ml-2 font-medium">{spot.day === 1 ? "文化探索" : spot.day === 2 ? "自然风光" : spot.day === 3 ? "休闲购物" : "历史漫步"}</span>
                    </div>
                    <div className="whitespace-pre-line text-gray-700">
                      {spot.description}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <h3 className="font-semibold text-gray-800 mb-2">注意事项</h3>
                      <ul className="text-gray-600 space-y-1">
                        <li>• 五一期间游客较多，建议提前预订门票和住宿</li>
                        <li>• 前往云顶山需准备防晒、保暖装备</li>
                        <li>• 品尝当地美食时注意饮食卫生</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 地图和音频控制 */}
          <div className="space-y-6">
            {/* 地图 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center">
                <MapPin className="text-red-500 mr-2" />
                <span className="font-medium">景点位置</span>
              </div>
              <div ref={mapContainerRef} className="h-64 w-full"></div>
            </div>

            {/* 音频控制 */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center">
                  <Volume2 className="mr-2 text-blue-500" />
                  景点讲解
                </h3>
                <button 
                  onClick={toggleAudio}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
              </div>
              <div className="flex items-center">
                <Volume2 size={16} className="text-gray-500 mr-2" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* 行程概览 */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-medium mb-4 flex items-center">
                <Calendar className="mr-2 text-purple-500" />
                行程概览
              </h3>
              <div className="space-y-3">
                {tourData.map((day) => (
                  <div 
                    key={day.day}
                    onClick={() => changeDay(day.day)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${activeDay === day.day ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${activeDay === day.day ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                        {day.day}
                      </div>
                      <span className={`font-medium ${activeDay === day.day ? 'text-purple-700' : 'text-gray-700'}`}>
                        {day.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <div>页面内容均由 AI 生成，仅供参考</div>
          <div className="mt-1">
            created by <a href="https://space.coze.cn" className="text-blue-600 hover:underline">coze space</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShanxiTour;