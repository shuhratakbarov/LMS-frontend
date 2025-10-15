import { Input, Button, Space, Popover } from "antd";
import { AudioOutlined, PlusOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import { EmojiPicker } from "./EmojiPicker";
import { useRef, useState } from "react";

const { TextArea } = Input;

const MessageInput = ({
                          value,
                          onChange,
                          onSend,
                          placeholder = "Type a message...",
                          isMobile,
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

            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + emoji.length, start + emoji.length);
            }, 0);
        }
        setEmojiPickerVisible(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value?.trim() && !disabled) {
                onSend();
            }
        }
    };

    return (
        <div style={{
            padding: isMobile ? "8px 12px" : "12px 16px",
            borderTop: "1px solid #f0f0f0",
            background: "#fff",
            position: "sticky",
            bottom: 0
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                width: "100%"
            }}>
                {/* Attachment button */}
                <Button
                    icon={<PlusOutlined />}
                    style={{
                        borderRadius: isMobile ? "16px 0 0 16px" : "20px 0 0 20px",
                        height: isMobile ? "36px" : "40px",
                        borderColor: "#d9d9d9",
                        color: "#8c8c8c",
                        minWidth: isMobile ? "36px" : "40px",
                        flexShrink: 0,
                        fontSize: isMobile ? "14px" : "16px"
                    }}
                    onClick={() => console.log("Attachment clicked")}
                />

                {/* Text input */}
                <div style={{ flex: 1, position: "relative" }}>
                    <TextArea
                        ref={textAreaRef}
                        value={value}
                        onChange={onChange}
                        onKeyPress={handleKeyPress}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoSize={{
                            minRows: 1,
                            maxRows: isMobile ? 3 : 4
                        }}
                        style={{
                            resize: "none",
                            borderRadius: 0,
                            border: "1px solid #d9d9d9",
                            borderLeft: "none",
                            borderRight: "none",
                            fontSize: isMobile ? "14px" : "15px",
                            padding: isMobile ? "6px 10px" : "8px 12px",
                            lineHeight: "1.65",
                            minHeight: isMobile ? "36px" : "40px"
                        }}
                    />
                </div>

                {/* Emoji picker button */}
                <Popover
                    content={<EmojiPicker onEmojiSelect={handleEmojiSelect} isMobile={isMobile} />}
                    trigger="click"
                    placement={isMobile ? "topLeft" : "topRight"}
                    open={emojiPickerVisible}
                    onOpenChange={setEmojiPickerVisible}
                >
                    <Button
                        icon={<SmileOutlined />}
                        style={{
                            borderRadius: 0,
                            height: isMobile ? "36px" : "40px",
                            borderColor: "#d9d9d9",
                            color: "#8c8c8c",
                            minWidth: isMobile ? "36px" : "40px",
                            borderLeft: "none",
                            flexShrink: 0,
                            fontSize: isMobile ? "14px" : "16px"
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
                            console.log("Microphone clicked");
                        }
                    }}
                    disabled={disabled}
                    style={{
                        borderRadius: isMobile ? "0 16px 16px 0" : "0 20px 20px 0",
                        height: isMobile ? "36px" : "40px",
                        minWidth: isMobile ? "36px" : "40px",
                        backgroundColor: value?.trim() ? "#1890ff" : "#f5f5f5",
                        borderColor: value?.trim() ? "#1890ff" : "#d9d9d9",
                        color: value?.trim() ? "#fff" : "#8c8c8c",
                        flexShrink: 0,
                        fontSize: isMobile ? "14px" : "16px"
                    }}
                />
            </div>
        </div>
    );
};

export default MessageInput;