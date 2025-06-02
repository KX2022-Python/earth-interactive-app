import React from 'react';
import { EarthLayerType } from '../../models/EarthLayers';

interface ControlPanelProps {
  onToggleRotation: () => void;
  isRotating: boolean;
  onLayerToggle: (layer: EarthLayerType, enabled: boolean) => void;
  visibleLayers: EarthLayerType[];
  onEffectIntensityChange: (intensity: number) => void;
  effectIntensity: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onToggleRotation,
  isRotating,
  onLayerToggle,
  visibleLayers,
  onEffectIntensityChange,
  effectIntensity
}) => {
  // 层级名称映射
  const layerNames: Record<EarthLayerType, string> = {
    [EarthLayerType.CRUST]: '地壳',
    [EarthLayerType.OCEAN]: '海洋',
    [EarthLayerType.UPPER_MANTLE]: '上地幔',
    [EarthLayerType.LOWER_MANTLE]: '下地幔',
    [EarthLayerType.OUTER_CORE]: '外核',
    [EarthLayerType.INNER_CORE]: '内核',
    [EarthLayerType.MAGNETIC_FIELD]: '磁场',
  };

  // 处理全选/取消全选
  const handleSelectAll = (select: boolean) => {
    Object.values(EarthLayerType).forEach(layer => {
      onLayerToggle(layer, select);
    });
  };

  return (
    <div className="control-panel">
      <div className="panel-section">
        <h3>地球自转控制</h3>
        <button 
          onClick={onToggleRotation}
          className={`rotation-button ${isRotating ? 'active' : ''}`}
        >
          {isRotating ? '暂停自转' : '开始自转'}
        </button>
      </div>

      <div className="panel-section">
        <h3>层级选择</h3>
        <div className="layer-selection">
          <div className="select-all-buttons">
            <button onClick={() => handleSelectAll(true)}>全选</button>
            <button onClick={() => handleSelectAll(false)}>取消全选</button>
          </div>
          
          {Object.values(EarthLayerType).map(layer => (
            <div key={layer} className="layer-checkbox">
              <input
                type="checkbox"
                id={`layer-${layer}`}
                checked={visibleLayers.includes(layer)}
                onChange={(e) => onLayerToggle(layer, e.target.checked)}
              />
              <label htmlFor={`layer-${layer}`}>{layerNames[layer]}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3>层级联动强度</h3>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={effectIntensity}
            onChange={(e) => onEffectIntensityChange(parseFloat(e.target.value))}
            className="intensity-slider"
          />
          <span>{effectIntensity.toFixed(1)}</span>
        </div>
      </div>

      <div className="panel-section">
        <h3>操作指南</h3>
        <ul className="instructions">
          <li>鼠标拖拽：旋转视角</li>
          <li>鼠标滚轮：缩放视图</li>
          <li>右键拖拽：平移视图</li>
          <li>双击：重置视图</li>
        </ul>
      </div>
    </div>
  );
};

export default ControlPanel;
