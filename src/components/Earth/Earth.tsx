import React, { useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
// import * as THREE from 'three';
import EarthLayer from './EarthLayer';
import { 
  EarthLayerType, 
  createDefaultEarthLayers, 
  applyLayerEffects 
} from '../../models/EarthLayers';

interface EarthSceneProps {
  isRotating: boolean;
  visibleLayers: EarthLayerType[];
  effectIntensity: number;
}

// 内部场景组件
const EarthScene: React.FC<EarthSceneProps> = ({ 
  isRotating, 
  visibleLayers,
  effectIntensity 
}) => {
  const [layers, setLayers] = useState(createDefaultEarthLayers());
  const { camera } = useThree();
  
  // 设置初始相机位置
  useEffect(() => {
    camera.position.set(0, 0, 15);
  }, [camera]);
  
  // 应用层级间的动态影响
  useEffect(() => {
    const intervalId = setInterval(() => {
      setLayers(prevLayers => applyLayerEffects(prevLayers, effectIntensity));
    }, 100); // 每100ms更新一次层级状态
    
    return () => clearInterval(intervalId);
  }, [effectIntensity]);
  
  // 更新层级可见性
  useEffect(() => {
    setLayers(prevLayers => {
      const updatedLayers = { ...prevLayers };
      
      // 更新所有层级的可见性
      Object.keys(updatedLayers).forEach(key => {
        const layerType = key as EarthLayerType;
        updatedLayers[layerType] = {
          ...updatedLayers[layerType],
          visible: visibleLayers.includes(layerType)
        };
      });
      
      return updatedLayers;
    });
  }, [visibleLayers]);
  
  return (
    <>
      {/* 添加环境光和方向光 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* 渲染各个地球层级 */}
      {Object.values(layers).map(layer => (
        <EarthLayer 
          key={layer.type} 
          layer={layer} 
          isRotating={isRotating} 
          wireframe={layer.type === EarthLayerType.MAGNETIC_FIELD}
        />
      ))}
      
      {/* 添加星空背景 */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      
      {/* 添加轨道控制器 */}
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        zoomSpeed={1.0}
        panSpeed={0.8}
        rotateSpeed={0.8}
      />
    </>
  );
};

// 主地球组件
interface EarthProps {
  isRotating?: boolean;
  visibleLayers?: EarthLayerType[];
  effectIntensity?: number;
}

const Earth: React.FC<EarthProps> = ({ 
  isRotating = true, 
  visibleLayers = Object.values(EarthLayerType),
  effectIntensity = 1.0
}) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ fov: 45 }}
      >
        <EarthScene 
          isRotating={isRotating} 
          visibleLayers={visibleLayers}
          effectIntensity={effectIntensity}
        />
      </Canvas>
    </div>
  );
};

export default Earth;
