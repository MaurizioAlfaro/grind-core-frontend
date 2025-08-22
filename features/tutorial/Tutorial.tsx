
import React, { useState, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { StyledButton } from '../../components/common/StyledButton';

export interface TutorialConfig {
    step: number;
    targetSelector: string | null;
    text: string;
    title: string;
    hasNextButton: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'horizontal-auto';
}

interface TutorialProps {
    config: TutorialConfig;
    onNext: () => void;
}

const getTargetRect = (selector: string | null): DOMRect | null => {
    if (!selector) return null;
    const element = document.querySelector(selector);
    return element ? element.getBoundingClientRect() : null;
};

const getTooltipPositionStyles = (targetRect: DOMRect | null, position: TutorialConfig['position'] = 'bottom') => {
    const posStyles: React.CSSProperties = {};
    const offset = 16; // 1rem

    let effectivePosition = position;

    if (position === 'horizontal-auto' && targetRect) {
        const targetCenter = targetRect.left + targetRect.width / 2;
        if (targetCenter < window.innerWidth / 2) {
            effectivePosition = 'right';
        } else {
            effectivePosition = 'left';
        }
    }


    if (!targetRect || position === 'center') {
        posStyles.top = '50%';
        posStyles.left = '50%';
        posStyles.transform = 'translate(-50%, -50%)';
        return posStyles;
    }
    
    switch (effectivePosition) {
        case 'top':
            posStyles.bottom = `${window.innerHeight - targetRect.top + offset}px`;
            posStyles.left = `${targetRect.left + targetRect.width / 2}px`;
            posStyles.transform = 'translateX(-50%)';
            break;
        case 'bottom':
            posStyles.top = `${targetRect.bottom + offset}px`;
            posStyles.left = `${targetRect.left + targetRect.width / 2}px`;
            posStyles.transform = 'translateX(-50%)';
            break;
        case 'left':
            posStyles.top = `${targetRect.top + targetRect.height / 2}px`;
            posStyles.right = `${window.innerWidth - targetRect.left + offset}px`;
            posStyles.transform = 'translateY(-50%)';
            break;
        case 'right':
            posStyles.top = `${targetRect.top + targetRect.height / 2}px`;
            posStyles.left = `${targetRect.right + offset}px`;
            posStyles.transform = 'translateY(-50%)';
            break;
    }
    return posStyles;
};


export const Tutorial: React.FC<TutorialProps> = ({ config, onNext }) => {
    const [targetRect, setTargetRect] = useState<DOMRect | null>(getTargetRect(config.targetSelector));
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useLayoutEffect(() => {
        const updateRect = () => {
            setTargetRect(getTargetRect(config.targetSelector));
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };

        updateRect();
        
        window.addEventListener('resize', updateRect);
        
        const intervalId = setInterval(updateRect, 100);

        return () => {
            window.removeEventListener('resize', updateRect);
            clearInterval(intervalId);
        };
    }, [config.targetSelector]);

    const tooltipPositionStyles = getTooltipPositionStyles(targetRect, config.position);
    
    const padding = 8;
    const paddedRect = targetRect ? {
        top: targetRect.top - padding,
        left: targetRect.left - padding,
        width: targetRect.width + padding * 2,
        height: targetRect.height + padding * 2,
    } : null;

    const pathData = paddedRect
        ? `M0,0 H${dimensions.width} V${dimensions.height} H0 Z M${paddedRect.left},${paddedRect.top} h${paddedRect.width} v${paddedRect.height} h-${paddedRect.width} Z`
        : `M0,0 H${dimensions.width} V${dimensions.height} H0 Z`;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            <svg width="100%" height="100%" className="fixed inset-0">
                <path 
                    d={pathData} 
                    fill="rgba(0,0,0,0.8)" 
                    fillRule="evenodd"
                    className="transition-all duration-300 ease-in-out pointer-events-auto"
                />
            </svg>
            
            {/* Positioning wrapper with explicit width */}
            <div
                className="fixed pointer-events-auto w-72 max-w-[80vw]"
                style={{ ...tooltipPositionStyles, zIndex: 10000 }}
            >
                {/* Styling and Animation wrapper */}
                <div 
                    className="bg-gray-800 border-2 border-cyan-500 rounded-xl p-4 shadow-2xl animate-fade-in-up text-center"
                >
                    <h3 className="text-xl font-orbitron font-bold text-cyan-400 mb-2">{config.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{config.text}</p>
                    {config.hasNextButton && (
                        <StyledButton onClick={onNext} className="w-full">
                            Next
                        </StyledButton>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};
