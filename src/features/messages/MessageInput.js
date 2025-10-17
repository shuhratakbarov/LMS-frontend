import { Input, Button, Popover } from "antd";
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

            // Don't refocus on mobile to prevent keyboard reopening
            if (!isMobile) {
                setTimeout(() => {
                    textarea.focus();
                    textarea.setSelectionRange(start + emoji.length, start + emoji.length);
                }, 0);
            }
        }
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
            borderTop: "1px solid #e8e8e8",
            background: "#fff",
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10
        }}>
            <div style={{
                border: "1px solid #d9d9d9",
                background: "#fafafa",
                display: "flex",
                alignItems: "flex-end",
                transition: "all 0.2s ease",
                overflow: "hidden"
            }}>
                <Button
                    type="text"
                    icon={<PlusOutlined />}
                    style={{
                        color: "#595959",
                        minWidth: isMobile ? "40px" : "44px",
                        height: isMobile ? "40px" : "44px",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isMobile ? "16px" : "18px",
                        flexShrink: 0,
                        border: "none",
                        borderRadius: 0
                    }}
                    onClick={() => console.log("Attachment clicked")}
                />

                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end"
                }}>
                    <TextArea
                        ref={textAreaRef}
                        value={value}
                        onChange={onChange}
                        onKeyPress={handleKeyPress}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoSize={{
                            minRows: 1,
                            maxRows: isMobile ? 4 : 6
                        }}
                        style={{
                            resize: "none",
                            border: "none",
                            background: "transparent",
                            fontSize: isMobile ? "14px" : "15px",
                            padding: isMobile ? "10px 8px" : "12px 10px",
                            lineHeight: "1.5",
                            boxShadow: "none",
                            minHeight: isMobile ? "40px" : "44px",
                            height: isMobile ? "40px" : "44px"
                        }}
                        className="telegram-input"
                    />
                </div>

                <Popover
                    content={<EmojiPicker onEmojiSelect={handleEmojiSelect} isMobile={isMobile} />}
                    trigger="click"
                    placement="topRight"
                    open={emojiPickerVisible}
                    onOpenChange={setEmojiPickerVisible}
                >
                    <Button
                        type="text"
                        icon={<SmileOutlined />}
                        style={{
                            color: "#595959",
                            minWidth: isMobile ? "40px" : "44px",
                            height: isMobile ? "40px" : "44px",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: isMobile ? "16px" : "18px",
                            flexShrink: 0,
                            border: "none",
                            borderRadius: 0
                        }}
                    />
                </Popover>

                <Button
                    type="text"
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
                        color: value?.trim() ? "#1890ff" : "#595959",
                        minWidth: isMobile ? "40px" : "44px",
                        height: isMobile ? "40px" : "44px",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isMobile ? "16px" : "18px",
                        flexShrink: 0,
                        transition: "all 0.2s ease",
                        border: "none",
                        borderRadius: 0
                    }}
                />
            </div>

            <style>{`
                .telegram-input textarea {
                    background: transparent !important;
                }
                .telegram-input textarea:focus {
                    box-shadow: none !important;
                    border: none !important;
                }
                .telegram-input:hover {
                    background: transparent !important;
                }
            `}</style>
        </div>
    );
};

export default MessageInput;