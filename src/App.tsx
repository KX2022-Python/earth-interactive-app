import { useState } from 'react';
import Earth from './components/Earth/Earth';
import ControlPanel from './components/Controls/ControlPanel';
import { EarthLayerType } from './models/EarthLayers';
import './App.css';

function App() {
  // 地球自转状态
  const [isRotating, setIsRotating] = useState<boolean>(true);
  
  // 可见层级状态
  const [visibleLayers, setVisibleLayers] = useState<EarthLayerType[]>(
    Object.values(EarthLayerType)
  );
  
  // 层级联动强度
  const [effectIntensity, setEffectIntensity] = useState<number>(1.0);
  
  // 切换地球自转
  const handleToggleRotation = () => {
    setIsRotating(prev => !prev);
  };
  
  // 切换层级可见性
  const handleLayerToggle = (layer: EarthLayerType, enabled: boolean) => {
    setVisibleLayers(prev => {
      if (enabled && !prev.includes(layer)) {
        return [...prev, layer];
      } else if (!enabled) {
        return prev.filter(l => l !== layer);
      }
      return prev;
    });
  };
  
  // 更新层级联动强度
  const handleEffectIntensityChange = (intensity: number) => {
    setEffectIntensity(intensity);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>地球结构交互模型</h1>
      </header>
      
      <main className="app-content">
        <div className="earth-container">
          <Earth 
            isRotating={isRotating}
            visibleLayers={visibleLayers}
            effectIntensity={effectIntensity}
          />
        </div>
        
        <div className="control-container">
          <ControlPanel 
            onToggleRotation={handleToggleRotation}
            isRotating={isRotating}
            onLayerToggle={handleLayerToggle}
            visibleLayers={visibleLayers}
            onEffectIntensityChange={handleEffectIntensityChange}
            effectIntensity={effectIntensity}
          />
        </div>
      </main>
      
      <footer className="app-footer">
        <p>地球结构交互式3D模型 - 从地壳到地心的动态展示</p>
      </footer>
    </div>
  );
}

export default App;
