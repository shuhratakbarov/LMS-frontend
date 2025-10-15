export const EmojiPicker = ({ onEmojiSelect, isMobile }) => {
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
            width: isMobile ? "280px" : "320px",
            maxHeight: isMobile ? "180px" : "200px",
            overflow: "auto",
            padding: isMobile ? "6px" : "8px"
        }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(7, 1fr)" : "repeat(8, 1fr)",
                gap: isMobile ? "3px" : "4px"
            }}>
                {emojis.map((emoji, index) => (
                    <button
                        key={index}
                        onClick={() => onEmojiSelect(emoji)}
                        style={{
                            border: "none",
                            background: "transparent",
                            fontSize: isMobile ? "18px" : "20px",
                            cursor: "pointer",
                            padding: isMobile ? "3px" : "4px",
                            borderRadius: "4px",
                            transition: "background-color 0.2s",
                            minHeight: isMobile ? "32px" : "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};