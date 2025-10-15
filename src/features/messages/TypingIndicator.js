import './TypingIndicator.css';

const TypingIndicator = ({
                             text = "typing",
                             color = "#1890ff",
                             size = "small",
                             isMobile = false,
                             style = {}
                         }) => {
    const dotSizes = {
        small: { width: isMobile ? "2.5px" : "3px", height: isMobile ? "2.5px" : "3px" },
        medium: { width: isMobile ? "3.5px" : "4px", height: isMobile ? "3.5px" : "4px" },
        large: { width: isMobile ? "4.5px" : "5px", height: isMobile ? "4.5px" : "5px" }
    };

    const fontSize = {
        small: isMobile ? "11px" : "12px",
        medium: isMobile ? "13px" : "14px",
        large: isMobile ? "15px" : "16px"
    };

    return (
        <span
            className="typing-indicator"
            style={{
                color,
                fontSize: fontSize[size],
                ...style
            }}
        >
      {text}
            <span className="typing-dots" style={{ marginLeft: isMobile ? "3px" : "4px" }}>
        <span
            className="typing-dot"
            style={{
                ...dotSizes[size],
                backgroundColor: color
            }}
        />
        <span
            className="typing-dot"
            style={{
                ...dotSizes[size],
                backgroundColor: color
            }}
        />
        <span
            className="typing-dot"
            style={{
                ...dotSizes[size],
                backgroundColor: color
            }}
        />
      </span>
    </span>
    );
};

export default TypingIndicator;