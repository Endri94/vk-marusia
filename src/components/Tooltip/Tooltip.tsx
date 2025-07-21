// Tooltip.tsx
import './Tooltip.css';

export const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => (
    <div className="tooltip-container">
        {children}
        <span className="tooltip-text">{text}</span>
    </div>
);