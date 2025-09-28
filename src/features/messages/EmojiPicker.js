export const EmojiPicker = ({ onEmojiSelect }) => {
  const emojis = [
    '😀', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍',
    '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪',
    '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔',
    '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢',
    '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱',
    '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶',
    '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱',
    '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤧', '😷', '🤒', '🤕',
    '🤑', '🤠', '👻', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '👍', '👎',
    '👌', '🤏', '✌️', '🤞', '👈', '👉', '👆', '👇', '☝️', '👍',
    '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝',
    '🙏', '✍️'
  ];

  return (
    <div style={{
      width: '320px',
      maxHeight: '200px',
      overflow: 'auto',
      padding: '8px'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '4px'
      }}>
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onEmojiSelect(emoji)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};