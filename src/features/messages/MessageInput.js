import { Input, Button, Space, Popover } from "antd";
import { AudioOutlined, PlusOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import { EmojiPicker } from "./EmojiPicker";
import { useRef, useState } from "react";

const { TextArea } = Input;

const MessageInput = ({
                        value,
                        onChange,
                        onSend,
                        onKeyPress,
                        placeholder = "Type a message...",
                        disabled = false
                      }) => {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const textAreaRef = useRef(null);

  const handleEmojiSelect = (emoji) => {
    if (textAreaRef.current) {
      const textarea = textAreaRef.current.resizableTextArea.textArea;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.slice(0, start) + emoji + value.slice(end);

      onChange({ target: { value: newValue } });

      // Set cursor position after emoji
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    }
    setEmojiPickerVisible(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
    if (onKeyPress) {
      onKeyPress(e);
    }
  };

  return (
    <div style={{
      padding: '12px 16px',
      borderTop: '1px solid #f0f0f0',
      backgroundColor: '#fff',
      position: 'sticky',
      bottom: 0
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        width: '100%'
      }}>
        {/* Attachment button */}
        <Button
          icon={<PlusOutlined />}
          style={{
            borderRadius: '20px 0 0 20px',
            height: '40px',
            borderColor: '#d9d9d9',
            color: '#8c8c8c',
            minWidth: '40px',
            flexShrink: 0
          }}
          onClick={() => {
            console.log('Attachment clicked');
          }}
        />

        {/* Text input wrapper */}
        <div style={{ flex: 1, position: 'relative' }}>
          <TextArea
            ref={textAreaRef}
            value={value}
            onChange={onChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            autoSize={{
              minRows: 1,
              maxRows: 4
            }}
            style={{
              resize: 'none',
              borderRadius: '0',
              border: '1px solid #d9d9d9',
              borderLeft: 'none',
              borderRight: 'none',
              fontSize: '14px',
              padding: '8px 12px',
              lineHeight: '1.65',
              minHeight: '70px',
            }}
          />
        </div>

        {/* Emoji picker button */}
        <Popover
          content={<EmojiPicker onEmojiSelect={handleEmojiSelect} />}
          trigger="click"
          placement="topRight"
          open={emojiPickerVisible}
          onOpenChange={() => {}}
        >
          <Button
            icon={<SmileOutlined />}
            onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
            style={{
              borderRadius: '0',
              height: '40px',
              borderColor: '#d9d9d9',
              color: '#8c8c8c',
              minWidth: '40px',
              borderLeft: 'none',
              flexShrink: 0
            }}
          />
        </Popover>

        {/* Send/Microphone button */}
        <Button
          type={value?.trim() ? "primary" : "default"}
          icon={value?.trim() ? <SendOutlined /> : <AudioOutlined />}
          onClick={() => {
            if (value?.trim()) {
              onSend();
            } else {
              console.log('Microphone clicked');
            }
          }}
          disabled={disabled}
          style={{
            borderRadius: '0 20px 20px 0',
            height: '40px',
            minWidth: '40px',
            backgroundColor: value?.trim() ? '#1890ff' : '#f5f5f5',
            borderColor: value?.trim() ? '#1890ff' : '#d9d9d9',
            color: value?.trim() ? '#fff' : '#8c8c8c',
            flexShrink: 0
          }}
        />
      </div>
    </div>
  );
};

export default MessageInput;