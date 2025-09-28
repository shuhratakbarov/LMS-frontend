import './TypingIndicator.css'; // You'll need to add this CSS file

const TypingIndicator = ({
                           text = "typing",
                           color = "#1890ff",
                           size = "small", // small, medium, large
                           style = {}
                         }) => {
  const dotSizes = {
    small: { width: '3px', height: '3px' },
    medium: { width: '4px', height: '4px' },
    large: { width: '5px', height: '5px' }
  };

  const fontSize = {
    small: '12px',
    medium: '14px',
    large: '16px'
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
      <span className="typing-dots" style={{ marginLeft: '4px' }}>
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