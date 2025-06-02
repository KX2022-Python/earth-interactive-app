import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { EarthLayer as EarthLayerType } from '../../models/EarthLayers';
import { calculateLayerRadius } from '../../models/EarthLayers';

interface EarthLayerProps {
  layer: EarthLayerType;
  isRotating: boolean;
  wireframe?: boolean;
  segments?: number;
}

const EarthLayer: React.FC<EarthLayerProps> = ({ 
  layer, 
  isRotating, 
  wireframe = false,
  segments = 64
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const radius = calculateLayerRadius(layer.scale);
  
  // 使用useFrame钩子来实现每一帧的旋转
  useFrame((_, delta) => {
    if (meshRef.current && isRotating) {
      // 根据层级的旋转速度应用旋转
      meshRef.current.rotation.y += layer.rotationSpeed * delta;
      
      // 为某些层级添加额外的动态效果
      switch (layer.type) {
        case 'magneticField':
          // 磁场波动效果
          const time = Date.now() * 0.0005;
          meshRef.current.scale.x = 1 + Math.sin(time) * 0.02;
          meshRef.current.scale.z = 1 + Math.cos(time) * 0.02;
          break;
        case 'ocean':
          // 海洋波动效果
          if (meshRef.current.material instanceof THREE.Material) {
            const material = meshRef.current.material as THREE.MeshStandardMaterial;
            material.roughness = 0.7 + Math.sin(Date.now() * 0.001) * 0.1;
          }
          break;
        default:
          break;
      }
    }
  });

  return (
    <Sphere
      ref={meshRef}
      args={[radius, segments, segments]}
      visible={layer.visible}
    >
      <meshStandardMaterial
        color={layer.color}
        transparent={true}
        opacity={layer.opacity}
        wireframe={wireframe}
        roughness={0.7}
        metalness={layer.type === 'innerCore' || layer.type === 'outerCore' ? 0.8 : 0.2}
      />
    </Sphere>
  );
};

export default EarthLayer;
