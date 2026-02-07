import React from 'react';
import { useCategory } from '../hooks/useContexts';

const PresetOptions = ({ onPresetClick }) => {
    const { currentCategory } = useCategory();
    const presets = currentCategory?.presets || [];

    if (presets.length === 0) {
        return null;
    }

    return (
        <div className="preset-options-container">
            <div className="preset-options-header">
                <div className="preset-options-title">
                    <i className="fas fa-lightbulb preset-icon"></i>
                    Suggested Questions
                </div>
            </div>
            <div className="preset-options-grid">
                {presets.map((preset, index) => (
                    <div 
                        key={index} 
                        className="preset-option"
                        onClick={() => onPresetClick(preset)}
                    >
                        <span className="preset-option-text">
                            <i className="fas fa-chevron-right preset-option-icon"></i>
                            {preset}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PresetOptions;
